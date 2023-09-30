const Deck = require('../models/Deck');
const User = require('../models/User');
const UserController = require('./user');
const CardDeckController = require('./cardDeck');
const errorHandler = require('../utils/callUtils/errorHandler');
const callHandler = require('../utils/callUtils/callHandler');

/**
 * Call: Get deck by id. 
 * @param {Express.Request} req
 * @param {Express.Response} res
 * */
async function getDeckById(req, res) {
  let userAndDeck = await CardDeckController.userAndDeck(req);
  console.log(userAndDeck.error)
  if (userAndDeck.error != null) return errorHandler.notFound(res, req, userAndDeck.error);
  callHandler.handleWithBody(res, req, 200, userAndDeck.deck);
};

/**
 * Call: Bulk deck get. 
 * @param {Express.Request} req
 * @param {Express.Response} res
 * */
async function getDecks(req, res) {
  const user = await User.findByPk(extractUserIdFromUrl(req));
  if (user == null) return errorHandler.notFound(res, req, `User with ID '${extractUserIdFromUrl(req)}' not found.`);
  const deck = await Deck.findAll({ where: { userId: user.dataValues.id } });
  return callHandler.handleWithBody(res, req, 200, deck);
};

/**
 * Call: Bulk deck get. 
 * @param {Express.Request} req
 * @param {Express.Response} res
 * */
async function createDeck(req, res) {
  const user = await User.findByPk(extractUserIdFromUrl(req));
  if (user == null) return errorHandler.notFound(res, req, `User with ID '${extractUserIdFromUrl(req)}' not found.`);
  const deck = await Deck.create({
    name: req.body.name,
    archetype: req.body.archetype,
    colorName: req.body.colorName,
    userId: user.id
  });
  callHandler.handleWithBody(res, req, 201, deck);
};

/**
 * Call: Update deck data. 
 * @param {Express.Request} req
 * @param {Express.Response} res
 * */
async function updateDeck(req, res) {
  let userAndDeckResult = await CardDeckController.userAndDeck(req);
  if (userAndDeckResult.error != null) return errorHandler.notFound(res, req, userAndDeckResult.error);

  userAndDeckResult.deck.name = null === req.body.name ? userAndDeckResult.deck.name : req.body.name;
  userAndDeckResult.deck.archetype = null === req.body.archetype ? userAndDeckResult.deck.archetype : req.body.archetype;
  userAndDeckResult.deck.colorName = null === req.body.colorName ? userAndDeckResult.deck.colorName : req.body.colorName;
  userAndDeckResult.deck.save();
  return callHandler.handleWithBody(res, req, 200, deck);

};

/**
 * Call: Delete deck. 
 * @param {Express.Request} req
 * @param {Express.Response} res
 * */
async function deleteDeck(req, res) {
  let userAndDeckResult = await CardDeckController.userAndDeck(req);
  if (userAndDeckResult.error != null) return errorHandler.notFound(res, req, userAndDeckResult.error);
  userAndDeckResult.deck.destroy();
  callHandler.handle(res, req, 204);
};

/**
 * Function: Extract user id from request url.
 * @param {Express.Request} req
 * */
function extractUserIdFromUrl(req) {
  return req.originalUrl.split('/')[3];
};

module.exports = { getDeckById, getDecks, createDeck, updateDeck, deleteDeck, extractUserIdFromUrl }

