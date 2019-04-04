'use strict';
let service = require('./../../../core/service'),
  env = require('./../../../../../boot/env'),
  crypto = require('crypto'),
  jwt = require('jsonwebtoken');

class userService extends service {
  passwordHash(password) {
    return crypto
      .createHash('sha256')
      .update(password + env.vars.SECRET_KEY)
      .digest('hex');
  }

  getJWT(user) {
    return jwt.sign({ id: user.id }, env.vars.SECRET_KEY);
  }
}

module.exports = userService;
