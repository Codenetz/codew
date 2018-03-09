"use strict";

let
  express = require("express"),
  morgan = require("morgan"),
  helmet = require("helmet"),
  bodyParser = require('body-parser'),
  env = require("./env"),
  modules = require("./modules"),
  containers = require("./containers"),
  drivers = require("./drivers"),
  errorMiddleware = require("./../src/server/middlewares/error"),
  app = express();

app.set("ENV", env);

/** Take care of HTTP headers to secure the app */
app.use(helmet());

/** parse application/x-www-form-urlencoded */
app.use(bodyParser.urlencoded({ extended: false }));

/** parse application/json */
app.use(bodyParser.json());

/** Loads logger on development mode */
if (env.isDevelopment) {
  app.use(morgan("combined"));
}

/** Loads containers */
containers(app);

/** Loads drivers */
drivers(app);

/**
 * Load static files on development mode.
 * When on production is better to be used the front web server for serving the static files.
 */
if (env.isDevelopment) {
  app.use(express.static('public'));
}

/** Loads modules */
modules(app);

/** Loads error middleware */
app.use("/", errorMiddleware);

module.exports = {
  app: app,
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