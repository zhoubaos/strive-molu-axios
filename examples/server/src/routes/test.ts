import { Router } from 'express';
import * as userController from '../controllers/uploadController';

const routes: Router = Router();
routes.use('/', (req, res) => {
  const result = [
    {
      name: '张三',
      age: 18
    }
  ];
  setTimeout(() => {
    res.json(result);
  }, 2000);
});

export default routes;
