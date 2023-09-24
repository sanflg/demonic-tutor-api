const path = require('path');

const User = require('../models/User');
const errorHandler = require('../callUtils/errorHandler');
const callHandler = require('../callUtils/callHandler');

exports.getUserById = function(req, res) {
    const id = req.params.id;
    User.getUserById(id)
    .then(([rows, metadata]) => {
        console.log(rows)
        if(rows.length === 0) errorHandler.notFound(res, `User with ID '${id}' not found.`);
        else callHandler.handleWithBody(res, req, 200, rows[0]);
    })
    .catch(err => console.log(err));
};

exports.getUsers = function(req, res) {
    User.fetchAll()
    .then(([rows, metadata]) => {
        callHandler.handleWithBody(res, req, 200, rows)
    })
    .catch(err => console.log(err));
};

exports.createUser = function(req, res) {
    const user = new User (
        req.body.userName,
        req.body.tag,
        req.body.email,
        req.body.password,
        req.body.birthDate
        );
    user.save()
    .then(() => {
            callHandler.handleWithBody(res, req, 201, user);
        }
    );
};

exports.deleteUser = function(req, res) {
    const id = req.params.id
    User.getUserById(id)
    .then(([rows, metadata]) => {
        console.log(rows)
        if (rows.length === 0) {
            errorHandler.notFound(res, `User with ID '${id}' not found.`);
        }
        else {
            User.deleteUser(id)
            .then(() => {
                callHandler.handle(res, req, 204)
            });
        };
    })
    .catch(err => console.log(err));
};


