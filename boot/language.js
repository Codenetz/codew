module.exports = (app) => {

  /** Gets available languages.
   *  They could be fetched from a file, api, written here, etc ...
   */
  app.set("languages", [
    {
      name: "Bulgarian",
      code: "bg_BG",
      domain: "bg-bg",
      is_default: true
    },
    {
      name: "English",
      code: "en-GB",
      domain: "en-gb",
      is_default: false
    },
    {
      name: "Spanish",
      code: "es-ES",
      domain: "es-es",
      is_default: false
    },
    {
      name: "Russian",
      code: "ru-RU",
      domain: "ru-ru",
      is_default: false
    },
    {
      name: "German",
      code: "de-DE",
      domain: "de-de",
      is_default: false
    }
  ]);
};