import { Controller } from 'egg';
import Mongo from '../../utils/mongo';
import config from '../../config/db';

export default class ProjectController extends Controller {
  // 获取项目/组件的代码模板
  public async getTemplate() {
    const { ctx } = this;
    try {
      const mongoDb = new Mongo(config.mongodbUrl, config.mongodbDbName);
      const result = await mongoDb.query(config.templateDocName);
      ctx.body = result;
    } catch (e: any) {
      ctx.body = e.toString();
    }
  }
}
