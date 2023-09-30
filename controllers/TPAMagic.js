const errorHandler = require('../utils/callUtils/errorHandler.js');
const callHandler = require('../utils/callUtils/callHandler');

const { checkCardsForStorage } = require('./CommonCardDeckController.js');

const TPAMagic = {
	version: 'v1',
	host: 'api.magicthegathering.io',
	port: 80,
	protocol: 'https://',
	headers: {
		'Accept-Encoding': 'gzip, deflate, br',
		Connection: 'keep-alive',
		Accept: '*/*'
	}
};

/**
 * Call: General GET MagicTPA handler. 
 * @param {Express.Response} req
 * @param {Express.Response} res
 * */
async function getTPA(req, res) {
	if (!methodNotAllowedTPAMagic(req, res)) {
		const TPAMagicResponse = await getFromTPA(req.originalUrl.substring(12))
		return callHandler.handleWithBody(res, req, res.statusCode, TPAMagicResponse);
	};
};

/**
 * Call: GET Cards MagicTPA handler to check storage. 
 * @param {Express.Response} req
 * @param {Express.Response} res
 * */
async function getCards(req, res) {
	if (!methodNotAllowedTPAMagic(req, res)) {
		const TPAMagicResponse = await getFromTPA(req.originalUrl.substring(12))
		callHandler.handleWithBody(res, req, res.statusCode, TPAMagicResponse);
		checkCardsForStorage(TPAMagicResponse);
	};
};

/**
 * Functional: Performs a GET to MagicTPA with request values and operate the response with a callback. 
 * @param {String} endpoint
 * */
async function getFromTPA(endpoint) {
	const MagicTPAresponse = await fetch(
		new Request(`
		${TPAMagic.protocol}
		${TPAMagic.host}/
		${TPAMagic.version}
		${endpoint}`, TPAMagic))
	return await MagicTPAresponse.json();
};

/**
 * Functional: Handle error 405 'Method not allowed' to MagicTPA. 
 * @param {Express.Response} req
 * @param {Express.Response} res
 * */
function methodNotAllowedTPAMagic(req, res) {
	if (req.method !== 'GET') {
		errorHandler.methodNotAllowed(res,
			`Only 'GET' method allowed to TPAMagic (Third Party API), for more info on TPAMagic api, check 'https://docs.magicthegathering.io/'.`
		);
		return true;
	}
};

module.exports = { getCards, getTPA, getFromTPA, checkCardsForStorage }