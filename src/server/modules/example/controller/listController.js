"use strict";

let controller = require("./../../core/controller");

class listController extends controller {
  listAction(req, res) {
    // console.log(this.app.get("MODEL"));
    // console.log(this.app.get("SERVICE"));
    let errors = [];
    errors.push(this.createError("test"));
    errors.push(this.createError("test", "m", "r"));
    errors.push(this.createError("test", "m"));
    return this.responseBadRequest(res, "Has error", errors);
  }

  createItemAction(req, res) {
    res.json("OK");
  }

  updateItemAction(req, res) {
    res.json("OK");
  }
}

module.exports = listController;