'use strict';

let controller = require('./../../../../core/controller'),
  Boom = require('boom');

class fileController extends controller {
  constructor(app, force_init) {
    super(app, force_init);
  }

  async uploadAction(req, res, next) {
    try {
      let user_id = req.user.id,
        file = req.file,
        path = file.filename,
        alt = req.body.alt || null,
        name = file.originalname || 'noname',
        size = file.size || 0,
        extension = file.extension,
        fileModel = this.app.get('MODEL').get('fileModel');

      const now = Math.floor(Date.now() / 1000);

      const data = this.removeUndefined({
        path,
        extension,
        alt,
        name,
        copyright: null,
        author: null,
        file_size: size
      });

      let fileId = await fileModel.insert({
        ...data,
        user_id,
        status: true,
        deleted: false,
        date_added: now,
        date_modified: now
      });

      return this.response(res, {
        file: await fileModel.parseItem(await fileModel.getItemById(fileId))
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = fileController;
