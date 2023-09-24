const mysql = require('mysql2');
const db = require('../envVars').db;

const connectionPool = mysql.createPool({
  host: db.host,
  user: db.user,
  database: db.database,
  password: db.password
});

module.exports = connectionPool.promise();