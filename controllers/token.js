function generateToken(req, res) {
	//TODO: MISSING IMPL
	if (req.body.password !== req.body.confirmPassword) return errorHandler.badRequest(res, 'Passwords do not match.');
	const email = req.body.email;
	const password = req.body.password;

	getUserByMail(res, email, user => {
		if (user !== null) {
			bcrypt.compare(password, user.password)
				.then((doMatch) => {
					if (doMatch) {

					}
					callHandler.handleWithBody(res, req, 201, user)
				})
				.catch(err => errorHandler.badRequest(res, err));
		}
		else {
			return errorHandler.unauthorized(res, 'No account exist with this mail.');
		};
	});
};

module.exports = { generateToken }