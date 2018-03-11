let
  Joi = require('joi'),
  validation = require("./../../../middlewares/validation");

module.exports = (app) => {

  /** Controllers */
  let itemController = new (require("./../controller/itemController"))(app);

  /** Routes */
  app.get("/example", itemController.listAction);

  app.post("/example", validation.bind(null, Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required()
  })),
  itemController.listAction);

  app.post('/example-image',
    app.get("multer").single('image'),
    itemController.uploadItemAction
  );
};