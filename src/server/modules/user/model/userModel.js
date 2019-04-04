'use strict';

let model = require('./../../../core/model'),
  { USER_TABLE } = require('../constants/tables');

class userModel extends model {
  constructor(app) {
    super(app, USER_TABLE);
    this.app = app;
  }

  async getUserByUsernameAndPassword(username, password) {
    let connection = await this.getConnection(),
      [rows] = await connection
        .execute(
          'SELECT * FROM ' +
            USER_TABLE +
            ' WHERE username = ? AND password = ?;',
          [username, password]
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

  async parseUser(user) {
    return {
      id: user.id,
      username: user.username,
      role: user.role
    };
  }

  async createUser(username, password, email, role) {
    let connection = await this.getConnection(),
      [result] = await connection
        .execute(
          'INSERT INTO ' +
            USER_TABLE +
            ' (`username`, `password`, `email`, `role`, `date_added`, `date_modified`) ' +
            ' VALUES ' +
            '(?, ?, ?, ?, UNIX_TIMESTAMP(), UNIX_TIMESTAMP())',
          [username, password, email, role]
        )
        .catch(error => {
          connection.release();
          throw error;
        });

    connection.release();

    if (result.insertId) {
      return this.getItemById(result.insertId);
    }

    return null;
  }
}

module.exports = userModel;
