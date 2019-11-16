import dotenv = require("dotenv");
dotenv.config();

const {
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DEFAULT_DATABASE
} = process.env;

export = {
  type: "mysql",
  host: MYSQL_HOST,
  port: 3306,
  username: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DEFAULT_DATABASE,
  charset: "utf8mb4",
  synchronize: true,
  logging: false,
  entities: ["src/server/modules/**/entity/**/*.ts"],
  migrations: [],
  subscribers: [],
  cli: {}
};
