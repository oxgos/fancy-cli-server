import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/project/template', controller.project.getTemplate);
};
