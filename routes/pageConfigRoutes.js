import { Router } from 'express';
import { PageConfigController } from '../controllers/PageConfigController.js';
import { UserAuthorization } from '../middlewares/auth.js';
import { RequestBodyValidator } from '../middlewares/validator.js';
import { updateSchema } from '../schema/pageConfig.body.js';

const router = Router();
const pageConfigController = new PageConfigController();

router.get(
   '/',
   UserAuthorization,
   pageConfigController.getPageConfig.bind(pageConfigController)
);

router.put(
   '/',
   UserAuthorization,
   RequestBodyValidator(updateSchema),
   pageConfigController.updatePageConfig.bind(pageConfigController)
);

export default router;
