'use strict';

const Service = require('egg').Service;

class ProjectService extends Service {
  /*
   * 根据关键词，获取项目列表
   * @param {String} query 搜索关键词
   * @param {Object} opt 搜索选项
   */
  async getProjectByQuery(query, opt) {
    query.deleted = false;
    const projects = await this.ctx.model.Project.find(query, {}, opt).exec();

    if (projects.length === 0) {
      return [];
    }

    return projects;

  }

  async newAndSave(title, pages, authorId) {
    console.log('authorId: ', authorId);
    const project = new this.ctx.model.Project();
    project.title = title;
    project.pages = pages || [];
    project.author = authorId;

    return await project.save();
  }
}

module.exports = ProjectService;
