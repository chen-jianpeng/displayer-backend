'use strict';

const fs = require('fs');
const path = require('path');

const secret = fs.readFileSync(
  path.resolve(__dirname, '../rsa_public_key.pem')
);

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const apiV1Router = app.router.namespace('/api/v1');
  const tokenRequired = app.middleware.tokenRequired({ secret });
  const { controller } = app;

  apiV1Router.get('/', controller.home.index);
  apiV1Router.post('/signin', controller.user.signin);
  apiV1Router.post('/signup', controller.user.signup);
  apiV1Router.get('/testlogin', tokenRequired, controller.user.needLogin);

  apiV1Router.get('/project', tokenRequired, controller.project.index);
  apiV1Router.post('/project', tokenRequired, controller.project.create);
};
