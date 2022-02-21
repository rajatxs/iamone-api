import { Router } from 'express';
import { PageOutputController } from '../controllers/PageOutputController.js';

const router = Router();
const pageOutputController = new PageOutputController();

router.get(
   '/:username',
   pageOutputController.renderPageByUsername.bind(pageOutputController)
);

export default router;
