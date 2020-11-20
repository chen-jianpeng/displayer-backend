'use strict';

const Controller = require('egg').Controller;

class ProjectController extends Controller {
  async index(ctx) {
    const query = ctx.query || {};
    const projects = await ctx.service.project.getProjectByQuery(query, ctx.pagination);
    ctx.body = {
      success: true,
      data: projects,
    };
  }

  async create(ctx) {

    // TODO: 此处可以优化，将所有使用 egg_validate 的 rules 集中管理，避免即时新建对象
    ctx.validate({
      title: {
        type: 'string',
        max: 100,
        min: 5,
      },
    });

    const body = ctx.request.body;

    const project = await ctx.service.project.newAndSave(
      body.title,
      body.pages,
      ctx.request.user._id
    );

    ctx.body = {
      success: true,
      project_id: project,
    };
  }
}

module.exports = ProjectController;
