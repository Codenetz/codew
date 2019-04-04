module.exports = app => {
  /** Gets available languages.
   *  They could be fetched from a file, api, written here, etc ...
   */
  const languages = [
    {
      name: 'English',
      code: 'en_GB',
      domain: 'en',
      country_codes: ['US', 'GB'],
      is_default: true
    },
    {
      name: 'Bulgarian',
      code: 'bg_BG',
      domain: 'bg',
      country_codes: ['BG'],
      is_default: false
    },
    {
      name: 'Spanish',
      code: 'es_ES',
      domain: 'es',
      country_codes: ['ES', 'MX', 'AR'],
      is_default: false
    }
  ];

  app.set('languages', languages);
};
