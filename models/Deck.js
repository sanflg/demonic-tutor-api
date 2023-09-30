const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const Deck = sequelize.define('deck', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	name: {
		type: Sequelize.STRING,
		allowNull: false
	},
  archetype: {
    type: Sequelize.STRING,
		allowNull: false
  },
	colorName: {
		type: Sequelize.STRING,
		allowNull: false
	}
});

module.exports = Deck