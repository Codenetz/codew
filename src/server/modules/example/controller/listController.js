"use strict";

let controller = require("./../../core/controller");

class listController extends controller {
  listAction(req, res) {
    // console.log(this.app.get("MODEL"));
    // console.log(this.app.get("SERVICE"));
    res.send("OK");
  }

  createItemAction(req, res) {
    res.send("OK");
  }

  updateItemAction(req, res) {
    res.send("OK");
  }
}

module.exports = listController;