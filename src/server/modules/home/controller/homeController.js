'use strict';

let controller = require('./../../../core/controller');

class homeController extends controller {
  constructor(app, force_init) {
    super(app, force_init);
  }

  async homeAction(req, res, next) {
    return this.render(req, res, {}, {});
  }
}

module.exports = homeController;
