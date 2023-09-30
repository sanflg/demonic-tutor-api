const express = require('express');

const router = express.Router();

const TPAMagicRoutes = require('./v1/TPAMagic');
const UserRoutes = require('./v1/user');

router.use('/TPAMagic', TPAMagicRoutes.router);
router.use('/user', UserRoutes.router);

router.use((req, res) => errorHandler.notFound(res, req, `List of available endpoints: 'ADD SOMETHING HERE'.`));

exports.router = router;