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

  async getItemBy(andWhere) {
    let result = await this.getItemsBy(andWhere, 1, 0);
    if (result.length <= 0) return null;
    return result[0];
  }

  async getItemsCount(andWhere) {
    const count = await this.getItemsBy(
      andWhere,
      undefined,
      undefined,
      undefined,
      [],
      true
    );
    return count && count.length > 0 && count[0].items_count
      ? parseInt(count[0].items_count)
      : 0;
  }

  async idsExists(ids, filters = {}) {
    /** Removes duplicates if any */
    ids = [...new Set(ids.slice())].map(v => parseInt(v));
    if (ids.length <= 0) {
      return false;
    }

    return (
      (
        await Promise.all(
          ids.map(
            async id =>
              !!(await this.getItemBy(Object.assign({}, { id }, filters)))
          )
        )
      ).filter(Boolean).length === ids.length
    );
  }

  async hardDeleteBy(andWhere) {
    const fields_where = Object.keys(andWhere);

    let sql = 'DELETE FROM ' + this.table;
    let whereArray = [];
    let bindedParams = [];

    if (fields_where.length > 0) {
      sql += ' WHERE ';
      for (const field of fields_where) {
        whereArray.push(this.clearName(field) + ' = ?');
        bindedParams.push(andWhere[field]);
      }
      sql += whereArray.join(' AND ');
    }

    let connection = await this.getConnection(),
      [rows] = await connection.execute(sql, bindedParams).catch(error => {
        connection.release();
        throw error;
      });
    connection.release();
    return rows;
  }

  async insert(values) {
    const fields = Object.keys(values).map(f => this.clearName(f));

    let sql = 'INSERT INTO ' + this.table + ' ';

    let fieldsArray = [];
    let setArray = [];
    let bindedParams = [];

    for (const field of fields) {
      fieldsArray.push(field);
    }

    sql += '(' + fieldsArray.join(', ') + ')';

    for (const field of fields) {
      setArray.push('?');
      bindedParams.push(values[field]);
    }

    sql += ' VALUES (' + setArray.join(', ') + ')';

    let connection = await this.getConnection(),
      [row] = await connection.execute(sql, bindedParams).catch(error => {
        connection.release();
        throw error;
      });
    connection.release();
    return row.insertId;
  }

  async update(values, andWhere) {
    const fields = Object.keys(values);
    const fields_where = Object.keys(andWhere);

    let sql = 'UPDATE ' + this.table + ' SET ';

    let setArray = [];
    let whereArray = [];
    let bindedParams = [];
    for (const field of fields) {
      setArray.push(this.clearName(field) + ' = ?');
      bindedParams.push(values[field]);
    }
    sql += setArray.join(', ');

    if (fields_where.length > 0) {
      sql += ' WHERE ';
      for (const field of fields_where) {
        whereArray.push(this.clearName(field) + ' = ?');
        bindedParams.push(andWhere[field]);
      }
      sql += whereArray.join(' AND ');
    }

    let connection = await this.getConnection(),
      [rows] = await connection.execute(sql, bindedParams).catch(error => {
        connection.release();
        throw error;
      });
    connection.release();
    return rows;
  }

  clearName(name) {
    return name.replace(/[^-_a-z0-9]/gi, '');
  }

  async getItemsBy(
    andWhere,
    limit,
    offset,
    orderBy,
    fields = [],
    items_count = false
  ) {
    let sqlFields =
      fields.length <= 0 ? '*' : fields.map(f => this.clearName(f)).join(', ');

    sqlFields = items_count === true ? 'count(*) as items_count' : sqlFields;

    let sql = 'SELECT ' + sqlFields + ' FROM ' + this.table + ' ',
      bindedParams = [];
    /** Handles the where clause */
    if (typeof andWhere !== 'undefined') {
      let fields = Object.keys(andWhere),
        valuesByKeys = andWhere;
      /** Creates the SQL query if fields are found */
      if (fields.length > 0) {
        let andWhereArray = [];
        fields.forEach(field => {
          let fieldName = this.clearName(field);

          /** Handles NULL values */
          if (valuesByKeys[field] === null) {
            andWhereArray.push(fieldName + ' is NULL ');
            return;
          }

          andWhereArray.push(fieldName + ' = ? ');
          bindedParams.push(valuesByKeys[field]);
        });

        if (andWhereArray.length > 0) {
          /** Concat where clause */
          sql += 'WHERE ' + andWhereArray.join(' AND ');
        }
      }
    }
    if (typeof orderBy !== 'undefined' && orderBy.length >= 2) {
      sql +=
        'ORDER BY ' +
        this.clearName(orderBy[0]) +
        ' ' +
        this.clearName(orderBy[1]) +
        ' ';
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
