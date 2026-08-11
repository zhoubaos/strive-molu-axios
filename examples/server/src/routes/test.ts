import { Router } from 'express';
import * as userController from '../controllers/uploadController';
let a = 0;
const routes: Router = Router();
routes.use('/', (req, res) => {
  a++;
  const result = [
    {
      name: '张三',
      age: 18
    }
  ];
  if (a == 2) {
    res.json(result);
  }
});

export default routes;
