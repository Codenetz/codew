let
  clientDevice = require("./../../../middlewares/clientDevice");

module.exports = (app) => {
  let homeController = new (require("../controller/homeController"))(app);

  app.get("/",
    clientDevice,
    homeController.homeAction
  );
};