const express = require('express');
const bodyParser = require('body-parser');

const port = require('./envVars').port;
const errorHandler = require('./utils/callUtils/errorHandler');
const sequelize = require('./utils/database');

/** Import: Models for sequelize. */
const User = require('./models/User');
const Deck = require('./models/Deck');
const Card = require('./models/Card');
const CardDeckCount = require('./models/CardDeckCount');

/** Import: Routes. */
const V1 = require('./routes/v1');

/** Express config. */
const app = express();
app.use(bodyParser.json());

/** Routes setting. */
app.use('/v1', V1.router);

/** 404 for not valid routes. */
app.use((req, res, next) => errorHandler.notFound(res, req, `List of available endpoints: 'ADD SOMETHING HERE'.`));

/** Sequelize DB relations. */
Deck.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Deck);
Card.belongsToMany(Deck, { through: CardDeckCount, onDelete: 'CASCADE' });
//CardDeckCount.belongsTo(Deck, {constraints: true, onDelete: 'CASCADE'});
//Deck.hasMany(CardDeckCount);

/** Start Sequelize. */
sequelize
	.sync(
		//{ force: true }
	)
	.then(() => { app.listen(port); })
	.catch(err => console.log(err));