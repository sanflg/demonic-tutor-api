function logRequest(serv, method, message) {
    console.log(`CALL - Service: '${serv}' - Method: '${method}' - Body: ${JSON.stringify(message)}'.`);
};

function logResponse(message) {
    console.log(`RESPONSE: ${JSON.stringify(message)}.`);
};

function logAndSendResponse(res, message) {
    console.log(`RESPONSE: ${JSON.stringify(message)}.`);
    res.send(message);
};

module.exports = { logRequest, logResponse, logAndSendResponse };