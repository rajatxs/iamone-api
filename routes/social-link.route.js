import { Router } from 'express';
import { SocialLinkController } from '../controllers/social-link.controller.js';
import { UserAuthorization } from '../middlewares/auth.js';
import { RequestBodyValidator } from '../middlewares/validator.js';
import { createSchema, updateSchema } from '../schema/social-link.body.js';

const router = Router();
const socialLinkController = new SocialLinkController();

router.get(
   '/',
   UserAuthorization,
   socialLinkController.getAllSocialLinks.bind(socialLinkController)
);

router.get(
   '/:id',
   UserAuthorization,
   socialLinkController.getSocialLink.bind(socialLinkController)
);

router.post(
   '/',
   UserAuthorization,
   RequestBodyValidator(createSchema),
   socialLinkController.addNewSocialLink.bind(socialLinkController)
);

router.put(
   '/:id',
   UserAuthorization,
   RequestBodyValidator(updateSchema),
   socialLinkController.updateSocialLink.bind(socialLinkController)
);

router.delete(
   '/:id',
   UserAuthorization,
   socialLinkController.removeSocialLink.bind(socialLinkController)
);

export default router;
