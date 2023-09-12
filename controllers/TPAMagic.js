const path = require('path');

const errorHandler = require('../callUtils/errorHandler.js');
const consoleLogger = require('../callUtils/consoleLogger.js');

const TPAMagic = {
    version: 'v1',
    host: 'api.magicthegathering.io',
    port: 80,
    protocol: 'https://',
    headers: {
        'Accept-Encoding': 'gzip, deflate, br',
        Connection: 'keep-alive',
        Accept: '*/*'
    }
};

exports.getTPA = function (req, res, next) {
    consoleLogger.logRequest(req.baseUrl, req.method, req.body);

    res.set('Content-Type', 'application/json');

    if (req.method !== 'GET') {
        errorHandler(res, 403,
            `Only 'GET' method allowed to TPAMagic (Third Party API).`,
            `For more info on TPAMagic api, check 'https://docs.magicthegathering.io/'.`
        );
    } else {
        fetch(new Request(`${TPAMagic.protocol}${TPAMagic.host}/${TPAMagic.version}${req.baseUrl.substring(9)}`, TPAMagic))
            .then((ATPresponse) => ATPresponse.json())
            .then((request) => {
                consoleLogger.logAndSendResponse(res, request);
            });
    };
};