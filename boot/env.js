"use strict";

/** Load module for .env support */
require("dotenv").config();

const DEVELOPMENT = "development";
const PRODUCTION = "production";

let env = (process.env.NODE_ENV || DEVELOPMENT);

module.exports = {
  isProduction: env === PRODUCTION,
  isDevelopment: env === DEVELOPMENT,
  env: env,
  vars: process.env
};