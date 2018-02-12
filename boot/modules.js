let
  fs = require("fs"),
  path = require("path"),
  module_config_path = __dirname + "/../src/server/modules.json";

module.exports = (app) => {
  let modules = JSON.parse(fs.readFileSync(module_config_path, "utf8"));

  Object.keys(modules).map((module_name) => {
    let
      module_config = modules[module_name];
    require(path.dirname(module_config_path) + module_config.path)(app);
  });
};