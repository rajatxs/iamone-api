import { Router } from 'express';
import { UtilityController } from '../controllers/UtilityController.js';
import { UserAuthorization } from '../middlewares/auth.js';

const router = Router();
const utilityController = new UtilityController();

router.get(
   '/image-kit/auth',
   UserAuthorization,
   utilityController.getImageKitAuthenticationSignature.bind(utilityController)
);

export default router;
