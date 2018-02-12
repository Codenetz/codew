"use strict";

let
  routes = require("./routing/routes"),
  services = require("./services"),
  models = require("./models");

module.exports = (app) => {
  models(app);
  services(app);
  routes(app);
};