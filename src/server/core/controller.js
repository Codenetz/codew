"use strict";

let
  logger = require("./../../../src/server/utils/logger"),
  noArgumentException = require("./../../../src/exceptions/noArgumentException"),
  invalidArgumentException = require("./../../../src/exceptions/invalidArgumentException");

class controller {
  constructor(app, force_init) {

    force_init = typeof force_init === 'undefined' ? false : force_init;

    if(this.constructor.name === "controller" && force_init === false) {
      throw new Error("Controller class cannot be initialized");
    }

    this.app = app;
    this.bindScope();
  }

  /**
   * @var object res App response object
   * @var object data Data to be send back to client
   * @var integer status_code HTTP status code
   */
  response(res, data, status_code) {

    if(typeof res === 'undefined') {
      throw new noArgumentException();
    }

    data = data || {};
    status_code = typeof status_code === 'undefined' ? 200 : status_code;
    return res.status(status_code).json({data});
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