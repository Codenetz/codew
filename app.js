"use strict";
let
  env = require("./boot/env"),
  server = require("./boot/server"),
  logger = require("./src/utils/logger");

logger.warning("Starting in " + env.env + " environment");

if (env.isDevelopment) {
  require("./boot/eslint");
}

//start client load

server.load().then(() => {
  logger.success("Server is running on port: " + env.vars.SERVER_PORT);
});