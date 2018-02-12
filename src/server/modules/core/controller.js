"use strict";

let
  logger = require("./../../../../src/utils/logger");

class controller {
  constructor(app) {

    if(this.constructor.name === "controller") {
      throw new Error("Controller class cannot be initialized");
    }

    this.app = app;
    this.bindScope();
  }

  bindScope() {

    const {
      ENV
    } = this.app.settings;

    let methods = Object.getOwnPropertyNames(this.constructor.prototype);

    /** Log loaded actions */
    if (ENV.isDevelopment) {
      logger.info("[CONTROLLER] " + this.constructor.name);
    }

    for (let i = 0; i < methods.length; i++) {

      /** Method name */
      const key = methods[i];

      /** Method reference */
      const method = this[key];

      /** Bind current scope to controller methods */
      if (key !== "constructor" && typeof method === "function") {
        this[key] = method.bind(this);

        /** Log loaded actions */
        if (ENV.isDevelopment) {
          logger.info("[ACTION] " + this.constructor.name + "." + key);
        }
      }
    }
  }
}

module.exports = controller;