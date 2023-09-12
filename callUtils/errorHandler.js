const consoleLogger = require('./consoleLogger');

function generalErrorHandling(res, errorCode, errorMessage, moreData) {
    res.set('Content-Type', 'application/json');
    res.statusCode = errorCode;
    var errorResponse = {
        errorCode: errorCode,
        errorMessage: errorMessage,
        moreData: moreData
    };
    consoleLogger.logAndSendResponse(res, errorResponse);
};

function notFound(res, message) {
    generalErrorHandling(res, 404, `Not found.`, `${message}`);
};

module.exports = { generalErrorHandling, notFound };