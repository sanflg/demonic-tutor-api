function logResponse(res) {
    console.log(
        `RESPONSE *********
        - Status: ${res.statusCode}
        - Body: ${JSON.stringify(res.body)}`
    );
};

function logRequest(req) {
    console.log(
        `CALL *********
        - Service: '${req.baseUrl}' 
        - Method: '${req.method}' 
        - Params: '${JSON.stringify(req.params)}' 
        - Body: ${JSON.stringify(req.body)}'`
    );
};

function logAndSendResponse(res) {
    logResponse(res);
    res.send(res.body);
};

module.exports = { logResponse, logRequest, logAndSendResponse };