
let {USER_TABLE} = require("../constants/tables");
require("dotenv").config();

module.exports = {
  up: "CREATE TABLE IF NOT EXISTS " + USER_TABLE + " ("+
			"`id` int(11) NOT NULL AUTO_INCREMENT," +
			"`username` VARCHAR(255) NOT NULL UNIQUE,"+
			"`password` VARCHAR(255) NOT NULL,"+
			"`email` VARCHAR(255) NOT NULL UNIQUE,"+
			"`role` VARCHAR(255) NOT NULL,"+
			"`status` BOOL NOT NULL DEFAULT TRUE," +
			"`deleted` BOOL NOT NULL DEFAULT FALSE," +
			"`date_added` int(11) NOT NULL," +
			"`date_modified` int(11) NOT NULL," +
			"PRIMARY KEY (`id`)"+
	") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

  down: "DROP TABLE " + USER_TABLE + ";"
};
