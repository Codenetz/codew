let {
    AUTHORIZATION_TOKEN,
    FETCH_USER,
    IS_ADMIN
  } = require('./../../../user/middlewares/authorization'),
  uniqid = require('uniqid'),
  path = require('path'),
  { getFromMIMEType } = require('../../../../utils/extension'),
  crypto = require('crypto'),
  env = require('./../../../../../../boot/env');

const {
  SECRET_KEY,
  MAX_UPLOAD_SIZE,
  UPLOAD_PUBLIC_FOLDER_NAME,
  S3_ENABLED
} = env.vars;

module.exports = app => {
  let imageController = new (require('../../controller/api/imageController'))(
    app
  );

  app.post(
    '/api/v1/media/image',
    AUTHORIZATION_TOKEN,
    FETCH_USER,
    app.get('multer').single('image'),
    async (req, res, next) => {
      if (typeof req.file === 'undefined') {
        return next('image is required');
      }

      const extension = await getFromMIMEType(req.file.mimetype);

      if (['jpg', 'jpeg', 'png', 'gif', 'webp'].indexOf(extension) < 0) {
        return next('extension not allowed');
      }

      const imageUploadService = req.app
        .get('SERVICE')
        .get('imageUploadService');
      const file =
        S3_ENABLED === 'true'
          ? await imageUploadService.toS3(req.file.buffer, {
            extension
          })
          : await imageUploadService.toFS(req.file.buffer, {
            extension
          });

      if (file.original) {
        req.file.filename = file.original.path;
      }

      return next();
    },

    imageController.uploadAction
  );
};
