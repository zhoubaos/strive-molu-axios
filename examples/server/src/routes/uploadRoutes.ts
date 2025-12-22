import { Router } from 'express';
import * as uploadController from '../controllers/uploadController';

const routes: Router = Router();
routes.post('/create', uploadController.createUpload);
routes.get('/chunk', uploadController.setChunk);

export default routes;
