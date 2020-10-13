'use strict';

const jsonwebtoken = require('jsonwebtoken');
const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = 'hi, egg';
  }

  async login() {
    const { ctx } = this;
    const secret = 'secert';
    const token = jsonwebtoken.sign({ key: 'value' }, secret, { expiresIn: '1d' });
    ctx.body = { token };
  }

  async needLogin() {
    const { ctx } = this;
    ctx.body = {code: 0, message:'验证通过'};
  }
}

module.exports = HomeController;
