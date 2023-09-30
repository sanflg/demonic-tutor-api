const User = require('../models/User');
const errorHandler = require('../utils/callUtils/errorHandler');
const callHandler = require('../utils/callUtils/callHandler');
const bcrypt = require('bcryptjs');

const encryptionLevel = require('../envVars').encryptionLevel;

/**
 * Call: Get user by id. 
 * @param {Express.Response} req
 * @param {Express.Response} res
 * */
async function getUserById(req, res) {
	const user = await User.findByPk(req.params.id);
	if (!user) return errorHandler.notFound(res, req, `User with ID '${req.params.id}' not found.`);
	callHandler.handleWithBody(res, req, 200, user);
};

/**
 * Call: Bulk user get. 
 * @param {Express.Response} req
 * @param {Express.Response} res
 * */
async function getUsers(req, res) {
	const users = await User.findAll();
	callHandler.handleWithBody(res, req, 200, users);
};

/**
 * Call: Update user data by id. 
 * @param {Express.Response} req
 * @param {Express.Response} res
 * */
async function updateUser(req, res) {
	let user = await User.findByPk(req.params.id);
	if (user === null) return errorHandler.notFound(res, req, `User with ID '${req.params.id}' not found.`);

	user.userName = null === req.body.userName ? user.userName : req.body.userName;
	user.email = null === req.body.email ? user.email : req.body.email;
	user.password = null === req.body.password ? user.password : req.body.password;
	user = await user.save();
	callHandler.handleWithBody(res, req, 200, user);
};

/**
 * Call: Create user. 
 * @param {Express.Response} req
 * @param {Express.Response} res
 * */
async function signUp(req, res) {
	if (!passwordsDoMatch(req.body)) return errorHandler.badRequest(res, req, 'Passwords do not match.');

	if (await searchUserByMail(req.body.email) == null) {
		const savedUser = await saveUser(req.body);
		return callHandler.handleWithBody(res, req, 201, savedUser);
	}
	else {
		return errorHandler.conflict(res, req, 'Email already taken, please use another one or recover credentials.');
	}
};

/**
 * Call: Delete user by id. 
 * @param {Express.Response} req
 * @param {Express.Response} res
 * */
async function deleteUser(req, res) {
	const user = await User.findByPk(req.params.id);
	if (!user) return errorHandler.notFound(res, req, `User with ID '${req.params.id}' not found.`);
	user.destroy();
	callHandler.handle(res, req, 204);
};

/**
 * Functional: Search for one user with given password in DDBB and return it in a callback.
 * @param {String} email
 * */
async function searchUserByMail(email) {
	return await User.findOne({ where: { email: email } });
};

/**
 * Functional: Encrypt password and save user.
 * @param {User} user
 * */
async function saveUser(user) {
	const hashedPassword = await bcrypt.hash(user.password, encryptionLevel)
	return await User.create({
		userName: user.userName,
		email: user.email,
		password: hashedPassword
	});
};

/**
 * Functional: Checks for matching 'password' and 'confirmPassword'.
 * @param {User} user
 * */
function passwordsDoMatch(user) {
	return (user.password === user.confirmPassword);
}

module.exports = { getUserById, getUsers, updateUser, signUp, deleteUser, getUsers }


