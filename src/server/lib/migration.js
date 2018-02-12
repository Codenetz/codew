let
  fs = require("fs"),
  path = require("path"),
  appMock = require("./appMock"),
  logger = require("../../utils/logger"),
  mySQL = require("../drivers/mySQL");

const MIGRATION_VAR_FILE_PATH = __dirname + "/../../../var/migration.json";
const MIGRATION_CONFIG_FILE_PATH = __dirname + "/../migrations.json";
const DEFAULT_VALUE_VAR_FILE = {"latest":null,"history":[]};
const APP_MOCK = new appMock();

class migration {

  constructor() {
    this.tryToCreateVarMigration();
    this.last_query = "";
    mySQL(APP_MOCK);
  }

  get lastQuery() {
    return this.last_query;
  }

  /** Gets connection from pool */
  async getConnection() {
    return await APP_MOCK.get("MYSQL_POOL").getConnection();
  }

  write(path, json) {
    fs.writeFileSync(path, JSON.stringify(json), "utf8");
  }

  read(path) {
    return JSON.parse(fs.readFileSync(path, "utf8"));
  }

  readConfig() {
    return this.read(MIGRATION_CONFIG_FILE_PATH);
  }

  writeConfig(json) {
    return this.write(MIGRATION_CONFIG_FILE_PATH, json);
  }

  readVar() {
    return this.read(MIGRATION_VAR_FILE_PATH);
  }

  writeVar(json) {
    return this.write(MIGRATION_VAR_FILE_PATH, json);
  }

  requireMigration(migration_path) {
    return require(path.dirname(MIGRATION_CONFIG_FILE_PATH) + migration_path);
  }

  tryToCreateVarMigration() {
    try {
      fs.writeFileSync(MIGRATION_VAR_FILE_PATH, JSON.stringify(DEFAULT_VALUE_VAR_FILE), {flag: "wx"});
    }
    catch(err) {
      // empty
    }
  }

  /** Sets the latest executed migration path */
  setLatestMigration(migration_path) {
    let migration_var = this.readVar();
    migration_var.latest = migration_path;
    this.writeVar(migration_var);
  }

  createHistoryObject(action, query, migration_path, error) {
    return {
      "action": action,
      "query": query,
      "migration_path": migration_path,
      "error": error,
      "time": new Date()
    };
  }

  /** Sets the history */
  setHistoryMigration(history) {
    let migration_var = this.readVar();
    migration_var.history.push(history);
    this.writeVar(migration_var);
  }

  async executeAutomaticUp () {
    while (await this.executeNextUp()){
      // empty
    }
    return true;
  }

  async executeNextUp() {
    let
      migrations_path = this.readConfig(),
      migration_var = this.readVar(),
      latest_migration = migration_var.latest,
      migration_latest_path_index = migrations_path.indexOf(latest_migration);

    if(migrations_path.length === 0) {
      logger.warning("No migrations found");
      return false;
    }

    if(latest_migration !== null && migration_latest_path_index < 0) {
      throw new Error("Latest path was not found in migrations config file.");
    }

    /** Get next migration path after the latest */
    let migration_path = latest_migration === null ? migrations_path[0] : migrations_path[migration_latest_path_index+1];

    if(!migration_path) {
      logger.warning("No migrations to be executed");
      return;
    }

    let executed = await this.execute(migration_path, "up");

    if(executed) {
      this.setLatestMigration(migration_path);
    }

    return executed;
  }

  async executeNextDown() {
    let
      migrations_path = this.readConfig(),
      migration_var = this.readVar(),
      latest_migration = migration_var.latest,
      migration_latest_path_index = migrations_path.indexOf(latest_migration);

    if(migrations_path.length === 0) {
      logger.warning("No migrations found");
      return false;
    }

    if(latest_migration === null) {
      logger.warning("No migrations to be executed");
      return;
    }

    if(migration_latest_path_index <= -1) {
      throw new Error("Latest path was not found in migrations config file.");
    }

    let executed = await this.execute(latest_migration, "down");

    if(executed) {
      this.setLatestMigration((migration_latest_path_index <= 0) ? null : migrations_path[migration_latest_path_index-1]);
    }

    return executed;
  }


  async execute(migration_path, action) {

    if(["up", "down"].indexOf(action) <= -1) {
      throw new Error("Incorrect value for parameter action");
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

    let
      error = null,
      connection = await this.getConnection(),
      result = await connection.query(query).catch((err) => {
        logger.error(err.toString());
        error = err.toString();
      });

    /** Writes to history */
    this.setHistoryMigration(this.createHistoryObject(action, query, migration_path, error));

    if(!result) {
      return false;
    }

    connection.release();
    return true;
  }
}

module.exports = migration;