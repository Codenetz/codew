let
  Joi = require('joi'),
  validation = require("./../../../middlewares/validation");

module.exports = (app) => {

  /** Controllers */
  let itemController = new (require("./../controller/itemController"))(app);

  /** Routes */
  app.get("/example", itemController.listAction);

  app.post(
    "/example",
    validation.bind(
      null,
      Joi.object().keys({
        name: Joi.string().required()
      }),
      "body"
    ),
    itemController.listAction);

  app.post('/example-image',
    app.get("multer").single('image'),
    itemController.uploadItemAction
  );
};