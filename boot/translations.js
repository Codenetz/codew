let fs = require('fs');

module.exports = (app) => {

  let
    languages = app.get("languages"),
    translations = [];

  for(let i = 0; i < languages.length; i++) {
    let
      language = languages[i],
      filename = language.code + ".json",
      filepath = __dirname + "/../translations/" + filename,
      translation = JSON.parse(fs.readFileSync(filepath, 'utf8'));

    translations.push({
      code: language.code,
      filename: filename,
      translation: translation
    });
  }

  app.set("translations", translations);
};