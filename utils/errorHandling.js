const consoleLogger = require('./consoleLogger.js');

function generalErrorHandling (res, errorCode, errorMessage, moreData) {
    res.statusCode = errorCode;
    var errorResponse = {
        errorCode: errorCode,
        errorMessage: errorMessage,
        moreData: moreData
    }
    consoleLogger.logAndSendResponse(res, errorResponse);
};

module.exports = generalErrorHandling;