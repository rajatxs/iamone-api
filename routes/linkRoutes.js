import { Router } from 'express';
import { LinkController } from '../controllers/LinkController.js';
import { UserAuthorization } from '../middlewares/auth.js';
import { RequestBodyValidator } from '../middlewares/validator.js';
import { createSchema, updateSchema } from '../schema/link.body.js';

const router = Router();
const linkController = new LinkController();

router.get(
   '/',
   UserAuthorization,
   linkController.getAllLinks.bind(linkController)
);

router.get(
   '/:id',
   UserAuthorization,
   linkController.getLink.bind(linkController)
);

router.post(
   '/',
   UserAuthorization,
   RequestBodyValidator(createSchema),
   linkController.addNewLink.bind(linkController)
);

router.put(
   '/:id',
   UserAuthorization,
   RequestBodyValidator(updateSchema),
   linkController.updateLink.bind(linkController)
);

router.delete(
   '/:id',
   UserAuthorization,
   linkController.removeLink.bind(linkController)
);

export default router;
