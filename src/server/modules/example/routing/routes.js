let
  Joi = require('joi'),
  validation = require("./../../../middlewares/validation"),
  imageCompression = require("./../../../middlewares/imageCompression");

module.exports = (app) => {

  /** Controllers */
  let itemController = new (require("./../controller/itemController"))(app);

  let fileUpload = app
    .get("multer")
    .fields([
      { name: "video", maxCount: 1 },
      { name: "image", maxCount: 1 }
    ]);

  /** Routes */
  app.get("/example", itemController.listAction);

  app.post(
    "/example",

    /** Handles file upload */
    fileUpload,

    imageCompression.bind(null, "image"),

    /** Checks uploaded files */
    validation.bind(
      null,
      Joi.object().keys({
        image: Joi.array().items(
          Joi.object().required()
        ).required()
      }),
      "files"
    ),

    /** Checks payload */
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