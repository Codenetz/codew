let
  fs = require("fs"),
  crypto = require('crypto'),
  shasum = crypto.createHash('sha1'),
  path = require("path");

class version {

  get hash() {
    this._hash = this._hash ? this._hash : shasum.update(this.current).digest('hex');
    return this._hash;
  }

  get current() {
    return fs.readFileSync(this.path, 'UTF-8');
  }

  get path() {
    return process.cwd() + "/.version";
  }

  updateMajor() {
    return this.update(0);
  }

  updateMinor() {
    return this.update(1);
  }

  updatePatch() {
    return this.update(2);
  }

  update(key) {
    let v = this.current.split(".").map((v) => parseInt(v) || 0);
    v[key] = v[key] + 1;
    fs.writeFileSync(this.path, v.join("."));
    return true;
  }
}

module.exports = version;