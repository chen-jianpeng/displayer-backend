'use strict';

const Controller = require('egg').Controller;
const getToken = require('../utils/getToken');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }

  async login() {
    const { ctx } = this;
    const token = getToken({ key: 'value' });
    ctx.body = { token };
  }

  async needLogin() {
    const { ctx } = this;
    ctx.body = { code: 0, message: '验证通过' };
  }
}

module.exports = HomeController;
