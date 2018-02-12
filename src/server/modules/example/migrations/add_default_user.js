let {USER_TABLE} = require("../constants/tables");

module.exports = {
  up: "INSERT INTO " + USER_TABLE + " (name) values (\"admin\")",
  down: "DELETE FROM " + USER_TABLE + " WHERE name = \"admin\";"
};