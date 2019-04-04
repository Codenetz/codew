const mysql = require('mysql2/promise');

module.exports = app => {
  const {
    MYSQL_HOST,
    MYSQL_USER,
    MYSQL_PASSWORD,
    MYSQL_DEFAULT_DATABASE,
    MYSQL_POOL_CONNECTIONS_LIMIT
  } = app.settings.ENV.vars;

  const POOL = mysql.createPool({
    connectionLimit: MYSQL_POOL_CONNECTIONS_LIMIT,
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DEFAULT_DATABASE
  });

  app.set('MYSQL_POOL', POOL);
};
