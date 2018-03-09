(async () => {

  /** Load module for .env support */
  require("dotenv").config();

  let
    logger = require("../src/utils/logger"),
    migrationClass = require("../src/server/lib/migration"),
    args = process.argv.slice(2),
    action = "automatic-up",
    migration_path = null,
    actions = ["up", "down", "automatic-up"];

  if(args.length > 2) {
    logger.error("To much arguments are given");
    return false;
  }

  if(args.length > 0) {
    if(actions.indexOf(args[0]) <= -1) {
      logger.error("First argument must be one of: " + JSON.stringify(actions) + ". The default value is \"automatic-up\".");
      return false;
    }

    /** Sets action (up, down, automatic-up) */
    action = args[0];

    if(typeof args[1] !== "undefined") {

      /** Sets migration file path */
      migration_path = args[1];
    }
  }

  let successExecuteMessage = (query) => {
    logger.success("Successfully executed");
    if(query) {
      logger.info("Last executed query:");
      logger.info(query);
    }
  };

  let failToExecuteMessage = (query) => {
    logger.error("Fail to execute");
    if(query) {
      logger.info("Last executed query:");
      logger.info(query);
    }
  };

  let migration = new migrationClass();

  /** Automatic */
  if(action === "automatic-up") {

    if(await migration.executeAutomaticUp()) {
      logger.warning("Automatic up migration has ended. Review var/migration.json");
      if(migration.lastQuery) {
        logger.info("Last executed query:");
        logger.info(migration.lastQuery);
      }
      return true;
    }

    failToExecuteMessage(migration.lastQuery);
    return false;
  }

  /** Next up */
  else if(action === "up" && migration_path === null) {

    if(await migration.executeNextUp()) {
      successExecuteMessage(migration.lastQuery);
      return true;
    }

    failToExecuteMessage(migration.lastQuery);
    return false;
  }

  else if(action === "up" && migration_path !== null) {

    if(await migration.execute(migration_path, "up")) {
      successExecuteMessage(migration.lastQuery);
      return true;
    }

    failToExecuteMessage(migration.lastQuery);
    return false;
  }

  /** Next down */
  else if(action === "down" && migration_path === null) {

    if(await migration.executeNextDown()) {
      successExecuteMessage(migration.lastQuery);
      return true;
    }

    failToExecuteMessage(migration.lastQuery);
    return false;
  }

  else if(action === "down" && migration_path !== null) {

    if(await migration.execute(migration_path, "down")) {
      successExecuteMessage(migration.lastQuery);
      return true;
    }

    failToExecuteMessage(migration.lastQuery);
    return false;
  }

  return true;
})().then(process.exit);
