'use strict';

let controller = require('./../../../../core/controller');

class homeController extends controller {
  async homeAction(req, res, next) {
    if (req.query && req.query.meta) {
      return this.metaResponse(req, res, {}, {});
    }

    return this.render(req, res, {}, {});
  }

  async notFoundAction(req, res, next) {
    if (req.query && req.query.meta) {
      return this.metaResponse(req, res, {}, {});
    }

    res.status(404);
    return this.render(req, res, {}, {});
  }
}

module.exports = homeController;
