"use strict";

let
  logger = require("./../../../src/server/utils/logger");

class model {
  constructor(app, table) {

    if(this.constructor.name === "model") {
      throw new Error("Model class cannot be initialized");
    }

    this.table = table;
    this.app = app;
    this.bindScope();
  }

  bindScope() {

    const {
      ENV
    } = this.app.settings;

    /** Log loaded models */
    if (ENV.isDevelopment) {
      logger.info("[MODEL] " + this.constructor.name);
    }

    let methods = Object.getOwnPropertyNames(this.constructor.prototype);
    for (let i = 0; i < methods.length; i++) {

      /** Method name */
      const key = methods[i];

      /** Method reference */
      const method = this[key];

      /** Bind current scope to model methods */
      if (key !== "constructor" && typeof method === "function") {
        this[key] = method.bind(this);
      }
    }
  }

  /** Gets connection from pool */
  async getConnection() {
    return await this.app.get("MYSQL_POOL").getConnection();
  }

  /** Get all records from table */
  async findAll() {
    let
      connection = await this.getConnection(),
      result = await connection.query("SELECT * FROM " + this.table).catch(logger.error);
    connection.release();

    return result;
  }
}

module.exports = model;