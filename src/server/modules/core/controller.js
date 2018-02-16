"use strict";

let
  logger = require("./../../../../src/utils/logger"),
  noArgumentException = require("./../../../../src/exceptions/noArgumentException"),
  invalidArgumentException = require("./../../../../src/exceptions/invalidArgumentException");

class controller {
  constructor(app) {

    if(this.constructor.name === "controller") {
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

  /**
   * @var object res App response object
   * @var string message Message to be shown
   * @var array errors Contains array of error object
   * @var integer status_code HTTP status code
   */
  responseError(res, message, errors, status_code) {

    if(typeof res === 'undefined') {
      throw new noArgumentException();
    }

    message = message || "";
    errors = errors || [];

    if(errors.length > 0 && errors.filter(this.isValidError.bind(this)).length !== errors.length) {
      throw new invalidArgumentException("Invalid error object");
    }

    status_code = typeof status_code === 'undefined' ? 400 : status_code;
    return res.status(status_code).json({
      "error": {
        "code": status_code,
        "message": message,
        "errors": errors
      }
    });
  }

  /** 400 Bad Request
   *
   * @var object res App response object
   * @var string message Message to be shown
   * @var array errors Contains array of error object
   */
  responseBadRequest(res, message, errors) {
    return this.responseError(res, message, errors, 400);
  }

  /** 401 Unauthorized
   *
   * @var object res App response object
   * @var string message Message to be shown
   * @var array errors Contains array of error object
   */
  responseUnauthorized(res, message, errors) {
    return this.responseError(res, message, errors, 401);
  }

  /** 403 Forbidden
   *
   * @var object res App response object
   * @var string message Message to be shown
   * @var array errors Contains array of error object
   */
  responseForbidden(res, message, errors) {
    return this.responseError(res, message, errors, 403);
  }

  /** 404 Not Found
   *
   * @var object res App response object
   * @var string message Message to be shown
   * @var array errors Contains array of error object
   */
  responseNotFound(res, message, errors) {
    return this.responseError(res, message, errors, 404);
  }

  /** Checks if given error is valid
   *
   * @var object error
   */
  isValidError(error) {

    let props_name = Object.keys(error);

    if(props_name.length !== 3) {
      return false;
    }

    return (
      this.isValidErrorProp(props_name[0]) &&
      this.isValidErrorProp(props_name[1]) &&
      this.isValidErrorProp(props_name[2])
    );
  }

  /** Checks if given error prop name is valid
   *
   * @var string prop
   */
  isValidErrorProp(prop) {
    return (["prop", "message", "reason"].indexOf(prop) >= 0);
  }

  /** Creates an error
   *
   * @var string prop
   * @var string message
   * @var array reason
   */
  createError(prop, message, reason) {

    if(typeof prop === 'undefined') {
      throw new noArgumentException();
    }

    message = message || "";
    reason = reason || "";

    return {prop, message, reason};
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