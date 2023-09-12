//**** Imports ****
const express = require('express'); //https://expressjs.com https://github.com/expressjs/express
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const errorHandler = require('./callUtils/errorHandler');

const TPAMagic = require('./routes/TPAMagic');
const User = require('./routes/user');

//**** Setting express ****
const app = express();
app.use(bodyParser.json());

//**** Middlewares ****
app.use('/TPAMagic', TPAMagic.router);
app.use('/user', User.router);

//404
app.use((req, res, next) => errorHandler.notFound(res, `List of available endpoints: 'ADD SOMETHING HERE'.`));

//**** Port ****
app.listen(6666);