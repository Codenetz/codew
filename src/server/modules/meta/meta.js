'use strict';

let routes = require('./routing/routes'),
  models = require('./models');

module.exports = app => {
  models(app);
  routes(app);
};
