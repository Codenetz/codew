let
  is = require("../../utils/is"),
  logger = require("../../utils/logger");

class container {

  constructor(app) {

    if(this.constructor.name === "container") {
      throw new Error("Container class cannot be initialized");
    }

    this.application = app;
  }

  set (object) {

    if(!is.object(object)) {
      throw new TypeError("Expected object");
    }

    let
      class_name = object.constructor.name,
      objects = this.application.get(this.container_name) || {};

    objects[class_name] = object;
    this.application.set(this.container_name, objects);

    const {
      ENV
    } = this.application.settings;

    /** Log loaded models */
    if (ENV.isDevelopment) {
      logger.info("[CONTAINER][" + this.container_name + "] " + class_name);
    }

    return this;
  }

  get (model_class_name) {
    let scope_objects = this.application.get(this.container_name) || {};
    if(scope_objects[model_class_name]) {
      return scope_objects[model_class_name];
    }

    return null;
  }
}

module.exports = container;