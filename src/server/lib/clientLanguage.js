let
  ip = require("../utils/ip"),
  geolocation = require("../utils/geolocation"),
  {LANGUAGE_QUERY_PARAMETER} = require("../constants");

class clientLanguage {

  constructor(app, request, response) {
    this.app = app;

    this.request = request;
    this.response = response;
    this.domain = this.app.settings.ENV.vars.MAIN_HOST;
    this.change_language_parameter = LANGUAGE_QUERY_PARAMETER;
  }

  /** Checks if query parameter with locale is given
   *
   * example?lang=es_ES
   *
   * @return {boolean}
   */
  isLanguageForChange() {
    return (this.findLanguageByQueryParameter() !== null);
  }

  /** Checks if it is a new client on a language subdomain different than the default language subdomain.
   * To check if it is on the default subdomain use the isOnDefaultSubdomain() method.
   *
   * es.example
   *
   * @return {boolean}
   */
  isNewClientOnSubdomain() {
    return !this.isDefaultLanguage() && this.getSubdomain() !== null && !this.getLocaleFromCookie() && this.getClientIP();
  }

  /** Checks if it is a new client on the root domain
   *
   * example
   *
   * @return {boolean}
   */
  isNewClientOnRootDomain() {
    return !this.isDefaultLanguage() && this.getSubdomain() === null && !this.getLocaleFromCookie() && this.getClientIP();
  }

  /** Checks if client is trying to open different language subdomain.
   *
   * en.example (previous) -> es.example (current)
   *
   * @return {boolean}
   */
  isOnDifferentLanguageSubdomain() {
    return this.getSubdomain() !== null && this.findLanguageByCookie() && this.getSubdomain() !== this.findLanguageByCookie().domain;
  }

  /** Checks if client tries to open default subdomain.
   *
   * en.example (current)
   *
   * @return {boolean}
   */
  isOnDefaultSubdomain() {
    return this.getSubdomain() === this.getDefaultLanguage().domain;
  }

  /** Checks if client is on the root domain but has language cookie.
   *
   * example + locale cookie
   *
   * @return {boolean}
   */
  isMissingSubdomainWithCookie() {
    return (!this.isDefaultLanguage() && this.getSubdomain() === null && this.getLocaleFromCookie());
  }

  /** Checks if client tries to open default language by subdomain or cookie.
   *
   * en.example OR locale cookie
   *
   * @return {boolean}
   */
  isDefaultLanguage() {
    let default_language = this.getDefaultLanguage();
    return (this.getSubdomain() === default_language.domain) || (this.getLocaleFromCookie() === default_language.code);
  }

  /** @return {string} */
  get changeLanguageParameter() {
    return this.change_language_parameter;
  }

  /** Sets locale cookie and redirects client to correct host.
   *
   * @param {object} language
   * @param {string} redirect_to
   */
  changeLanguage(language, redirect_to) {
    this.setLocaleCookie(language.code);
    return this.response.redirect(301, redirect_to);
  }

  /** Sets locale cookie for 3 days
   *
   * @param {string} locale
   */
  setLocaleCookie(locale) {
    this.response.cookie('locale', locale, {
      maxAge: 1000 * 60 * 60 * 24 * 3,
      httpOnly: false,
      domain: "." + this.domain
    });
  }

  /** Gets client IP address.
   *
   * Nginx configuration:
   * proxy_set_header X-Forwarded-For
   *
   * @return {string}
   */
  getClientIP() {
    return ip(this.request);
  }

  /** Gets all platform available languages
   *
   * @return {array}
   */
  getLanguages() {
    return this.app.get("languages");
  }

  /** Gets all platform available translations
   *
   * @return {array}
   */
  getTranslations() {
    return this.translations = this.app.get("translations");
  }

  /** Gets current subdomain
   *
   * @return {(string|null)}
   */
  getSubdomain() {
    return this.request.subdomains.length > 0 ? this.request.subdomains[0] : null;
  }

  /** Gets current language locale from cookie
   *
   * @return {(string|null)}
   */
  getLocaleFromCookie() {
    return this.request.cookies && this.request.cookies.locale ? this.request.cookies.locale : null;
  }

  /** Gets translation object based on the subdomain
   *
   * @return {(object|null)}
   */
  getTranslationObject() {

    let
      translations = this.getTranslations(),
      language = this.findLanguageBySubdomain(),
      translation = null;

    for(let i = 0; i < translations.length; i++) {
      if(translations[i].code === language.code) {
        translation = translations[i];
        break;
      }
    }

    return translation;
  }

  /** Gets the default language
   *
   * @return {object}
   */
  getDefaultLanguage() {

    let
      language = null,
      languages = this.getLanguages();

    for(let i = 0; i < languages.length; i++) {
      language = languages[i].is_default === true ? languages[i] : language;
    }

    return language;
  }

  /** Gets language by client geo location
   *
   * @return {object}
   */
  async findLanguageByGeoLocation() {
    let code = await geolocation(this.getClientIP());

    if(!code) {
      return this.getDefaultLanguage();
    }

    let language = this.findLanguageByCountryCode(code);
    return language !== null ? language : this.getDefaultLanguage();
  }

  /** Gets language by subdomain
   *
   * @return {object}
   */
  findLanguageBySubdomain() {
    let
      language = null,
      languages = this.getLanguages(),
      subdomain = this.getSubdomain();

    for(let i = 0; i < languages.length; i++) {
      language = languages[i].domain === subdomain ? languages[i] : language;
    }

    return language === null ? this.getDefaultLanguage() : language;
  }

  /** Gets language by locale
   *
   * @param {string} code
   *
   * @return {(object|null)}
   */
  findLanguageByLocale(code) {
    let
      languages = this.getLanguages(),
      language = null;

    for(let i = 0; i < languages.length; i++) {
      if(languages[i].code == code) {
        language = languages[i];
      }
    }

    return language;
  }

  /** Gets language by country code
   *
   * @param {string} code
   *
   * @return {(object|null)}
   */
  findLanguageByCountryCode(code) {
    let
      languages = this.getLanguages(),
      language = null;

    for(let i = 0; i < languages.length; i++) {
      for (let j = 0; j < languages[i].country_codes.length; j++) {
        if(languages[i].country_codes[j] === code) {
          language = languages[i];
        }
      }
    }

    return language;
  }

  /** Gets language by cookie
   *
   * @return {object}
   */
  findLanguageByCookie() {
    let language = this.findLanguageByLocale(this.getLocaleFromCookie());
    return language !== null ? language : this.getDefaultLanguage();
  }

  /** Gets language by query parameter
   *
   * @return {object}
   */
  findLanguageByQueryParameter() {
    let query = this.request.query;

    if(!query[this.changeLanguageParameter]) {
      return null;
    }

    return this.findLanguageByLocale(query[this.changeLanguageParameter]);
  }
}

module.exports = clientLanguage;