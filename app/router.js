"use strict";

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  const auth = app.middleware.auth({ secret: "secert" });
  const { router, controller } = app;
  router.get("/", controller.home.index);
  router.get("/login", controller.home.login);
  router.get("/testlogin", auth, controller.home.needLogin);
};
