class invalidArgumentException extends Error {
  constructor(message) {
    super();
    Error.captureStackTrace(this, this.constructor);
    this.name = 'invalidArgumentException';
    this.message = message || '';
  }
}
module.exports = invalidArgumentException;
