'use strict';

module.exports = app => {
  let imageTypeService = new (require('./service/imageTypeService'))(app),
    imageUploadService = new (require('./service/imageUploadService'))(app),
    fileUploadService = new (require('./service/fileUploadService'))(app);
  app.get('SERVICE').set(imageTypeService);
  app.get('SERVICE').set(imageUploadService);
  app.get('SERVICE').set(fileUploadService);
};
