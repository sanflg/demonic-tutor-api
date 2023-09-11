const path = require('path');

const errorHandling = require('../utils/errorHandling');
const TPAMagic = require('./TPAMagicSettings').TPAMagic;
const consoleLogger = require('../utils/consoleLogger');

exports.getTPA = function(req, res, next) {
    consoleLogger.logRequest(req.baseUrl, req.method, req.body);

    res.set('Content-Type', 'application/json');

    if (req.method !== 'GET'){
        errorHandling(res, 403, 
            `Only 'GET' method allowed to TPAMagic (Third Party API).`, 
            `For more info on TPAMagic api, check 'https://docs.magicthegathering.io/'.`
        );
    } else {
        fetch(new Request(`${TPAMagic.protocol}${TPAMagic.host}/${TPAMagic.version}${req.baseUrl.substring(9)}`, TPAMagic))
        .then((ATPresponse) => ATPresponse.json())
        .then((request) => {
            consoleLogger.logAndSendResponse(res, request);
        });
    }
};