'use strict';

const fs = require('fs');
const path = require('path');
const Service = require('egg').Service;
const jsonwebtoken = require('jsonwebtoken');

const secret = fs.readFileSync(
  path.resolve(__dirname, '../../rsa_private_key.pem')
);

class UserService extends Service {
  /**
   * 根据登录名查找用户
   *
   * @param {String} loginName 登录名
   * @return {Promise[user]} 承载用户的 Promise 对象
   */
  getUserByLoginName(loginName) {
    const query = { loginname: new RegExp('^' + loginName + '$', 'i') };
    return this.ctx.model.User.findOne(query).exec();
  }

  /**
   * 根据 token 查找用户
   *
   * @param {String} accessToken 登录标识
   * @return {Promise[user]} 承载用户的 Promise 对象
   */
  getUserByToken(accessToken) {
    const payload = jsonwebtoken.decode(accessToken.split(' ')[1], secret);
    const query = { id: payload.id };
    return this.ctx.model.User.findOne(query).exec();
  }

  /**
   * 根据用户ID，查找用户
   *
   * @param {String} id 用户ID
   * @return {Promise[user]} 承载用户的 Promise 对象
   */
  async getUserById(id) {
    if (!id) {
      return null;
    }

    return this.ctx.model.User.findOne({ _id: id }).exec();
  }

  /**
   * 根据关键字，获取一组用户
   *
   * @param {String} query 关键字
   * @param {Object} opt 选项
   * @return {Promise[users]} 承载用户列表的 Promise 对象
   */
  getUsersByQuery(query, opt) {
    return this.ctx.model.User.find(query, '', opt).exec();
  }

  /**
   * 新增用户
   *
   * @param {*} loginname 用户名
   * @param {*} pass 密码
   * @param {*} email 邮件
   * @return {Promise[user]} 用户对象
   * @memberof  UserService
   */
  newAndSave(loginname, pass, email) {
    const user = new this.ctx.model.User();
    user.loginname = loginname;
    user.pass = pass;
    user.email = email;

    return user.save();
  }
}

module.exports = UserService;
