'use strict';

let controller = require('./../../../../core/controller');

class profileController extends controller {
  async previewAction(req, res, next) {
    if (req.query && req.query.meta) {
      return this.metaResponse(req, res, {}, {});
    }

    return this.render(req, res, {}, {});
  }
}

module.exports = profileController;
