let mySQL = require('../src/server/drivers/mySQL');

module.exports = app => {
  mySQL(app);
};
