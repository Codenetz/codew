module.exports = app => {
  let dashboardController = new (require('../../controller/pages/dashboardController'))(
    app
  );

  app.get(['/admin*'], dashboardController.indexAction);
};
