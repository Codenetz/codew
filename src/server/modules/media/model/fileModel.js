'use strict';

let model = require('./../../../core/model'),
  logger = require('./../../../utils/logger'),
  { FILE_TABLE } = require('../constants/tables');

class fileModel extends model {
  constructor(app) {
    super(app, FILE_TABLE);
    this.app = app;
  }

  async parseItem(file) {
    return {
      id: file.id,
      path: file.path,
      alt: file.alt,
      copyright: file.copyright,
      author: file.author,
      file_size: file.file_size,
      extension: file.extension,
      date_added: file.date_added
    };
  }
}

module.exports = fileModel;
