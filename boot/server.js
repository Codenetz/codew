"use strict";

let
  express = require("express"),
  morgan = require("morgan"),
  helmet = require("helmet"),
  env = require("./env"),
  modules = require("./modules"),
  containers = require("./containers"),
  drivers = require("./drivers"),
  app = express();

app.set("ENV", env);

/** Take care of HTTP headers to secure the app */
app.use(helmet());

/** Loads logger on development mode */
if (env.isDevelopment) {
  app.use(morgan("combined"));
}

/** Loads containers */
containers(app);

/** Loads drivers */
drivers(app);

/** Loads modules */
modules(app);

module.exports = {
  beforeLoad: () => {
    return new Promise((resolve) => {
      return resolve(app);
    });
  },
  load: () => {
    return new Promise((resolve) => {
      app.listen(env.vars.SERVER_PORT, () => {
        return resolve(app);
      });
    });
  }
};