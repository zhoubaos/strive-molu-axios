import { Router } from 'express';
import * as userController from '../controllers/uploadController';

const routes: Router = Router();
routes.get('/', userController.getTest);
routes.post('/create', userController.createUpload);

export default routes;
