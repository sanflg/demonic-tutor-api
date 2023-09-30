/**
 * Logger for response.
 * @param {Express.Response} res
 * */
function logResponse(res) {
	console.log(
		`RESPONSE *********
    	- Status: ${res.statusCode}
      - Body: ${JSON.stringify(res.body)}`
	);
};

/**
 * Logger for request.
 * @param {Express.Request} req
 * */
function logRequest(req) {
	console.log(
		`CALL *********
    	- Service: '${req.baseUrl}' 
    	- Method: '${req.method}' 
    	- Params: '${JSON.stringify(req.params)}' 
    	- Body: ${JSON.stringify(req.body)}'`
	);
};

module.exports = { logResponse, logRequest };