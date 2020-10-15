'use strict';

const fs = require('fs');
const path = require('path');
const jsonwebtoken = require('jsonwebtoken');

const secret = fs.readFileSync(
  path.resolve(__dirname, '../../rsa_private_key.pem')
);

module.exports = function getToken(data) {
  return jsonwebtoken.sign(data, secret, {
    expiresIn: '1d',
    algorithm: 'RS256',
  });
};

module.exports = function Token(data) {
  return jsonwebtoken.sign(data, secret, {
    expiresIn: '1d',
    algorithm: 'RS256',
  });
};
