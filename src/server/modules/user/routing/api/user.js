let Joi = require('joi'),
  validation = require('./../../../../middlewares/validation'),
  {
    AUTHORIZATION_TOKEN,
    FETCH_USER,
    IS_ADMIN
  } = require('./../../middlewares/authorization');

module.exports = app => {
  let userController = new (require('../../controller/api/userController'))(
    app
  );

  app.post(
    '/api/v1/verify',
    validation.bind(
      null,
      Joi.object().keys({
        token: Joi.string().required()
      }),
      'body'
    ),
    userController.verifyAction
  );

  app.post(
    '/api/v1/users/forgotten-password',
    validation.bind(
      null,
      Joi.object().keys({
        email: Joi.string().required()
      }),
      'body'
    ),
    userController.forgottenPasswordAction
  );

  app.put(
    '/api/v1/users/forgotten-password-change',
    validation.bind(
      null,
      Joi.object().keys({
        token: Joi.string().required(),
        password: Joi.string().required()
      }),
      'body'
    ),
    userController.forgottenPasswordChangeAction
  );

  app.post(
    '/api/v1/sign-up',
    validation.bind(
      null,
      Joi.object().keys({
        username: Joi.string().required(),
        password: Joi.string().required(),
        email: Joi.string().required()
      }),
      'body'
    ),
    userController.signUpAction
  );

  app.post(
    '/api/v1/authenticate',
    validation.bind(
      null,
      Joi.object().keys({
        username: Joi.string().required(),
        password: Joi.string().required()
      }),
      'body'
    ),
    userController.authenticateAction
  );
  app.post(
    '/api/v1/facebook-auth',
    validation.bind(
      null,
      Joi.object().keys({
        accessToken: Joi.string().required(),
        userId: Joi.string().required()
      }),
      'body'
    ),
    userController.facebookAuthAction
  );

  app.put(
    '/api/v1/users/:id',
    AUTHORIZATION_TOKEN,
    FETCH_USER,
    IS_ADMIN,
    validation.bind(
      null,
      Joi.object().keys({
        first_name: Joi.string(),
        last_name: Joi.string(),
        role: Joi.string(),
        username: Joi.string(),
        password: Joi.string(),
        email: Joi.string()
      }),
      'body'
    ),
    userController.updateAction
  );

  app.put(
    '/api/v1/users/:id/password',
    AUTHORIZATION_TOKEN,
    FETCH_USER,
    validation.bind(
      null,
      Joi.object().keys({
        password: Joi.string().required(),
        new_password: Joi.string().required()
      }),
      'body'
    ),
    userController.updatePasswordAction
  );

  app.get(
    '/api/v1/users/:id',
    AUTHORIZATION_TOKEN,
    FETCH_USER,
    IS_ADMIN,
    userController.fetchByIdAction
  );
  app.get(
    '/api/v1/user',
    AUTHORIZATION_TOKEN,
    FETCH_USER,
    userController.userAction
  );

  app.get(
    '/api/v1/users',
    AUTHORIZATION_TOKEN,
    FETCH_USER,
    IS_ADMIN,
    userController.usersFetchAction
  );
};
