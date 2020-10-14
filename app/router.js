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
  const auth = app.middleware.auth({ secret });
  const { router, controller } = app;

  router.get('/', controller.home.index);
  router.get('/login', controller.home.login);
  router.get('/testlogin', auth, controller.home.needLogin);
};
