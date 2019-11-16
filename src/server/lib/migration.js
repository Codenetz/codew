let fs = require('fs'),
  path = require('path'),
  appMock = require('./appMock'),
  logger = require('../../server/utils/logger'),
  mySQL = require('../drivers/mySQL');

const MIGRATION_VAR_DIR_PATH = __dirname + '/../../../var/';
const MIGRATIONS = __dirname + '/../migrations.json';
const DEFAULT_VALUE_VAR_FILE = { latest: null, history: [] };
const APP_MOCK = new appMock();

class migration {
  constructor(migration_config_var_filename) {
    this.migration_config_var_file_name = migration_config_var_filename;
    this.last_query = '';

    this.createMigrationConfig();
    mySQL(APP_MOCK);
    logger.info(
      'DATABASE: ' + APP_MOCK.settings.ENV.vars.MYSQL_DEFAULT_DATABASE
    );
  }

  getMigrationConfigVarPath() {
    return MIGRATION_VAR_DIR_PATH + this.migration_config_var_file_name;
  }

  get lastQuery() {
    return this.last_query;
  }

  /** Gets connection from pool */
  async getConnection() {
    return await APP_MOCK.get('MYSQL_POOL').getConnection();
  }

  async executeAutomaticUp() {
    while (await this.executeNextUp()) {
      // empty
    }
    return true;
  }

  write(path, json) {
    fs.writeFileSync(path, JSON.stringify(json), 'utf8');
  }

  read(path) {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
  }

  getMigrations() {
    return this.read(MIGRATIONS);
  }

  readConfig() {
    return this.read(this.getMigrationConfigVarPath());
  }

  writeConfig(json) {
    return this.write(this.getMigrationConfigVarPath(), json);
  }

  requireMigration(migration_path) {
    return require(path.dirname(MIGRATIONS) + migration_path);
  }

  createMigrationConfig() {
    try {
      fs.writeFileSync(
        this.getMigrationConfigVarPath(),
        JSON.stringify(DEFAULT_VALUE_VAR_FILE),
        { flag: 'wx' }
      );
    } catch (err) {
      // empty
    }
  }

  /** Sets the latest executed migration path */
  setLatestMigration(migration_path) {
    let migration_var = this.readConfig();
    migration_var.latest = migration_path;
    this.writeConfig(migration_var);
  }

  /** Sets the history */
  setHistoryMigration(history) {
    let migration_var = this.readConfig();
    migration_var.history.push(history);
    this.writeConfig(migration_var);
  }

  createHistoryObject(action, query, migration_path, error) {
    return {
      action: action,
      query: query,
      migration_path: migration_path,
      error: error,
      time: new Date()
    };
  }

  async executeNextUp() {
    let migrations_path = this.getMigrations(),
      migration_config = this.readConfig(),
      latest_migration = migration_config.latest,
      migration_latest_path_index = migrations_path.indexOf(latest_migration);

    if (migrations_path.length === 0) {
      logger.warning('No migrations found');
      return false;
    }

    if (latest_migration !== null && migration_latest_path_index < 0) {
      throw new Error('latest path was not found in migrations config file.');
    }

    /** Get next migration path after the latest */
    let migration_path =
      latest_migration === null
        ? migrations_path[0]
        : migrations_path[migration_latest_path_index + 1];

    if (!migration_path) {
      logger.warning('No migrations to be executed');
      return;
    }

    let executed = await this.execute(migration_path, 'up');

    if (executed) {
      this.setLatestMigration(migration_path);
    }

    return executed;
  }

  async executeNextDown() {
    let migrations_path = this.getMigrations(),
      migration_config = this.readConfig(),
      latest_migration = migration_config.latest,
      migration_latest_path_index = migrations_path.indexOf(latest_migration);

    if (migrations_path.length === 0) {
      logger.warning('No migrations found');
      return false;
    }

    if (latest_migration === null) {
      logger.warning('No migrations to be executed');
      return;
    }

    if (migration_latest_path_index <= -1) {
      throw new Error('latest path was not found in migrations config file.');
    }

    let executed = await this.execute(latest_migration, 'down');

    if (executed) {
      this.setLatestMigration(
        migration_latest_path_index <= 0
          ? null
          : migrations_path[migration_latest_path_index - 1]
      );
    }

    return executed;
  }

  async execute(migration_path, action) {
    if (['up', 'down'].indexOf(action) <= -1) {
      throw new Error('Incorrect value for parameter action');
    }

    let migration_module = {};

    try {
      migration_module = this.requireMigration(migration_path);
    } catch (err) {
      logger.error(err);
      return false;
    }

    let query = migration_module[action];

    this.last_query = query;

    let error = null,
      connection = await this.getConnection(),
      result = await connection.query(query).catch(err => {
        logger.error(err.toString());
        error = err.toString();
      });

    /** Writes to history */
    this.setHistoryMigration(
      this.createHistoryObject(action, query, migration_path, error)
    );

    if (!result) {
      return false;
    }

    connection.release();
    return true;
  }
}

module.exports = migration;
