'use strict';

let logger = require('./../../../src/server/utils/logger'),
  url = require('./../../../src/server/utils/url'),
  noArgumentException = require('./../../../src/exceptions/noArgumentException'),
  translation = require('./../lib/translation'),
  invalidArgumentException = require('./../../../src/exceptions/invalidArgumentException');

class controller {
  constructor(app, force_init) {
    force_init = typeof force_init === 'undefined' ? false : force_init;

    if (this.constructor.name === 'controller' && force_init === false) {
      throw new Error('Controller class cannot be initialized');
    }

    this.app = app;
    this.bindScope();
  }

  trimPayload(payload) {
    Object.keys(payload).map(key => {
      payload[key] =
        typeof payload[key] === 'string' || payload[key] instanceof String
          ? payload[key].trim()
          : payload[key];
      return key;
    });

    return payload;
  }

  /**
   * @var object res App response object
   * @var object data Data to be send back to client
   * @var integer status_code HTTP status code
   */
  response(res, data, status_code) {
    if (typeof res === 'undefined') {
      throw new noArgumentException();
    }

    data = data || {};
    status_code = typeof status_code === 'undefined' ? 200 : status_code;
    return res.status(status_code).json({ data });
  }

  metaResponse(req, res, meta, og) {
    meta = typeof meta === 'undefined' ? {} : meta;
    og = typeof og === 'undefined' ? {} : og;

    if (typeof res === 'undefined') {
      throw new noArgumentException();
    }

    const { MAIN_HOST, MAIN_HOST_PROTOCOL } = req.app.get('ENV').vars;

    let default_meta = {
        title: 'default meta title',
        description: 'default meta description',
        canonical: req.url,
        paginated: false,
        index: 'INDEX'
      },
      default_og = {
        title: 'default meta title',
        author: null,
        host: MAIN_HOST,
        image:
          MAIN_HOST_PROTOCOL +
          '://' +
          MAIN_HOST +
          '/assets/images/default-og-image.jpg',
        url: url.withoutParams(req),
        description: 'default meta description',
        type: 'website'
      };

    return res.status(200).json({
      meta: Object.assign(default_meta, meta),
      og: Object.assign(default_og, og)
    });
  }

  /**
   * @var object req App request object
   * @var object res App response object
   * @var object meta Meta data
   * @var object og OG data
   */
  render(req, res, meta, og, config = {}) {
    meta = typeof meta === 'undefined' ? {} : meta;
    og = typeof og === 'undefined' ? {} : og;

    config = Object.assign(
      {
        asset_file_name: 'desktop' + req.app.get('VERSION').hash
      },
      config
    );

    const {
      NODE_ENV,
      MAIN_HOST,
      MAIN_HOST_PROTOCOL,
      RESOURCE_HOST,
      FACEBOOK_APP_ID,
      GOOGLE_API_KEY,
      GOOGLE_ANALYTICS_KEY
    } = req.app.get('ENV').vars;

    let in_production = NODE_ENV === 'production',
      default_meta = {
        title: 'default meta title',
        description: 'default meta description',
        canonical: req.url,
        paginated: false,
        index: 'INDEX'
      },
      default_og = {
        title: 'default meta title',
        author: null,
        host: MAIN_HOST,
        image:
          MAIN_HOST_PROTOCOL +
          '://' +
          MAIN_HOST +
          '/assets/images/default-og-image.jpg',
        url: url.withoutParams(req),
        description: 'default meta description',
        type: 'website'
      };

    res.cookie('production', in_production, {
      maxAge: 1000 * 60 * 60 * 24 * 1,
      httpOnly: false,
      domain: '.' + MAIN_HOST
    });

    req.default_language = req.default_language || {};
    req.language = req.language || {};
    req.supported_languages = req.supported_languages || [];

    return res.render('index', {
      asset_file_name: config.asset_file_name,
      version_hash: req.app.get('VERSION').hash,
      in_production: in_production,
      default_language: {
        name: req.default_language.name,
        code: req.default_language.code
      },
      current_language: {
        name: req.language.name,
        code: req.language.code
      },
      supported_languages: req.supported_languages.map(language => {
        return {
          name: language.name,
          code: language.code
        };
      }),
      language_code:
        req.language && req.language.code
          ? req.language.code
          : req.default_language.code,
      ENV: in_production ? 'production' : 'development',
      MAIN_HOST,
      GOOGLE_API_KEY,
      GOOGLE_ANALYTICS_KEY,
      RESOURCE_HOST,
      FACEBOOK_APP_ID,
      meta: Object.assign(default_meta, meta),
      og: Object.assign(default_og, og),
      translation: new translation(
        req.translation && req.translation.translation
          ? req.translation.translation
          : null
      )
    });
  }

  bindScope() {
    const { ENV } = this.app.settings;

    let methods = Object.getOwnPropertyNames(this.constructor.prototype);

    /** Log loaded actions */
    if (ENV.isDevelopment) {
      logger.info('[CONTROLLER] ' + this.constructor.name);
    }

    for (let i = 0; i < methods.length; i++) {
      /** Method name */
      const key = methods[i];

      /** Method reference */
      const method = this[key];

      /** Bind current scope to controller methods */
      if (key !== 'constructor' && typeof method === 'function') {
        this[key] = method.bind(this);

        /** Log loaded actions */
        if (ENV.isDevelopment) {
          logger.info('[ACTION] ' + this.constructor.name + '.' + key);
        }
      }
    }
  }
}

module.exports = controller;
