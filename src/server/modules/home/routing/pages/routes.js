module.exports = app => {
  let homeController = new (require('../../controller/pages/homeController'))(
    app
  );

  app.get(
    [
      '/'
    ],
    homeController.homeAction
  );

  app.get(
    [
      '/*'
    ],
    homeController.notFoundAction
  );
};
