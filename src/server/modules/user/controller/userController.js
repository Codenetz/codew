'use strict';

let controller = require('./../../../core/controller'),
  Boom = require('boom'),
  { ROLE_USER } = require('../constants/roles');

class userController extends controller {
  constructor(app, force_init) {
    super(app, force_init);
  }

  async signUpAction(req, res, next) {
    let userModel = this.app.get('MODEL').get('userModel'),
      userService = this.app.get('SERVICE').get('userService'),
      username = req.body.username,
      email = req.body.email || null,
      password_hashed = userService.passwordHash(req.body.password),
      user = null;

    try {
      /** Checks if user exists with given username */
      if ((await userModel.getUserByUsername(username)) !== null) {
        return next(Boom.conflict('user.exists'));
      }

      /** Checks if user exists with given email */
      if (email !== null && (await userModel.getUserByEmail(email)) !== null) {
        return next(Boom.conflict('user.exists'));
      }

      user = await userModel.createUser(
        username,
        password_hashed,
        email,
        ROLE_USER
      );
    } catch (error) {
      return next(error);
    }

    user = await userModel.parseUser(user);

    return this.response(res, {
      user: user,
      jwt: userService.getJWT(user)
    });
  }

  async authenticateAction(req, res, next) {
    let userModel = this.app.get('MODEL').get('userModel'),
      userService = this.app.get('SERVICE').get('userService'),
      username = req.body.username,
      password_hashed = userService.passwordHash(req.body.password),
      user = null;

    try {
      user = await userModel.getUserByUsernameAndPassword(
        username,
        password_hashed
      );
    } catch (error) {
      return next(error);
    }

    if (user === null) {
      return next(Boom.unauthorized('wrong.credentials'));
    }

    user = await userModel.parseUser(user);

    return this.response(res, {
      user: user,
      jwt: userService.getJWT(user)
    });
  }

  async testAction(req, res, next) {
    let userModel = this.app.get('MODEL').get('userModel'),
      user = await userModel.parseUser(req.user);

    return this.response(res, {
      user: user
    });
  }
}

module.exports = userController;
