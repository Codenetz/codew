'use strict';

let controller = require('./../../../../core/controller'),
  { getFromMIMEType } = require('./../../../../utils/extension'),
  getImageSize = require('../../imageManipulator/getImageSize'),
  Boom = require('boom');

class imageController extends controller {
  constructor(app, force_init) {
    super(app, force_init);
  }

  async uploadAction(req, res, next) {
    let basePath = req.app.get('ENV').basePath,
      file = req.file,
      path = '/uploads/' + file.filename,
      alt = req.body.alt || null,
      extension = await getFromMIMEType(file.mimetype),
      image_size = await getImageSize(basePath + '/public' + path),
      imageModel = this.app.get('MODEL').get('imageModel'),
      imageTypeService = this.app.get('SERVICE').get('imageTypeService'),
      image = null;

    if (extension === null) {
      return next(Boom.badRequest('image.mimetype.not_found'));
    }

    if (image_size === null) {
      return next(Boom.badRequest('image.size.not_found'));
    }

    let { width, height } = image_size;

    if (width === null || height === null) {
      return next(Boom.badRequest('image.size.error'));
    }

    /** Adds product */
    try {
      await imageModel.addImage(
        path,
        extension,
        alt,
        width,
        height,
        file.size,
        req.user.id
      );
    } catch (error) {
      return next(error);
    }

    try {
      let rows = await imageModel.getItemsBy({
        path: path
      });

      image = rows.length > 0 ? rows[0] : null;
    } catch (error) {
      return next(error);
    }

    if (image === null) {
      return next(Boom.badRequest('image.not_saved'));
    }

    return this.response(res, {
      id: image.id,
      types: await imageTypeService.getTypes(image),
      alt: image.alt
    });
  }
}

module.exports = imageController;
