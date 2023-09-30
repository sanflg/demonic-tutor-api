const Card = require('../models/Card');
const Deck = require('../models/Deck');
const User = require('../models/User');
const UserController = require('./user');
const CardDeckCount = require('../models/CardDeckCount');
const DeckController = require('./deck');
const errorHandler = require('../utils/callUtils/errorHandler');
const callHandler = require('../utils/callUtils/callHandler');

const BasicCardController = require('./basicCardController');
const TPAMagicCalls = require('./TPAMagic');
const { Op } = require("sequelize");

const errorMessageForBadAdd = 'Error: Card not in DataBase nor Third Party registers, please evaluate if ID is correct.';

async function getCardsFromDeck(req, res) {
	const user = await User.findByPk(DeckController.extractUserIdFromUrl(req));
	if (user == null) return errorHandler.notFound(res, req, `User with ID '${DeckController.extractUserIdFromUrl(req)}' not found.`);
	const deck = await Deck.findByPk(extractDeckIdFromUrl(req));
	if (deck == null) return errorHandler.notFound(res, req, `Deck with ID '${extractDeckIdFromUrl(req)}' not found.`);
	const cardDeck = await CardDeckCount.findAll({ where: { deckId: deck.id } });
	callHandler.handleWithBody(res, req, 200, cardDeck);


};

async function addCardsToDeck(req, res) {
	const user = await User.findByPk(DeckController.extractUserIdFromUrl(req));
	if (user == null) return errorHandler.notFound(res, req, `User with ID '${DeckController.extractUserIdFromUrl(req)}' not found.`);
	const deck = await Deck.findByPk(extractDeckIdFromUrl(req));
	if (deck == null) return errorHandler.notFound(res, req, `Deck with ID '${extractDeckIdFromUrl(req)}' not found.`);

	let listOfRequestedCards = req.body.cards;
	let responseBody = { response: [] };

	const missingIds = await BasicCardController.getCardsIdsNotInDDBB(req.body);

	if (missingIds.length > 0) {
		const response = await TPAMagicCalls.getFromTPA('/' + buildEndpointWithIds(missingIds))
		const cards = await Card.bulkCreate(response.cards, { returning: true })
		let TPAMagicResponseCardsIds = cards.map(card => card.id);

		for (let requestedCard of listOfRequestedCards) {
			if (!(TPAMagicResponseCardsIds.includes(requestedCard.id)) && missingIds.includes(requestedCard.id)) {
				updateCreateOrUpdateCardDeckMessage(requestedCard, responseBody, errorMessageForBadAdd)
			} else {
				await createOrUpdateCardDeckAndSetMessage(req, requestedCard, responseBody)
			}
		}
	} else {
		for (let requestedCard of listOfRequestedCards) {
			await createOrUpdateCardDeckAndSetMessage(req, requestedCard, responseBody)
		}
	}
	return callHandler.handleWithBody(res, req, 200, responseBody);
};

function patchCardsFromDeck(missingIds) {

};

async function deleteCardsFromDeck(req, res) {

	let listOfRequestedCards = BasicCardController.mapCardsIdAndBuildSearchArray(req.body).map(card => card.id);
	const cardDeckCountArray = await CardDeckCount.findAll({where: {deckId: extractDeckIdFromUrl(req)}});
	const cardsToDelete = cardDeckCountArray.map(card => card.dataValues.cardId).filter(id => listOfRequestedCards.includes(id));
	const deletedCards = await CardDeckCount.destroy({where: {
		[Op.and]:{
			deckId: extractDeckIdFromUrl(req),
			cardId: cardsToDelete
		}
	}});
	let body = {response : []};
	for (let id of listOfRequestedCards){
		let card = {id: id, message: ''};
		if (cardsToDelete.includes(card.id)) card.message = 'Deleted.'
		else card.message = 'Card not found in deck.'
		body.response.push(card);
	}
	return callHandler.handleWithBody(res, req, 200, body);
};

async function updateCreateOrUpdateCardDeckMessage(requestedCard, responseBody, message) {
	responseBody.response.push({
		id: requestedCard.id,
		quantity: requestedCard.quantity,
		result: message
	})
}

/**
 * Function: Check that deck and user exist.
 * Then, format the message.
 * @param {Express.Request} res
 * */
async function userAndDeckExist(res) {
	const user = await User.findByPk(DeckController.extractUserIdFromUrl(req));
	if (user == null) return false, `User with ID '${DeckController.extractUserIdFromUrl(req)}' not found.`;
	const deck = await Deck.findByPk(extractDeckIdFromUrl(req));
	if (deck == null) return false, `Deck with ID '${extractDeckIdFromUrl(req)}' not found.`;
	return true
}

/**
 * Function: Store card deck relationship object id if not exist, else, update it.
 * Then, format the message.
 * @param {Express.Request} req
 * @param {Card} requestedCard
 * @param {String} responseBody
 * */
async function createOrUpdateCardDeckAndSetMessage(req, requestedCard, responseBody) {
	const message = await createOrUpdateCardDeckRelationObject(req, requestedCard, responseBody)
	updateCreateOrUpdateCardDeckMessage(requestedCard, responseBody, message)
}

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
	return req.baseUrl.split('/')[5];
};

module.exports = {
	getCardsFromDeck, patchCardsFromDeck, addCardsToDeck, deleteCardsFromDeck
};