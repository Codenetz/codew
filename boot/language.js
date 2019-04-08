let fs = require('fs');

module.exports = async app => {
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

  const translations = [];

  for (let i = 0; i < languages.length; i++) {
    let language = languages[i],
      filename = language.code + '.json',
      filepath = __dirname + '/../translations/' + filename,
      translation = JSON.parse(fs.readFileSync(filepath, 'utf8'));

    translations.push({
      code: language.code,
      filename: filename,
      translation: translation
    });
  }

  app.set('languages', languages);
  app.set('translations', translations);
};
