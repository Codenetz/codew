'use strict';

module.exports = app => {
  let imageTypeService = new (require('./service/imageTypeService'))(app);
  app.get('SERVICE').set(imageTypeService);
};
