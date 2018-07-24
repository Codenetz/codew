"use strict";

let
  express = require("express"),
  morgan = require("morgan"),
  helmet = require("helmet"),
  uniqid = require("uniqid"),
  bodyParser = require('body-parser'),
  path = require("path"),
  env = require("./env"),
  modules = require("./modules"),
  language = require("./language"),
  translations = require("./translations"),
  containers = require("./containers"),
  drivers = require("./drivers"),
  multer = require('multer'),
  errorMiddleware = require("./../src/server/middlewares/error"),
  clientDevice = require("./../src/server/middlewares/clientDevice"),
  version = require("./../src/server/lib/version"),
  app = express();

app.set("ENV", env);
app.set("VERSION", new version());

/** Take care of HTTP headers to secure the app */
app.use(helmet());

/** parse application/x-www-form-urlencoded */
app.use(bodyParser.urlencoded({extended: false}));

/** parse application/json */
app.use(bodyParser.json());

/** Loads logger on development mode */
if (env.isDevelopment) {
  app.use(morgan("combined"));
}

app.set("multer", multer({

    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "public/uploads/");
      },

      filename: function (req, file, cb) {
        cb(null, uniqid() + path.extname(file.originalname));
      }
    }),

    limits: {
      fileSize: 15000000 //15MB
    }
  })
);

app.set('views', './src/client/views');
app.set('view engine', 'ejs');

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

/** Loads available languages */
language(app);

/** Loads translations */
translations(app);

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