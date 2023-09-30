const consoleLogger = require('./consoleLogger');

/**
 * Log in console and send back response.
 * @param {Express.Response} res
 * */
function logAndSendResponse(res) {
	consoleLogger.logResponse(res);
	res.send(res.body);
};

/**
 * General handler for calls with response body: 
 * logs request, sets 'Content-Type' 
 * and sends response after building it.
 * @param {Express.Response} res
 * @param {Express.Request} req
 * @param {int} statusCode
 * @param {String} body
 * */
async function generalCallHandler(res, req, statusCode, body, callback) {
	callback(handleWithBody(res, req, statusCode, body));
};

/**
 * General handler for calls with response body: 
 * logs request, sets 'Content-Type' 
 * and sends response after building it.
 * @param {Express.Response} res
 * @param {Express.Request} req
 * @param {int} statusCode
 * @param {String} body
 * */
function handleWithBody(res, req, statusCode, body) {
	consoleLogger.logRequest(req);
	res.set('Content-Type', 'application/json');
	res.statusCode = statusCode;
	res.body = body;
	logAndSendResponse(res);
};

/**
 * General handler for calls without response body
 * @param {Express.Response} res
 * @param {Express.Request} req
 * @param {int} statusCode
 * @param {String} body
 * */
function handle(res, req, statusCode) {
	handleWithBody(res, req, statusCode, '');
};

module.exports = { handleWithBody, handle, logAndSendResponse, generalCallHandler };