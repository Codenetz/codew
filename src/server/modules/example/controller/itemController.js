"use strict";

let
  controller = require("./../../core/controller"),
  Boom = require('boom');

class listController extends controller {
  listAction(req, res, next) {

    /** Containers */
    // console.log(this.app.get("MODEL"));
    // console.log(this.app.get("SERVICE"));

    /** Errors */
    // return next(Boom.forbidden());

    return this.response(res, {
      success: true
    });
  }

  createItemAction(req, res) {
    res.json("OK");
  }

  updateItemAction(req, res) {
    res.json("OK");
  }
}

module.exports = listController;