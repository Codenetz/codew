let
  clientDevice = require("./../../../middlewares/clientDevice"),
  language = require("./../../../middlewares/language");

module.exports = (app) => {
  let homeController = new (require("../controller/homeController"))(app);

  app.get("/",
    language,
    clientDevice,
    homeController.homeAction
  );
};