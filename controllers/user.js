const path = require('path');

const User = require('../models/User');
const errorHandler = require('../callUtils/errorHandler');
const callHandler = require('../callUtils/callHandler');

exports.getUserById = function(req, res, next) {
    const id = req.params.id;
    User.getUserById(user => {
        if (user !== null) callHandler.handleWithBody(req.baseUrl, res, req, 200, user);
        else errorHandler.notFound(res, `User with ID '${id}' not found.`)
    }, id);
};

exports.getUsers = function(req, res, next) {
    User.fetchAll((users) => {
        callHandler.handleWithBody(req.baseUrl, res, req, 200, users)
    });
};

exports.createUser = function(req, res, next) {
    const user = new User (
        req.body.userName,
        req.body.tag,
        req.body.email,
        req.body.password,
        req.body.birthDate
        );
    user.save();
    callHandler.handleWithBody(req.baseUrl, res, req, 201, user)
};

/*
export const deleteUser = (req, res) => {
    const { id } = req.params;
    logRequest(serv, "deleteUser", id);
    users = users.filter((user) => user.id !== id);
    logResponse(`User with id "${id}" deleted.`, res);
};
*/
