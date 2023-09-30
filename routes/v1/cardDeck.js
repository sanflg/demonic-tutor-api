const express = require('express');

const CardDeckCalls = require('../../controllers/cardDeck');
const errorHandler = require('../../utils/callUtils/errorHandler');

const router = express.Router();

/** Card calls.*/
router.get('/', CardDeckCalls.getCardsFromDeck);
router.post('/', CardDeckCalls.addCardsToDeck);
router.patch('/', CardDeckCalls.patchCardsFromDeck);
router.delete('/', CardDeckCalls.deleteCardsFromDeck);

/** Error handling for bad calls.*/
router.use('/', (req, res) => errorHandler.methodNotAllowed(res, req, `Valid methods [GET, POST, PATCH, DELETE].`));
router.use((req, res) => errorHandler.notFound(res, req, `List of available endpoints: 'ADD SOMETHING HERE'.`));

exports.router = router;