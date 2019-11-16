'use strict';

let model = require('./../../../core/model'),
  { META_TABLE } = require('../constants/tables');

class metaModel extends model {
  constructor(app) {
    super(app, META_TABLE);
    this.app = app;
  }

  async create(title, description, index, tags) {
    const now = Math.floor(Date.now() / 1000);
    const metaId = await this.insert({
      title,
      description,
      index_type: index,
      status: true,
      deleted: false,
      date_added: now,
      date_modified: now
    });

    for (const tag of tags) {
      await this.app
        .get('MODEL')
        .get('metaTagModel')
        .insert({
          tag,
          meta_id: metaId,
          status: true,
          deleted: false,
          date_added: now,
          date_modified: now
        });
    }

    return await this.getItemById(metaId);
  }

  async parseItem(meta) {
    const { id, title, description, index_type, date_added } = meta;

    const metaTagModel = this.app.get('MODEL').get('metaTagModel');

    const tags = await metaTagModel.getItemsBy({
      meta_id: meta.id
    });

    return {
      id,
      title,
      description,
      index: index_type,
      date_added,
      tags:
        tags && tags.length > 0
          ? await Promise.all(tags.map(t => metaTagModel.parseItem(t)))
          : []
    };
  }
}

module.exports = metaModel;
