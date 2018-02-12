"use strict";
let
  logger = require("./../src/utils/logger");

const
  {spawn} = require("child_process"),
  args = [
    "--config", "./.eslintrc.js",
    "--ignore-path", ".eslintignore",
    "--color",
    "app.js", "test", "boot", "src", "bin"
  ],
  eslint = spawn("./node_modules/.bin/eslint", args);

eslint.stdout.on("data", data => {
  logger.info(data.toString());
});

eslint.stderr.on("data", data => {
  logger.info(data.toString());
});