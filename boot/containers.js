let fs = require('fs');
let path = require('path');
let container_config_path = __dirname + '/../src/server/containers.json';

module.exports = app => {
  let containers = JSON.parse(fs.readFileSync(container_config_path, 'utf8'));

  Object.keys(containers).map(container_name => {
    let container_config = containers[container_name],
      container = new (require(path.dirname(container_config_path) +
        container_config.path))(app);

    app.set(container_name, container);
  });
};
