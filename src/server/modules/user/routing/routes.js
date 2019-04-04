let Joi = require('joi'),
  validation = require('./../../../middlewares/validation'),
  {
    AUTHORIZATION_TOKEN,
    FETCH_USER,
    IS_ADMIN
  } = require('./../middlewares/authorization');

module.exports = app => {
  let userController = new (require('../controller/userController'))(app);

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

  app.get(
    '/api/v1/test-admin',
    AUTHORIZATION_TOKEN,
    FETCH_USER,
    IS_ADMIN,
    userController.testAction
  );
};
