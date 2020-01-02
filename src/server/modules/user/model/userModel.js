'use strict';

let model = require('./../../../core/model'),
  { USER_TABLE } = require('../constants/tables');

class userModel extends model {
  constructor(app) {
    super(app, USER_TABLE);
    this.app = app;
  }

  async fetchUsers(
    limit = null,
    offset = null,
    count = false,
    search = null,
    order = null,
    role = null
  ) {
    let selection = count === true ? 'COUNT(*) as items_count' : '*';

    let sql =
        'SELECT ' + selection + ' FROM ' + USER_TABLE + ' WHERE deleted = 0 ',
      bindedParams = [];

    if (search && search.length) {
      sql += 'AND username LIKE ? OR email LIKE ? ';
      bindedParams.push('%' + search + '%');
      bindedParams.push('%' + search + '%');
    }
    if (role) {
      sql += 'AND role LIKE ? ';
      bindedParams.push(role);
    }

    if (order && typeof order !== 'undefined' && order.length >= 2) {
      sql +=
        'ORDER BY ' +
        this.clearName(order[0]) +
        ' ' +
        this.clearName(order[1]) +
        ' ';
    }

    if (limit) {
      sql += ' ';
      sql += 'LIMIT ? ';
      bindedParams.push(parseInt(limit) || 0);
    }
    if (offset) {
      sql += ' ';
      sql += 'OFFSET ? ';
      bindedParams.push(parseInt(offset) || 0);
    }

    let connection = await this.getConnection(),
      [rows] = await connection.execute(sql, bindedParams).catch(error => {
        connection.release();
        throw error;
      });
    connection.release();

    return count ? rows[0].items_count : rows;
  }

  async getUserByAuthenticationCredentials(username, password) {
    let connection = await this.getConnection(),
      [rows] = await connection
        .execute(
          'SELECT * FROM ' +
            USER_TABLE +
            ' WHERE (username = ? OR email = ?) AND password = ? AND verified = ?;',
          [username, username, password, true]
        )
        .catch(error => {
          connection.release();
          throw error;
        });

    connection.release();
    return rows.length > 0 ? rows[0] : null;
  }

  async getUserByUsername(username) {
    let connection = await this.getConnection(),
      [rows] = await connection
        .execute('SELECT * FROM ' + USER_TABLE + ' WHERE username = ?;', [
          username
        ])
        .catch(error => {
          connection.release();
          throw error;
        });

    connection.release();
    return rows.length > 0 ? rows[0] : null;
  }

  async getFirstFreeUsername(username, i = 0) {
    username = i === 0 ? username : username + '' + i;
    const isFree = (await this.getUserByUsername(username)) === null;
    if (isFree) {
      return username;
    }

    return await this.getFirstFreeUsername(username, i + 1);
  }

  async getUserByEmail(email) {
    let connection = await this.getConnection(),
      [rows] = await connection
        .execute('SELECT * FROM ' + USER_TABLE + ' WHERE email = ?;', [email])
        .catch(error => {
          connection.release();
          throw error;
        });

    connection.release();
    return rows.length > 0 ? rows[0] : null;
  }

  async parseUserFull(user) {
    return {
      ...(await this.parseUser(user)),
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      verified: user.verified,
      status: user.status
    };
  }

  async parseUser(user) {
    const imageModel = this.app.get('MODEL').get('imageModel');

    return {
      id: user.id,
      username: user.username,
      bio: user.bio,
      avatar: user.avatar
        ? await imageModel.getImageTypesById(user.avatar)
        : null,
      role: user.role,
      date_added: user.date_added
    };
  }
}

module.exports = userModel;
