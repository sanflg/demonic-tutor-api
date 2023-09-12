function logResponse(message) {
    console.log(`RESPONSE: ${JSON.stringify(message)}.`);
};

function logRequest(serv, method, message) {
    console.log(`CALL - Service: '${serv}' - Method: '${method}' - Body: ${JSON.stringify(message)}'.`);
};

function logAndSendResponse(res, message) {
    logResponse(message);
    res.send(message);
};

module.exports = { logResponse, logRequest, logAndSendResponse };