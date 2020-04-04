'use strict';

module.exports = app => {
  let imageModel = new (require('./model/imageModel'))(app),
    fileModel = new (require('./model/fileModel'))(app);
  app.get('MODEL').set(imageModel);
  app.get('MODEL').set(fileModel);
};
