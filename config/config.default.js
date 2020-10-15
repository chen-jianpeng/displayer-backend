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

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1602572274954_7520';

  // add your middleware config here
  config.middleware = [ ];

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

  config.security = {
    csrf: {
      ignore: '/api/*/*',
    },
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
