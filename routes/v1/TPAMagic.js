const express = require('express');

const TPAMagicCalls = require('../../controllers/TPAMagic');
const errorHandler = require('../../utils/callUtils/errorHandler');

const router = express.Router();

/** TPAMagic calls.*/
router.use('/sets/:id/booster', TPAMagicCalls.getTPA);
router.use('/sets/:id', TPAMagicCalls.getTPA);
router.use('/cards/:id', TPAMagicCalls.getTPA);
router.use('/cards', TPAMagicCalls.getCards);
router.use('/sets', TPAMagicCalls.getTPA);
router.use('/types', TPAMagicCalls.getTPA);
router.use('/subtypes', TPAMagicCalls.getTPA);
router.use('/supertypes', TPAMagicCalls.getTPA);
router.use('/formats', TPAMagicCalls.getTPA);

/** Error handling for bad calls.*/
router.use((req, res) =>
	errorHandler.notFound(res, req, `Available urls for TPAMagic api listed in 'https://docs.magicthegathering.io/'.`));

exports.router = router;