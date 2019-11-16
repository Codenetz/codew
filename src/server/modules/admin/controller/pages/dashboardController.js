'use strict';

let adminController = require('./../adminController');

class dashboardController extends adminController {
  async indexAction(req, res, next) {
    return this.render(
      req,
      res,
      {},
      {},
      {
        asset_file_name: 'admin' + req.app.get('VERSION').hash
      }
    );
  }
}

module.exports = dashboardController;
