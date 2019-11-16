'use strict';

let controller = require('./../../../../core/controller'),
  Boom = require('boom'),
  axios = require('axios'),
  crypto = require('crypto'),
  { ROLE_USER } = require('../../constants/roles');

class userController extends controller {
  constructor(app, force_init) {
    super(app, force_init);
  }

  async facebookAuthAction(req, res, next) {
    let userModel = this.app.get('MODEL').get('userModel'),
      userService = this.app.get('SERVICE').get('userService'),
      accessToken = req.body.accessToken,
      userId = req.body.userId,
      user = null;

    const now = Math.floor(Date.now() / 1000);

    try {
      const request = {
        method: 'GET',
        url: `https://graph.facebook.com/${userId}?fields=id,name,email,first_name,last_name&access_token=${accessToken}`
      };

      const graphResponse = await axios(request);

      let { id, first_name, last_name, email } = graphResponse.data;

      if (!email) {
        const { MAIN_HOST } = req.app.get('ENV').vars;
        email = 'f' + userId + '@' + MAIN_HOST;
      }

      /** Tries getting user by email */
      user = await userModel.getUserByEmail(email);

      /** Tries getting user by facebook id */
      user = !user ? await userModel.getItemBy({ facebook_id: id }) : user;

      /** Creates user if is not found by email or facebook id */
      if (!user) {
        let username = await userModel.getFirstFreeUsername(
          email.split('@')[0]
        );

        const password = userService.passwordHash(
          '^&*' + crypto.randomBytes(20).toString('hex')
        );

        const userId = await userModel.insert({
          username,
          password,
          email,
          role: ROLE_USER,
          first_name: first_name || null,
          last_name: last_name || null,
          verified: true,
          date_added: now,
          date_modified: now
        });

        user = await userModel.getItemById(userId);

        try {
          userService.sendSignUpEmail(user);
        } catch (error) {
          console.error('[signup email error]', error);
        }
      }

      userModel.update(
        {
          facebook_id: id,
          date_modified: now
        },
        {
          email: user.email
        }
      );

      return this.response(res, {
        user: await userModel.parseUserFull(user),
        jwt: userService.getJWT(user)
      });
    } catch (error) {
      return next(error);
    }
  }

  async forgottenPasswordAction(req, res, next) {
    try {
      let userModel = this.app.get('MODEL').get('userModel'),
        userService = this.app.get('SERVICE').get('userService');

      const { email } = req.body;

      const user = await userModel.getItemBy({ email });

      if (user) {
        await userModel.update(
          {
            forgotten_password: true
          },
          { id: user.id }
        );

        try {
          userService.sendForgottenPasswordEmail(user);
        } catch (error) {
          console.error('[forgotten password email error]', error);
        }
      }

      return this.response(res, {
        success: true
      });
    } catch (error) {
      return next(error);
    }
  }

  async forgottenPasswordChangeAction(req, res, next) {
    try {
      let userModel = this.app.get('MODEL').get('userModel'),
        userService = this.app.get('SERVICE').get('userService');

      const { token, password } = req.body;

      if (password.length < 5) {
        return next(Boom.badRequest('password.to_short'));
      }

      const password_hashed = userService.passwordHash(password);

      const isValid = userService.verifyVerificationToken(token);

      if (!isValid) {
        throw new Error('token error');
      }

      const userId = userService.decodeVerificationTokenCode(token).id;

      const user = await userModel.getItemBy({
        id: userId,
        forgotten_password: true,
        deleted: false
      });

      if (!user) {
        return next(Boom.notFound('user.not_found'));
      }

      await userModel.update(
        {
          password: password_hashed,
          forgotten_password: false
        },
        { id: userId }
      );

      try {
        userService.sendPasswordChangedEmail(user);
      } catch (error) {
        console.error('[change password email error]', error);
      }

      return this.response(res, {
        success: true
      });
    } catch (error) {
      return next(error);
    }
  }

  async verifyAction(req, res, next) {
    try {
      let userModel = this.app.get('MODEL').get('userModel'),
        userService = this.app.get('SERVICE').get('userService');

      const { token } = req.body;
      const isValid = userService.verifyVerificationToken(token);

      if (!isValid) {
        throw new Error('token error');
      }

      const userId = userService.decodeVerificationTokenCode(token).id;

      await userModel.update(
        {
          verified: true
        },
        { id: userId }
      );

      const user = await userModel.parseUserFull(
        await userModel.getItemById(userId)
      );

      return this.response(res, {
        user: user,
        jwt: userService.getJWT(user)
      });
    } catch (error) {
      return next(error);
    }
  }

  async signUpAction(req, res, next) {
    let userModel = this.app.get('MODEL').get('userModel'),
      userService = this.app.get('SERVICE').get('userService'),
      username = req.body.username,
      email = req.body.email || null,
      password_hashed = userService.passwordHash(req.body.password),
      user = null;

    const now = Math.floor(Date.now() / 1000);

    try {
      /** Checks if user exists with given username */
      if ((await userModel.getUserByUsername(username)) !== null) {
        return next(Boom.conflict('user.exists'));
      }

      /** Checks if user exists with given email */
      if (email !== null && (await userModel.getUserByEmail(email)) !== null) {
        return next(Boom.conflict('user.exists'));
      }

      const userId = await userModel.insert({
        username,
        password: password_hashed,
        email,
        role: ROLE_USER,
        first_name: null,
        last_name: null,
        verified: false,
        date_added: now,
        date_modified: now
      });

      user = await userModel.getItemById(userId);

      try {
        userService.sendSignUpEmail(user);
      } catch (error) {
        console.error('[signup email error]', error);
      }
    } catch (error) {
      return next(error);
    }

    user = await userModel.parseUserFull(user);

    return this.response(res, {
      user: user
    });
  }

  async authenticateAction(req, res, next) {
    let userModel = this.app.get('MODEL').get('userModel'),
      userService = this.app.get('SERVICE').get('userService'),
      username = req.body.username,
      password_hashed = userService.passwordHash(req.body.password),
      user = null;

    try {
      user = await userModel.getUserByAuthenticationCredentials(
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

  async usersFetchAction(req, res, next) {
    try {
      let meta = {
        total: 0,
        total_in_response: 0
      };

      let { limit, offset, order_by } = req.query,
        search = req.query.search || '';

      limit = limit ? parseInt(limit) : undefined;
      offset = offset ? parseInt(offset) : undefined;

      let order = ['id', 'ASC'];

      if (order_by && order_by === 'newest') {
        order = ['id', 'DESC'];
      }

      let userModel = this.app.get('MODEL').get('userModel'),
        users = await userModel.fetchUsers(limit, offset, false, search, order);

      meta.total = await userModel.fetchUsers(null, null, true, search, order);
      meta.total_in_response = users.length;

      return this.response(res, {
        users: await Promise.all(
          users.map(user => userModel.parseUserFull(user))
        ),
        meta
      });
    } catch (error) {
      return next(error);
    }
  }
  async updatePasswordAction(req, res, next) {
    const userModel = this.app.get('MODEL').get('userModel'),
      userService = this.app.get('SERVICE').get('userService');

    let password_hashed = userService.passwordHash(req.body.password);
    let new_password_hashed = userService.passwordHash(req.body.new_password);
    let userId = req.user.id;

    try {
      if (
        (await userModel.getItemBy({
          password: password_hashed,
          id: userId
        })) === null
      ) {
        return next(Boom.conflict('wrong.credentials'));
      }

      await userModel.update({ password: new_password_hashed }, { id: userId });

      try {
        userService.sendPasswordChangedEmail(req.user);
      } catch (error) {
        console.error('[change password email error]', error);
      }

      return this.response(res, {
        success: 'true!'
      });
    } catch (e) {
      return next(e);
    }
  }

  async updateAction(req, res, next) {
    let userModel = this.app.get('MODEL').get('userModel');
    let { last_name, first_name, username, role, email } = req.body;
    let { id } = req.params;
    const now = Math.floor(Date.now() / 1000);

    /** Updates user */
    try {
      let params = {
        email,
        first_name,
        last_name,
        role,
        username,
        date_modified: now
      };

      Object.keys(params).forEach(param_key => {
        if (typeof params[param_key] === 'undefined') {
          delete params[param_key];
        }
      });

      const user = await userModel.getItemBy({
        id,
        deleted: false
      });

      if (!user) {
        return next(Boom.badRequest('user is not found'));
      }

      await userModel.update(params, { id: user.id });

      return this.response(res, {
        success: true
      });
    } catch (error) {
      return next(error);
    }
  }
  async fetchByIdAction(req, res, next) {
    let userModel = this.app.get('MODEL').get('userModel');
    const id = req.params.id;
    let user = null;
    try {
      user = await userModel.getItemBy({ id: id, deleted: false });
      if (!user) {
        return next(Boom.badRequest('user is not found'));
      }
      return this.response(res, {
        user: await userModel.parseUserFull(user)
      });
    } catch (error) {
      return next(error);
    }
  }
  async userAction(req, res, next) {
    let userModel = this.app.get('MODEL').get('userModel'),
      user = await userModel.parseUserFull(req.user);

    return this.response(res, {
      user
    });
  }
}

module.exports = userController;
