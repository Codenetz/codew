'use strict';

module.exports = app => {
  let metaModel = new (require('./model/metaModel'))(app),
    metaTagModel = new (require('./model/metaTagModel'))(app);

  app.get('MODEL').set(metaModel);
  app.get('MODEL').set(metaTagModel);
};
