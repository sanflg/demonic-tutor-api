const consoleLogger = require('./consoleLogger');

function handleWithBody(service, res, req, statusCode, body) {
    consoleLogger.logRequest(service, req.method, req.body);
    res.set('Content-Type', 'application/json');
    res.statusCode = statusCode;
    consoleLogger.logAndSendResponse(res, body);
};

function handle(res, statusCode) {
    handleWithBody(res, statusCode, '');
};

module.exports = { handleWithBody, handle };