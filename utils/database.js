const Sequelize = require('sequelize');
const db = require('../envVars').db;

/** Start Sequlize ORM with DDBB credentials.*/
const sequelize = new Sequelize(
	db.database,
	db.user,
	db.password,
	{
		dialect: 'mysql',
		host: db.host
	}
);

module.exports = sequelize;