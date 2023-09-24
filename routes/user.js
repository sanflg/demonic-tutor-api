const express = require('express');

const UserCalls = require('../controllers/user');
const errorHandler = require('../callUtils/errorHandler');

const router = express.Router();

//TODO: check how to route invalid methods (403 Forbidden) to same error.
router.get('/:id', UserCalls.getUserById);
router.get('/', UserCalls.getUsers);
router.post('/', UserCalls.createUser);
router.delete('/:id', UserCalls.deleteUser);

router.use((req, res) => errorHandler.notFound(
  res, 
  `List of available endpoints: 'ADD SOMETHING HERE'.`
));

exports.router = router;