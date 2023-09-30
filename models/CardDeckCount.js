const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const CardDeckCount = sequelize.define('card_deck_count', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	quantity: {
		type: Sequelize.INTEGER,
    validate: {
			min: 1
		}
	}
});

module.exports = CardDeckCount