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
  const auth = app.middleware.auth({ secret });
  const { controller } = app;

  apiV1Router.get('/', controller.home.index);
  apiV1Router.get('/signin', controller.user.signin);
  apiV1Router.post('/signup', controller.user.signup);
  apiV1Router.get('/testlogin', auth, controller.user.needLogin);
};
