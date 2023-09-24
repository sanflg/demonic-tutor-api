const consoleLogger = require('./consoleLogger');

function handleWithBody(res, req, statusCode, body) {
    consoleLogger.logRequest(req);
    res.set('Content-Type', 'application/json');
    res.statusCode = statusCode;
    res.body = body;
    consoleLogger.logAndSendResponse(res);
};

function handle(res, req, statusCode) {
    handleWithBody(res, req, statusCode, '');
};

module.exports = { handleWithBody, handle };