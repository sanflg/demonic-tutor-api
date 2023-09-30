const Card = require('../models/Card');
const Deck = require('../models/Deck');
const User = require('../models/User');
const UserController = require('./user');
const CardDeckCount = require('../models/CardDeckCount');
const DeckController = require('./deck');
const errorHandler = require('../utils/callUtils/errorHandler');
const callHandler = require('../utils/callUtils/callHandler');
const BasicCardController = require('./CommonCardDeckController');
const TPAMagicCalls = require('./TPAMagic');
const { Op } = require("sequelize");

const errorMessageForBadAdd = 'Error: Card not in DataBase nor Third Party registers, please evaluate if ID is correct.';

/**
 * Call: Get all cards in a deck. 
 * @param {Express.Request} req
 * @param {Express.Response} res
 * */
async function getCardsFromDeck(req, res) {
	let userAndDeckResult = await userAndDeck(req);
	if (userAndDeckResult.error != null) return errorHandler.notFound(res, req, userAndDeckResult.error);
	const cardDeck = await CardDeckCount.findAll({ where: { deckId: extractDeckIdFromUrl(req) } });
	callHandler.handleWithBody(res, req, 200, cardDeck);
};

/**
 * Call: Delete a list of cards to a deck. 
 * @param {Express.Request} req
 * @param {Express.Response} res
 * */
async function patchCardsFromDeck(req, res) {
	let userAndDeckResult = await userAndDeck(req);
	if (userAndDeckResult.error != null) return errorHandler.notFound(res, req, userAndDeckResult.error);
	const response = { response: [] };
	const cardsRequested = req.body.cards;

	console.log(cardsRequested)

	const cardDeckArray = await CardDeckCount.findAll({
		where: {
			deckId: extractDeckIdFromUrl(req),
			[Op.or]: {
				cardId: BasicCardController.mapCardsIdAndBuildSearchArray(req.body).map(cards => cards.id)
			}
		}
	});

	const cardsRequestedNotFound = cardsRequested.filter(requested => 
		!cardDeckArray.map(card => card.dataValues.cardId).includes(requested.id))
		.map(requested => requested.id);
	const cardsRequestedToDelete = cardsRequested.filter(requested => requested.quantity == 0)
		.map(requested => requested.id);
	const cardsForErrorBadNumber = cardsRequested.filter(requested => requested.quantity < 0)
		.map(requested => requested.id);
	const cardsRequestedToUpdate = cardsRequested.filter(requested =>
		!cardsRequestedToDelete.includes(requested.id) &&
		!cardsForErrorBadNumber.includes(requested.id) &&
		!cardsRequestedNotFound.includes(requested.id));
		
	const cardsToDelete = cardDeckArray.filter(card => cardsRequestedToDelete.includes(card.dataValues.cardId))
		.map(card => card.dataValues.cardId);

	const cardsToUpdate = [];

	for (let cardToUpdateInRequest of cardsRequestedToUpdate) {
		let cardToBeUpdated = cardDeckArray.filter(card => card.dataValues.cardId == cardToUpdateInRequest.id)[0].dataValues;
		cardToBeUpdated.quantity = cardToUpdateInRequest.quantity;
		cardsToUpdate.push(cardToBeUpdated)
	};

	await CardDeckCount.destroy({ where: { [Op.and]: { deckId: extractDeckIdFromUrl(req), cardId: cardsToDelete } } })
	await CardDeckCount.bulkCreate(cardsToUpdate, { updateOnDuplicate: ['quantity'] });

	for (let cardToSendMessage of cardsRequested) {
		if (cardsRequestedNotFound.includes(cardToSendMessage.id)) {
			response.response.push({ id: cardToSendMessage.id, quantity: 'Error.', message: 'Card not found in deck.' });
		} else if (cardsRequestedToDelete.includes(cardToSendMessage.id)) {
			response.response.push({ id: cardToSendMessage.id, quantity: 0, message: 'Deleted.' });
		} else if (cardsForErrorBadNumber.includes(cardToSendMessage.id)) {
			response.response.push({ id: cardToSendMessage.id, quantity: 'Error.', message: 'Quantity < 0 is not valid.' });
		} else if (cardsRequestedToUpdate.map(request => request.id).includes(cardToSendMessage.id)) {
			response.response.push({ id: cardToSendMessage.id, quantity: cardToSendMessage.quantity, message: 'Quantity updated.' });
		};
	};
	return callHandler.handleWithBody(res, req, 200, response);
};

/**
 * Call: Add a list of cards to a deck. 
 * @param {Express.Request} req
 * @param {Express.Response} res
 * */
async function addCardsToDeck(req, res) {
	let userDeckResponse = await userAndDeck(req);
	if (userDeckResponse.error != null) return errorHandler.notFound(res, req, userDeckResponse.error);

	let listOfRequestedCards = req.body.cards;
	let responseBody = { response: [] };

	const missingIds = await BasicCardController.getCardsIdsNotInDDBB(req.body);

	if (missingIds.length > 0) {
		const response = await TPAMagicCalls.getFromTPA('/' + buildEndpointWithIds(missingIds));
		const cards = await Card.bulkCreate(response.cards, { returning: true });
		let TPAMagicResponseCardsIds = cards.map(card => card.id);

		for (let requestedCard of listOfRequestedCards) {
			if (!(TPAMagicResponseCardsIds.includes(requestedCard.id)) && missingIds.includes(requestedCard.id)) {
				updateOrCreateCardDeckMessage(requestedCard, responseBody, errorMessageForBadAdd);
			} else {
				await createOrUpdateCardDeckAndSetMessage(req, requestedCard, responseBody);
			};
		};
	} else {
		for (let requestedCard of listOfRequestedCards) {
			await createOrUpdateCardDeckAndSetMessage(req, requestedCard, responseBody);
		};
	};
	return callHandler.handleWithBody(res, req, 200, responseBody);
};

/**
 * Call: Delete a list of cards to a deck. 
 * @param {Express.Request} req
 * @param {Express.Response} res
 * */
async function deleteCardsFromDeck(req, res) {
	let userAndDeckResult = await userAndDeck(req);
	if (userAndDeckResult.error != null) return errorHandler.notFound(res, req, userAndDeckResult.error);

	let listOfRequestedCardsToDelete = req.body.cards.map(card => card.id);
	const cardDeckCountArray = await CardDeckCount.findAll({ where: { deckId: extractDeckIdFromUrl(req) } });

	const cardsToDelete = cardDeckCountArray.map(card => card.dataValues.cardId).filter(id => listOfRequestedCardsToDelete.includes(id));
	await CardDeckCount.destroy({
		where: {
			[Op.and]: {
				deckId: extractDeckIdFromUrl(req),
				cardId: cardsToDelete
			}
		}
	});
	let body = { response: [] };
	for (let id of listOfRequestedCardsToDelete) {
		let card = { id: id, message: '' };
		if (cardsToDelete.includes(card.id)) card.message = 'Deleted.'
		else card.message = 'Card not found in deck.'
		body.response.push(card);
	}
	return callHandler.handleWithBody(res, req, 200, body);
};

/**
 * Function: Update or create a list of cards in a deck. 
 * @param {Express.Request} req
 * @param {Express.Response} res
 * */
async function updateOrCreateCardDeckMessage(requestedCard, responseBody, message) {
	responseBody.response.push({
		id: requestedCard.id,
		quantity: requestedCard.quantity,
		result: message
	});
};

/**
 * Function: Check that deck and user exist.
 * @param {Express.Request} req
 * */
async function userAndDeck(req) {
	let response = { user: null, deck: null, error: null };
	let user = await User.findByPk(req.originalUrl.split('/')[3]);
	if (user == null) {
		response.error = `User with ID '${req.originalUrl.split('/')[3]}' not found.`;
		return response;
	}
	response.user = user.dataValues;
	let deck = await Deck.findByPk(extractDeckIdFromUrl(req));
	if (deck == null) {
		response.error = `Deck with ID '${extractDeckIdFromUrl(req)}' not found.`;
		return response;
	}
	response.deck = deck.dataValues;
	return response;
};

/**
 * Function: Store card deck relationship object id if not exist, else, update it.
 * Then, format the message.
 * @param {Express.Request} req
 * @param {Card} requestedCard
 * @param {String} responseBody
 * */
async function createOrUpdateCardDeckAndSetMessage(req, requestedCard, responseBody) {
	const message = await createOrUpdateCardDeckRelationObject(req, requestedCard, responseBody);
	updateOrCreateCardDeckMessage(requestedCard, responseBody, message);
};

/**
 * Function: Store card deck relationship object id if not exist, else, update it.
 * @param {Express.Request} req
 * @param {Card} requestedCard
 * */
async function createOrUpdateCardDeckRelationObject(req, requestedCard) {
	const [cardDeck, created] = await CardDeckCount.findOrCreate({
		where:
		{
			deckId: extractDeckIdFromUrl(req),
			cardId: requestedCard.id
		}
	});
	if (!created) {
		cardDeck.quantity += requestedCard.quantity;
		message = `Increased quantity to ${cardDeck.quantity}.`;
	} else {
		cardDeck.quantity = requestedCard.quantity;
		message = 'Added.'
	};
	await cardDeck.save();
	return message;
};

/**
 * Function: Build Endpoint from ids Array.
 * @param {String[]} missingIds
 * */
function buildEndpointWithIds(missingIds) {
	endpoint = 'cards?id=';
	for (let id of missingIds) {
		endpoint += id + ',';
	};
	return endpoint;
};

/**
 * Function: Extract deck id from request url.
 * @param {Express.Response} req
 * */
function extractDeckIdFromUrl(req) {
	return req.originalUrl.split('/')[5];
};

module.exports = {
	getCardsFromDeck, patchCardsFromDeck, addCardsToDeck, deleteCardsFromDeck, userAndDeck
};