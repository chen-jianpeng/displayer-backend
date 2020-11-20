/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  config.name = '电子班牌信息发布系统';

  config.host = 'http://10.88.190.203';

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1602572274954_7520';

  // token过期时间
  config.token_expire = 24 * 60 * 60;

  // add your middleware config here
  config.middleware = [ 'errorHandler' ];

  config.redis = {
    client: {
      port: 6379,
      host: '10.88.190.203',
      password: '',
      db: 0,
    },
  };

  config.mongoose = {
    client: {
      url: 'mongodb://10.88.190.203/displayer-backend',
      options: { useUnifiedTopology: true },
    },
  };

  // 邮箱配置
  config.mail_opts = {
    host: 'smtp.163.com',
    secure: true,
    port: 465,
    auth: {
      user: 'chenjpok@163.com',
      pass: 'Chen54861964',
    },
    ignoreTLS: true,
  };

  config.security = {
    csrf: {
      ignore: '/api/*/*',
    },
    domainWhiteList: [ 'http://192.168.124.17:8080' ],
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
