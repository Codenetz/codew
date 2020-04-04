let {
    AUTHORIZATION_TOKEN,
    FETCH_USER,
    IS_ADMIN
  } = require('./../../../user/middlewares/authorization'),
  path = require('path'),
  { getFromMIMEType } = require('./../../../../utils/extension'),
  env = require('./../../../../../../boot/env');

const {
  SECRET_KEY,
  MAX_UPLOAD_SIZE,
  UPLOAD_PUBLIC_FOLDER_NAME,
  S3_ENABLED
} = env.vars;

module.exports = app => {
  let fileController = new (require('../../controller/api/fileController'))(
    app
  );

  app.post(
    '/api/v1/media/file',
    AUTHORIZATION_TOKEN,
    FETCH_USER,
    IS_ADMIN,
    app.get('multer_file').single('file'),

    /** Validates if file is found */
    async (req, res, next) => {
      if (typeof req.file === 'undefined') {
        return next('file is required');
      }

      if (
        ['.jpg', 'jpeg', '.png', '.gif', '.webp', '.pdf'].indexOf(
          path.extname(req.file.originalname).toLowerCase()
        ) < 0
      ) {
        return next('extension not allowed');
      }

      req.file.extension = await getFromMIMEType(req.file.mimetype);

      if (req.file.extension === null) {
        return next('mime type not allowed');
      }

      const fileUploadService = req.app.get('SERVICE').get('fileUploadService');

      req.file.filename =
        S3_ENABLED === 'true'
          ? await fileUploadService.toS3(req.file.buffer, {
            mime: req.file.mimeType,
            extension: req.file.extension
          })
          : await fileUploadService.toFS(req.file.buffer, {
            mime: req.file.mimeType,
            extension: req.file.extension
          });

      return next();
    },

    fileController.uploadAction
  );
};
