function logRequest(serv, method, message) {
    console.log("CALL - Service: '" + serv +
        "' - Method: '" + method +
        "' - Message: " + JSON.stringify(message) + ".");
};

function logResponse(message, res) {
    console.log("RESPONSE: " + JSON.stringify(message) + ".");
    res.send(message);
};

export { logRequest, logResponse };