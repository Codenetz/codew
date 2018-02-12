"use strict";

module.exports = (app) => {

  /** Controllers */
  let listController = new (require("./../controller/listController"))(app);

  /** Routes */
  app.get("/", listController.listAction);
};