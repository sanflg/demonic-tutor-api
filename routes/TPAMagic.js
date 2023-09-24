const express = require('express');

const TPAMagicCalls = require('../controllers/TPAMagic').getTPA;
const errorHandler = require('../callUtils/errorHandler');

const router = express.Router();

router.use('/cards', TPAMagicCalls);
router.use('/cards/:id', TPAMagicCalls);
router.use('/sets', TPAMagicCalls);
router.use('/sets/:id', TPAMagicCalls);
router.use('/sets/:id/booster', TPAMagicCalls);
router.use('/types', TPAMagicCalls);
router.use('/subtypes', TPAMagicCalls);
router.use('/supertypes', TPAMagicCalls);
router.use('/formats', TPAMagicCalls);

router.use((req, res, next) =>
    errorHandler.notFound(res, `Available urls for TPAMagic api listed in 'https://docs.magicthegathering.io/'.`));

exports.router = router;