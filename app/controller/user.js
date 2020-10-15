'use strict';

const Controller = require('egg').Controller;
const validator = require('validator');
const fs = require('fs');
const path = require('path');
const jsonwebtoken = require('jsonwebtoken');

const secret = fs.readFileSync(
  path.resolve(__dirname, '../../rsa_private_key.pem')
);

class UserController extends Controller {
  async signin() {
    const { ctx, service } = this;
    const { loginname, pass } = ctx.request.body;
    const user = await service.user.getUserByLoginName(loginname);
    console.log('user: ', user);
    const valid = ctx.helper.bcompare(pass, user.pass);

    if (user && valid) {
      const token = jsonwebtoken.sign({ loginname: user.loginname, id: user._id }, secret, {
        expiresIn: '1d',
        algorithm: 'RS256',
      });

      ctx.body = { code: 0, data: { user, token } };
    } else {
      ctx.body = { code: 1, message: '用户名或密码错误', data: {} };
    }
  }

  async signup() {
    const { ctx, service } = this;
    let { loginname, email, pass, rePass } = ctx.request.body;
    loginname = validator.trim(loginname || '').toLowerCase();
    email = validator.trim(email || '').toLowerCase();
    pass = validator.trim(pass || '');
    rePass = validator.trim(rePass || '');

    let msg;
    // 验证信息的正确性
    if ([ loginname, pass, rePass, email ].some(item => {
      return item === '';
    })) {
      msg = '信息不完整。';
    } else if (loginname.length < 5) {
      msg = '用户名至少需要5个字符。';
    } else if (!ctx.helper.validateId(loginname)) {
      msg = '用户名不合法。';
    } else if (!validator.isEmail(email)) {
      msg = '邮箱不合法。';
    } else if (pass !== rePass) {
      msg = '两次密码输入不一致。';
    }

    if (msg) {
      ctx.status = 422;
      return { code: 1, message: msg, data: { } };
    }

    const users = await service.user.getUsersByQuery({ $or: [
      { loginname },
      { email },
    ] }, {});

    if (users.length > 0) {
      ctx.status = 422;
      return { code: 1, message: '用户名或密码重复', data: {} };
    }

    const passhash = ctx.helper.bhash(pass);

    const user = await service.user.newAndSave(loginname, passhash, email);
    // 发送激活邮件
    // await service.mail.sendActiveMail(email, utility.md5(email + passhash + config.session_secret), loginname);
    ctx.body = { code: 0, message: '验证通过', data: user };
  }

  async needLogin() {
    const { ctx } = this;

    // await app.redis.set('foo', 'redis链接成功');
    // const foo = await app.redis.get('foo');

    ctx.body = { code: 0, message: '验证通过', data: {} };
  }
}

module.exports = UserController;
