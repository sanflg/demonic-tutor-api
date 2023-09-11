const express = require('express');

const TPAMagicCall = require('../controllers/TPAMagic').getTPA;
const errorHandling = require('../utils/errorHandling');

const router = express.Router();

router.use('/cards', TPAMagicCall);
router.use('/cards/:id', TPAMagicCall);
router.use('/sets', TPAMagicCall);
router.use('/sets/:id', TPAMagicCall);
router.use('/sets/:id/booster', TPAMagicCall);
router.use('/types', TPAMagicCall);
router.use('/subtypes', TPAMagicCall);
router.use('/supertypes', TPAMagicCall);
router.use('/formats', TPAMagicCall);

//If no call url is matched by previous routes, the call will be catched by this 404 one.
router.use('/',(req, res, next) =>  {
    res.set('Content-Type', 'application/json');
    errorHandling(res, 404, `Not found.`, `Available urls for TPAMagic api listed in 'https://docs.magicthegathering.io/'.`)
});

exports.router = router;