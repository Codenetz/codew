let {USER_TABLE} = require("../constants/tables");

module.exports = {
  up: "ALTER TABLE " + USER_TABLE + " ADD COLUMN name VARCHAR(30);",
  down: "ALTER TABLE " + USER_TABLE + " DROP COLUMN name;"
};