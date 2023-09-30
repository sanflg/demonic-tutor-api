const express = require('express');

const DeckCalls = require('../../controllers/deck');
const CardDeckRouter = require('./cardDeck');
const errorHandler = require('../../utils/callUtils/errorHandler');

const router = express.Router();

/** Route for card operations.*/
router.use('/:id/cards', CardDeckRouter.router);

/** Deck calls.*/
router.get('/:id', DeckCalls.getDeckById);
router.patch('/:id', DeckCalls.updateDeck);
router.delete('/:id', DeckCalls.deleteDeck);
router.get('/', DeckCalls.getDecks);
router.post('/', DeckCalls.createDeck);

/** Error handling for bad calls.*/
router.use('/:id', (req, res) => errorHandler.methodNotAllowed(res, req, `Valid methods [GET, PATCH, DELETE].`));
router.use('/', (req, res) => errorHandler.methodNotAllowed(res, req, `Valid methods [GET, POST].`));
router.use((req, res) => errorHandler.notFound(res, req, `List of available endpoints: 'ADD SOMETHING HERE'.`));

exports.router = router;