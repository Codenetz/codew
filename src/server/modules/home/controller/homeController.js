'use strict';

let controller = require('./../../../core/controller');

class homeController extends controller {
  constructor(app, force_init) {
    super(app, force_init);
  }

  async homeAction(req, res, next) {
    return res.render('index', {
      assetFileName:
        'desktop' +
        (req.clientDevice && req.clientDevice.is_mobile === true
          ? 'mobile'
          : '') +
        req.app.get('VERSION').hash,
      version_hash: req.app.get('VERSION').hash
    });
  }
}

module.exports = homeController;
