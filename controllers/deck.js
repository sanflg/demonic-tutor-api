const Deck = require('../models/Deck');
const User = require('../models/User');
const UserController = require('./user');
const errorHandler = require('../utils/callUtils/errorHandler');
const callHandler = require('../utils/callUtils/callHandler');

/**
 * Call: Get deck by id. 
 * @param {Express.Request} req
 * @param {Express.Response} res
 * */
async function getDeckById(req, res) {
  const user = await User.findByPk(extractUserIdFromUrl(req));
  if (user == null) return errorHandler.notFound(res, req, `User with ID '${extractUserIdFromUrl(req)}' not found.`);
  const deck = await Deck.findByPk(req.params.id);
  if (deck == null) return errorHandler.notFound(res, req, `Deck with ID '${req.params.id}' not found.`);
  callHandler.handleWithBody(res, req, 200, deck);
};

/**
 * Call: Bulk deck get. 
 * @param {Express.Request} req
 * @param {Express.Response} res
 * */
async function getDecks(req, res) {
  const user = await User.findByPk(extractUserIdFromUrl(req));
  if (user != null) {
    const deck = await Deck.findAll({ where: { userId: user.dataValues.id } });
    return callHandler.handleWithBody(res, req, 200, deck);
  };
  return errorHandler.notFound(res, req, `User with ID '${extractUserIdFromUrl(req)}' not found.`);
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
  const deck = await Deck.findByPk(req.params.id);
  if (deck !== null) {
    deck.name = null === req.body.name ? deck.name : req.body.name;
    deck.archetype = null === req.body.archetype ? deck.archetype : req.body.archetype;
    deck.colorName = null === req.body.colorName ? deck.colorName : req.body.colorName;
    deck.save();
    return callHandler.handleWithBody(res, req, 200, deck);
  };
  return errorHandler.notFound(res, req, `Deck with ID '${req.params.id}' not found.`);
};

/**
 * Call: Delete deck. 
 * @param {Express.Request} req
 * @param {Express.Response} res
 * */
async function deleteDeck(req, res) {
  const user = await User.findByPk(extractUserIdFromUrl(req));
  if (user == null) return errorHandler.notFound(res, req, `User with ID '${extractUserIdFromUrl(req)}' not found.`);
  const deck = await Deck.findByPk(req.params.id);
  if (deck == null) return errorHandler.notFound(res, req, `Deck with ID '${req.params.id}' not found.`);
  deck.destroy();
  callHandler.handle(res, req, 204);
};

/**
 * Function: Extract user id from request url.
 * @param {Express.Request} req
 * */
function extractUserIdFromUrl(req) {
  return req.baseUrl.split('/')[3];
}

module.exports = { getDeckById, getDecks, createDeck, updateDeck, deleteDeck, extractUserIdFromUrl }

