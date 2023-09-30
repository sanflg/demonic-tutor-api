const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const Card = sequelize.define('card', {
	name: {
		type: Sequelize.STRING,
		allowNull: false
	},
	names: {
		type: Sequelize.STRING
	},
	manaCost: {
		type: Sequelize.STRING
	},
	cmc: {
		type: Sequelize.INTEGER
	},
	colors: {
		type: Sequelize.JSON
	},
	colorIdentity: {
		type: Sequelize.JSON
	},
	type: {
		type: Sequelize.STRING
	},
	supertypes: {
		type: Sequelize.JSON
	},
	types: {
		type: Sequelize.JSON
	},
	subtypes: {
		type: Sequelize.JSON
	},
	rarity: {
		type: Sequelize.STRING
	},
	set: {
		type: Sequelize.STRING
	},
	setName: {
		type: Sequelize.STRING
	},
	text: {
		type: Sequelize.TEXT
	},
	artist: {
		type: Sequelize.STRING
	},
	number: {
		type: Sequelize.STRING
	},
	power: {
		type: Sequelize.STRING
	},
	toughness: {
		type: Sequelize.STRING
	},
	layout: {
		type: Sequelize.STRING
	},
	multiverseid: {
		type: Sequelize.INTEGER
	},
	imageUrl: {
		type: Sequelize.STRING
	},
	variations: {
		type: Sequelize.JSON
	},
	rulings: {
		type: Sequelize.JSON
	},
	foreignNames: {
		type: Sequelize.JSON
	},
	printings: {
		type: Sequelize.JSON
	},
	originalText: {
		type: Sequelize.TEXT
	},
	originalType: {
		type: Sequelize.STRING
	},
	legalities: {
		type: Sequelize.JSON
	},
  id: {
		type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true
	}
});

module.exports = Card