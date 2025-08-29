import { Router } from 'express';
import * as userController from '../controllers/uploadController';

const routes: Router = Router();
routes.get('/', userController.getTest);

export default routes;
