'use strict';

let model = require('./../../../core/model'),
  { META_TAG_TABLE } = require('../constants/tables');

class metaTagModel extends model {
  constructor(app) {
    super(app, META_TAG_TABLE);
    this.app = app;
  }

  async parseItem(tag) {
    const { id, meta_id, date_added } = tag;
    return { id, tag: tag.tag, meta_id, date_added };
  }
}

module.exports = metaTagModel;
