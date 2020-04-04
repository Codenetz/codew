'use strict';

let model = require('./../../../core/model'),
  logger = require('./../../../utils/logger'),
  { IMAGE_TABLE } = require('../constants/tables');

class imageModel extends model {
  constructor(app) {
    super(app, IMAGE_TABLE);
    this.app = app;
  }

  async addImage(path, extension, alt, width, height, file_size, user_id) {
    let connection = await this.getConnection();
    await connection
      .execute(
        'INSERT INTO ' +
          this.table +
          ' (path, extension, alt, width, height, file_size, user_id, date_added, date_modified) VALUES' +
          ' (?, ?, ?, ?, ?, ?, ?, UNIX_TIMESTAMP(), UNIX_TIMESTAMP())',
        [path, extension, alt, width, height, file_size, user_id]
      )
      .catch(error => {
        connection.release();
        throw error;
      });
    connection.release();
    return true;
  }

  async getImageTypesById(id) {
    let imageTypeService = this.app.get('SERVICE').get('imageTypeService'),
      imageModel = this.app.get('MODEL').get('imageModel'),
      image = null;

    try {
      let rows = await imageModel.getItemsBy({ id });
      image = rows.length > 0 ? rows[0] : null;
    } catch (error) {
      logger.rawError(error);
      return null;
    }

    if (image === null) {
      return null;
    }

    let types = await imageTypeService.getTypes(image);

    return {
      id: image.id,
      types: types,
      alt: image.alt
    };
  }
}

module.exports = imageModel;
