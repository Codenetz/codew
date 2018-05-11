let
  Joi = require("joi"),
  validation = require("./../../../middlewares/validation");

module.exports = (app) => { 
  let userController = new(require("../controller/userController"))(app);

  app.post("/api/v1/sign-up",
    validation.bind(
      null,
      Joi.object().keys({
        username: Joi.string().required(),
        password: Joi.string().required(),
        email: Joi.string().required()
      }),
      "body"
    ),
    userController.signUpAction);

  app.post("/api/v1/authenticate",
    validation.bind(
      null,
      Joi.object().keys({
        username: Joi.string().required(),
        password: Joi.string().required()
      }),
      "body"
    ),
    userController.authenticateAction);
};