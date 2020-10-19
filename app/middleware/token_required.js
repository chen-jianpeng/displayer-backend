'use strict';

module.exports = () => {
  return async function(ctx, next) {
    let token = '';
    const { app } = ctx;

    if (
      ctx.headers.authorization && ctx.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
      token = ctx.headers.authorization.split(' ')[1];
    } else if (ctx.query.accesstoken) {
      token = ctx.query.accesstoken;
    } else if (ctx.request.body.accesstoken) {
      token = ctx.request.body.accesstoken;
    }

    const user = await app.redis.get(token);

    if (user) {
      // 更新token过期时间，自动续期
      app.redis.setex(token, app.config.token_expire, user);
    } else {
      ctx.status = 401;
      ctx.body = {
        success: false,
        error_msg: '错误的 accessToken',
      };
      return;
    }

    ctx.request.user = user;

    await next();
  };
};
