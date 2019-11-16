let {
  AUTHORIZATION_TOKEN,
  FETCH_USER,
  IS_ADMIN
} = require('./../../../user/middlewares/authorization');

module.exports = app => {
  let imageController = new (require('../../controller/api/imageController'))(
    app
  );

  app.post(
    '/api/v1/media/image',
    AUTHORIZATION_TOKEN,
    FETCH_USER,
    app.get('multer').single('image'),

    /** Validates if file is found */
    (req, res, next) => {
      if (typeof req.file === 'undefined') {
        return next('image is required');
      }

      return next();
    },

    imageController.uploadAction
  );
};
