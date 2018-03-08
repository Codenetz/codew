(async () => {
  let
    logger = require("../src/utils/logger"),
    versionClass = require("../src/server/lib/version"),
    version = new versionClass();
    args = process.argv.slice(2),
    action = "show",
    actions = ["show", "major", "minor", "patch"];

  if(args.length > 1) {
    logger.error("To much arguments are given");
    return false;
  }

  if(args.length > 0) {
    if(actions.indexOf(args[0]) <= -1) {
      logger.error("First argument must be one of: " + JSON.stringify(actions) + ". The default value is \"show\".");
      return false;
    }

    /** Sets action (show, major, minor, patch) */
    action = args[0];
  }

  /** show */
  if(action === "show") {
    logger.info(version.current);
    logger.info(version.hash);
    return true;
  }

  if(action === "major") {
    return version.updateMajor();
  }

  if(action === "minor") {
    return version.updateMinor();
  }

  if(action === "patch") {
    return version.updatePatch();
  }

  return true;
})().then(process.exit);
