"use strict";

module.exports = (app) => {

  /** Controllers */
  let itemController = new (require("./../controller/itemController"))(app);

  /** Routes */
  app.get("/example", itemController.listAction);
};