'use strict';

module.exports = app => {
  let imageModel = new (require('./model/imageModel'))(app);
  app.get('MODEL').set(imageModel);
};
