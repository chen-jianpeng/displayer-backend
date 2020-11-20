'use strict';

const Controller = require('egg').Controller;
const validator = require('validator');
const fs = require('fs');
const path = require('path');
const jsonwebtoken = require('jsonwebtoken');
const utility = require('utility');

const secret = fs.readFileSync(
  path.resolve(__dirname, '../../rsa_private_key.pem')
);

class UserController extends Controller {
  async signin() {
    const { ctx, app, service } = this;
    const { loginname, pass } = ctx.request.body;
    const user = await service.user.getUserByLoginName(loginname).lean();
    const valid = user && ctx.helper.bcompare(pass, user.pass);

    if (valid) {
      // 生成token
      const token = jsonwebtoken.sign(
        { loginname: user.loginname, id: user._id },
        secret,
        { algorithm: 'RS256' }
      );
      delete user.pass;
      user.token = token;

      // 将token存储在redis中，并设置过期时间
      await app.redis.setex(token, app.config.token_expire, JSON.stringify(user));

      ctx.body = { success: true, data: user };
    } else {
      ctx.body = { success: false, error_msg: '用户名或密码错误', data: {} };
    }
  }

  async signup() {
    const { ctx, service, config } = this;
    let { loginname, email, pass, rePass } = ctx.request.body;
    loginname = validator.trim(loginname || '').toLowerCase();
    email = validator.trim(email || '').toLowerCase();
    pass = validator.trim(pass || '');
    rePass = validator.trim(rePass || '');

    let msg;
    // 验证信息的正确性
    if (
      [ loginname, pass, rePass, email ].some(item => {
        return item === '';
      })
    ) {
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
      return { code: 1, message: msg, data: {} };
    }

    const users = await service.user.getUsersByQuery(
      { $or: [{ loginname }, { email }] },
      {}
    );

    if (users.length > 0) {
      ctx.status = 422;
      return { code: 1, message: '用户名或密码重复', data: {} };
    }

    const passhash = ctx.helper.bhash(pass);

    const user = await service.user.newAndSave(loginname, passhash, email);
    // 发送激活邮件
    await service.mail.sendActiveMail(
      email,
      utility.md5(email + passhash + config.session_secret),
      loginname
    );
    ctx.body = { success: true, data: user };
  }

  async needLogin() {
    const { ctx } = this;
    ctx.body = { success: true, data: {} };
  }

  async activeAccount() {
    const { ctx, service } = this;
    const key = validator.trim(ctx.query.key || '');
    const name = validator.trim(ctx.query.name || '');

    const user = service.user.getUserByLoginName(name);

    if (!user) {
      ctx.body = { success: false, error_msg: '用户不存在。' };
      return;
    }

    if (!user || utility.md5(user.email + user.pass + secret) !== key) {
      ctx.body = { success: false, error_msg: '信息有误，帐号无法被激活。' };
      return;
    }

    if (user.active) {
      ctx.body = { success: false, error_msg: '帐号已经是激活状态。' };
      return;
    }

    user.active = true;
    const data = await user.save();
    ctx.body = { success: true, data };
  }
}

module.exports = UserController;
