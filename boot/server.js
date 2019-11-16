'use strict';

let express = require('express'),
  morgan = require('morgan'),
  helmet = require('helmet'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  env = require('./env'),
  modules = require('./modules'),
  language = require('./language'),
  containers = require('./containers'),
  drivers = require('./drivers'),
  errorMiddleware = require('./../src/server/middlewares/error'),
  version = require('./../src/server/lib/version'),
  proxy = require('./proxy'),
  sendgrid = require('./sendgrid'),
  multer = require('./multer'),
  maxmind = require('maxmind'),
  app = express();

app.set('ENV', env);
app.set('VERSION', new version());

/** Loads proxy server */
proxy(app);

/** Take care of HTTP headers to secure the app */
app.use(helmet());

/** parse application/x-www-form-urlencoded */
app.use(bodyParser.urlencoded({ extended: false }));

/** parse application/json */
app.use(bodyParser.json());

/** parse cookies */
app.use(cookieParser());

/** Loads logger on development mode */
if (env.isDevelopment) {
  app.use(morgan('combined'));
}

/** Loads multer */
multer(app);

/** Loads sendgrid */
sendgrid(app);

if (env.vars.ENABLE_MULTILANGUAGE === 'true') {
  /** Loads mmdb */
  app.set('MAXMIND_LOOKUP', maxmind.openSync('./var/geo/geo.mmdb'));

  /** Loads available languages */
  language(app);
}

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

/** Loads modules */
modules(app);

/** Loads error middleware */
app.use('/', errorMiddleware);

module.exports = {
  app: app,
  beforeLoad: () => {
    return new Promise(resolve => {
      return resolve(app);
    });
  },
  load: () => {
    return new Promise(resolve => {
      let server = app.listen(env.vars.SERVER_PORT, () => {
        return resolve(app);
      });

      /** Sets max timeout */
      server.setTimeout(Number(env.vars.SERVER_TIMEOUT));
    });
  }
};
