module.exports = (req, res, next) => {

  let
    languages = req.app.get("languages"),
    translations = req.app.get("translations"),
    subdomain = req.subdomains.length > 0 ? req.subdomains[0] : null,
    default_language = null,
    language = null,
    translation = {};

  /** Match client language */
  for(let i = 0; i < languages.length; i++) {
    language = languages[i].domain === subdomain ? languages[i] : language;
    default_language = languages[i].is_default === true ? languages[i] : default_language;
  }

  /** Sets the default language if no match */
  language = language === null ? default_language : language;

  /** If current language is the default the client will be redirected to the main host */
  if(subdomain === default_language.domain) {

    /** Remove language subdomain from the host */
    let host = req.hostname.replace(subdomain + ".", "");

    /** Redirect */
    return res.redirect(301, "//" + host + req.originalUrl);
  }

  /** Gets the translation file */
  for(let i = 0; i < translations.length; i++) {
    if(translations[i].code === language.code) {
      translation = translations[i];
      break;
    }
  }

  req.language = language;
  req.translation = translation;
  return next();
};