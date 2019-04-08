class translation {
  constructor(_translations) {
    this.translations = _translations;
  }

  get translations() {
    return this._translations;
  }

  set translations(translations) {
    this._translations = translations;
  }

  translate(word) {
    return this.translations && this.translations[word]
      ? this.translations[word]
      : word;
  }

  translateWithParams(word, args) {
    args = typeof args === 'undefined' ? [] : args;
    word = this.translate(word);

    return word.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] !== 'undefined' ? args[number] : match;
    });
  }
}

module.exports = translation;
