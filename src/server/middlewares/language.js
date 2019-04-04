let clientLanguage = require('../lib/clientLanguage'),
  urlUtil = require('../utils/url'),
  normalizeUrl = require('normalize-url'),
  url = require('url');

module.exports = async (req, res, next) => {
  if (req.app.settings.ENV.vars.ENABLE_MULTILANGUAGE === 'false') {
    req.language = null;
    req.translation = null;
    return next();
  }

  let ClientLanguage = new clientLanguage(req.app, req, res);

  /** Change client language if forced by query parameter */
  if (ClientLanguage.isLanguageForChange()) {
    let /** Gets the wanted language by query parameter */
      language = ClientLanguage.findLanguageByQueryParameter(),
      /** Gets the default language */
      default_language = ClientLanguage.getDefaultLanguage(),
      /** Removes the change language query parameter */
      redirect_to = normalizeUrl(urlUtil.full(req), {
        removeQueryParameters: [ClientLanguage.changeLanguageParameter]
      }),
      /** Splits the URL */
      redirect_url_parts = url.parse(redirect_to),
      /** Removes current subdomain from host if any */
      hostname = redirect_url_parts.hostname.replace(
        ClientLanguage.getSubdomain() + '.',
        ''
      ),
      /** Sets the new subdomain if the language is not default */
      subdomain =
        default_language.domain === language.domain
          ? ''
          : language.domain + '.';

    /** Joins all URL parts */
    redirect_to = '//' + subdomain + hostname + redirect_url_parts.path;

    /** Change language by setting cookie and redirecting client */
    ClientLanguage.changeLanguage(language, redirect_to);
    return;
  }

  /** Checks if it is a new client on a language subdomain different than the default language subdomain */
  if (ClientLanguage.isNewClientOnSubdomain()) {
    let language = ClientLanguage.findLanguageBySubdomain();

    ClientLanguage.setLocaleCookie(language.code);

    req.language = ClientLanguage.findLanguageBySubdomain();
    req.translation = ClientLanguage.getTranslationObject();
    return next();
  }

  /** Checks if client is trying to open different language subdomain. */
  if (ClientLanguage.isOnDifferentLanguageSubdomain()) {
    let language = ClientLanguage.findLanguageByCookie(),
      hostname = req.hostname.replace(ClientLanguage.getSubdomain() + '.', ''),
      redirect_to = '//' + language.domain + '.' + hostname + req.originalUrl;

    ClientLanguage.changeLanguage(language, redirect_to);
    return;
  }

  /** Change language on new clients by geolocation
   *
   * NGINX must be set with
   * proxy_set_header X-Forwarded-For
   */
  if (ClientLanguage.isNewClientOnRootDomain()) {
    let language = await ClientLanguage.findLanguageByGeoLocation(),
      /** Gets the default language */
      default_language = ClientLanguage.getDefaultLanguage(),
      /** Sets the new subdomain if the language is not default */
      subdomain =
        default_language.domain === language.domain
          ? ''
          : language.domain + '.',
      /** Joins all URL parts */
      redirect_to = '//' + subdomain + req.hostname + req.originalUrl;

    if (default_language.domain === language.domain) {
      ClientLanguage.setLocaleCookie(language.code);

      req.language = ClientLanguage.findLanguageBySubdomain();
      req.translation = ClientLanguage.getTranslationObject();
      return next();
    }

    ClientLanguage.changeLanguage(language, redirect_to);
    return;
  }

  /** Redirect client to correct subdomain by locale cookie */
  if (ClientLanguage.isMissingSubdomainWithCookie()) {
    let language = ClientLanguage.findLanguageByCookie(),
      redirect_to =
        '//' + language.domain + '.' + req.hostname + req.originalUrl;

    ClientLanguage.changeLanguage(language, redirect_to);
    return;
  }

  /** Redirect client to main domain if default language subdomain is requested */
  if (ClientLanguage.isOnDefaultSubdomain()) {
    let redirect_to =
      '//' +
      req.hostname.replace(
        ClientLanguage.getDefaultLanguage().domain + '.',
        ''
      ) +
      req.originalUrl;
    ClientLanguage.changeLanguage(
      ClientLanguage.getDefaultLanguage(),
      redirect_to
    );
    return;
  }

  req.language = ClientLanguage.findLanguageBySubdomain();
  req.translation = ClientLanguage.getTranslationObject();
  return next();
};
