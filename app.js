const express = require('express');
const bodyParser = require('body-parser');

const port = require('./envVars').port;
const errorHandler = require('./utils/callUtils/errorHandler');
const sequelize = require('./utils/database');

const User = require('./models/User');
const Deck = require('./models/Deck');
const Card = require('./models/Card');
const CardDeckCount = require('./models/CardDeckCount');

const V1 = require('./routes/v1');

const app = express();
app.use(bodyParser.json());

app.use('/v1', V1.router);

app.use((req, res, next) => errorHandler.notFound(res, req, `List of available endpoints: 'ADD SOMETHING HERE'.`));

Deck.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Deck);
Card.belongsToMany(Deck, { through: CardDeckCount, onDelete: 'CASCADE' });

sequelize
	.sync(
		{ force: true }
	)
	.then(() => { app.listen(port); })
	.catch(err => console.log(err));