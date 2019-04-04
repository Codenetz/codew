'use strict';

let logger = require('./../../../src/server/utils/logger');

class model {
  constructor(app, table) {
    if (this.constructor.name === 'model') {
      throw new Error('Model class cannot be initialized');
    }

    this.table = table;
    this.app = app;
    this.bindScope();
  }

  bindScope() {
    const { ENV } = this.app.settings;

    /** Log loaded models */
    if (ENV.isDevelopment) {
      logger.info('[MODEL] ' + this.constructor.name);
    }

    let methods = Object.getOwnPropertyNames(this.constructor.prototype);
    for (let i = 0; i < methods.length; i++) {
      /** Method name */
      const key = methods[i];

      /** Method reference */
      const method = this[key];

      /** Bind current scope to model methods */
      if (key !== 'constructor' && typeof method === 'function') {
        this[key] = method.bind(this);
      }
    }
  }

  /** Gets connection from pool */
  async getConnection() {
    return await this.app.get('MYSQL_POOL').getConnection();
  }

  /** Soft deletes an item */
  async deleteItemById(id) {
    let connection = await this.getConnection();
    await connection
      .execute('UPDATE ' + this.table + ' SET deleted = 1 WHERE id = ?', [id])
      .catch(error => {
        connection.release();
        throw error;
      });
    connection.release();
    return true;
  }

  /** Gets a single item by an id */
  async getItemById(id) {
    let rows = await this.getItemsBy({ id: id });
    return rows.length > 0 ? rows[0] : null;
  }

  /** Gets items with limit and offset */
  async getItems(limit, offset) {
    return await this.getItemsBy(undefined, limit, offset);
  }

  /** Gets items with where clause, limit and offset */
  async getItemsBy(andWhere, limit, offset) {
    let sql = 'SELECT * FROM ' + this.table + ' ',
      bindedParams = [];

    /** Handles the where clause */
    if (typeof andWhere !== 'undefined') {
      let fields = Object.keys(andWhere),
        valuesByKeys = andWhere;

      /** Creates the SQL query if fields are found */
      if (fields.length > 0) {
        let andWhereArray = [];
        fields.map(field => {
          andWhereArray.push(field + ' = ? ');
          bindedParams.push(valuesByKeys[field]);
        });

        if (andWhereArray.length > 0) {
          /** Concat where clause */
          sql += 'WHERE ' + andWhereArray.join(' AND ');
        }
      }
    }

    if (typeof limit !== 'undefined') {
      sql += 'LIMIT ? ';
      bindedParams.push(parseInt(limit) || 0);
    }

    if (typeof offset !== 'undefined') {
      sql += 'OFFSET ? ';
      bindedParams.push(parseInt(offset) || 0);
    }

    let connection = await this.getConnection(),
      [rows] = await connection.execute(sql, bindedParams).catch(error => {
        connection.release();
        throw error;
      });
    connection.release();
    return rows;
  }
}

module.exports = model;
