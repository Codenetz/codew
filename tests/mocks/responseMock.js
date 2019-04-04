class responseMock {
  status(status_code) {
    this.status_code = status_code;
    return this;
  }
  json(data) {
    this.json_data = data;
  }
}

module.exports = responseMock;
