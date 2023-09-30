const express = require('express');

const DeckRouter = require('./deck');
const UserCalls = require('../../controllers/user');
const errorHandler = require('../../utils/callUtils/errorHandler');

const router = express.Router();

/** Route for deck operations.*/
router.use('/:id/decks', DeckRouter.router);

/** User calls.*/
router.post('/signUp', UserCalls.signUp);
router.get('/:id', UserCalls.getUserById);
router.patch('/:id', UserCalls.updateUser);
router.delete('/:id', UserCalls.deleteUser);
router.get('/', UserCalls.getUsers);

/** Error handling for bad calls.*/
router.use('/:id', (req, res) => errorHandler.methodNotAllowed(res, req, `Valid methods [GET, PATCH, DELETE].`));
router.use('/', (req, res) => errorHandler.methodNotAllowed(res, req, `Valid methods [GET, POST].`));
router.use((req, res) => errorHandler.notFound(res, req, `List of available endpoints: 'ADD SOMETHING HERE'.`));

exports.router = router;