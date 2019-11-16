module.exports = app => {
  let authController = new (require('../../controller/pages/authController'))(
    app
  );
  let profileController = new (require('../../controller/pages/profileController'))(
    app
  );

  app.get(
    [
      '/sign-up',
      '/u*'
    ],
    profileController.previewAction
  );

  app.get(['/login', '/logout'], authController.loginAction);
};
