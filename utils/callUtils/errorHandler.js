const callHandler = require('./callHandler');

/**
 * General handler for errors.
 * @param {Express.Response} res
 * @param {int} errorCode
 * @param {Srting} message
 * */
function generalErrorHandling(res, req, errorCode, message) {
	var errorResponse = {
		errorCode: errorCode,
		moreData: message
	};
	callHandler.handleWithBody(res, req, errorCode, errorResponse);
};

/**
 * Handle error 400 'Bad request'.
 * @param {Express.Response} res
 * @param {Express.Response} req
 * @param {Strting} message
 * */
function badRequest(res, req, message) {
	generalErrorHandling(res, req, 400, `${message}`);
}

/**
 * Handle error 401 'Unauthorized'.
 * @param {Express.Response} res
 * @param {Express.Response} req
 * @param {String} message
 * */
function unauthorized(res, req, message) {
	generalErrorHandling(res, req, 401, `${message}`);
}

/**
 * Handle error 404 'Not found'.
 * @param {Express.Response} res
 * @param {Express.Response} req
 * @param {String} message
 * */
function notFound(res, req, message) {
	generalErrorHandling(res, req, 404, `${message}`);
};

/**
 * Handle error 405 'Method not allowed'.
 * @param {Express.Response} res
 * @param {Express.Response} req
 * @param {String} message
 * */
function methodNotAllowed(res, req, message) {
	generalErrorHandling(res, req, 405, `${message}`);
};

/**
 * Handle error 409 'Conflict'.
 * @param {Express.Response} res
 * @param {Express.Response} req
 * @param {String} message
 * */
function conflict(res, req, message) {
	generalErrorHandling(res, req, 409, `${message}`);
}

module.exports = { generalErrorHandling, notFound, badRequest, methodNotAllowed, conflict, unauthorized };