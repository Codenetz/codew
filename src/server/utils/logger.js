const COLOR_DEFAULT = "\x1b[0m";
const COLOR_CYAN = "\x1b[36m";
const COLOR_RED = "\x1b[31m";
const COLOR_GREEN = "\x1b[32m";
const COLOR_YELLOW = "\x1b[33m";

class logger {

  static getDate() {
    return new Date().toLocaleString();
  }

  static setColor(value, color) {
    return color + value + COLOR_DEFAULT;
  }

  static info(value) {
    let date = logger.getDate();

    /* eslint-disable no-console */
    console.log(logger.setColor("[" + date + "]", COLOR_CYAN), value);
    /* eslint-enable no-console */
  }

  static error(value) {
    let date = logger.getDate();

    /* eslint-disable no-console */
    console.log(logger.setColor("[" + date + "]", COLOR_RED), logger.setColor(value, COLOR_RED));
    /* eslint-enable no-console */
  }

  static rawError(value) {
    let date = logger.getDate();

    /* eslint-disable no-console */
    console.log(logger.setColor("[" + date + "]", COLOR_RED), value);
    /* eslint-enable no-console */
  }

  static warning(value) {
    let date = logger.getDate();

    /* eslint-disable no-console */
    console.log(logger.setColor("[" + date + "]", COLOR_YELLOW), logger.setColor(value, COLOR_YELLOW));
    /* eslint-enable no-console */
  }

  static success(value) {
    let date = logger.getDate();

    /* eslint-disable no-console */
    console.log(logger.setColor("[" + date + "]", COLOR_GREEN), logger.setColor(value, COLOR_GREEN));
    /* eslint-enable no-console */
  }
}

module.exports.info = logger.info;
module.exports.error = logger.error;
module.exports.rawError = logger.rawError;
module.exports.warning = logger.warning;
module.exports.success = logger.success;