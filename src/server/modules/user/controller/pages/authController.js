'use strict';

let controller = require('./../../../../core/controller');

class authController extends controller {
  async loginAction(req, res, next) {
    return this.render(req, res, {}, {});
  }
}

module.exports = authController;
