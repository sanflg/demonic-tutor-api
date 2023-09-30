const express = require('express');

const AuthCalls = require('../../controllers/auth');
const errorHandler = require('../../utils/callUtils/errorHandler');

const router = express.Router();

router.post('/generateToken', AuthCalls.generateToken);

router.use('/generateToken', (req, res) => errorHandler.methodNotAllowed(res, req, `Valid methods [POST].`));

router.use((req, res) => errorHandler.notFound(res, req, `List of available endpoints: 'ADD SOMETHING HERE'.`));

exports.router = router;