//**** Imports ****
const express = require('express'); //https://expressjs.com https://github.com/expressjs/express
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const errorHandling = require('./utils/errorHandling');

const TPAMagic = require('./routes/TPAMagic');
const User = require('./routes/user');

//**** Setting express ****
const app = express();
app.use(bodyParser.json());

/*
//**** Set project for start ****
fs.writeFile(
    path.join(
        path.dirname(process.mainModule.filename),
        'data',
        'users.json'), 
    '', 
    (err) => {
        console.log(err);
    }
);
*/

//**** Middlewares ****
app.use('/TPAMagic', TPAMagic.router);
app.use('/user', User.router);

//404
app.use((req, res, next) => {
    res.set('Content-Type', 'application/json');
    errorHandling(res, 404, `Not found.`, `List of available endpoints: 'ADD SOMETHING HERE'.`);
});

//**** Port ****
app.listen(6666); 