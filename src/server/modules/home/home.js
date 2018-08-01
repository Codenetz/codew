"use strict";

let routes = require("./routing/routes");

module.exports = (app) => {
  routes(app);
};