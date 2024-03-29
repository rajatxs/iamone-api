import { Router } from 'express';
import { UtilityController } from '../controllers/utility.controller.js';

const router = Router();
const utilityController = new UtilityController();

router.get(
   '/image-kit/auth',
   utilityController.getImageKitAuthenticationSignature.bind(utilityController)
);

export default router;
