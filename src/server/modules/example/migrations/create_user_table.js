let {USER_TABLE} = require("../constants/tables");

module.exports = {
  up: "CREATE TABLE IF NOT EXISTS " + USER_TABLE + " " +
  "(" +
  "id INT(11) UNSIGNED AUTO_INCREMENT PRIMARY KEY," +
  "email VARCHAR(255)," +
  "city VARCHAR(50)," +
  "age INT" +
  ")",

  down: "DROP TABLE " + USER_TABLE + ";"
};