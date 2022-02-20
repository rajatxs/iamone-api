import { Router } from 'express';
import { SocialPlatformController } from '../controllers/SocialPlatformController.js';

const router = Router();
const socialPlatformController = new SocialPlatformController();

router.get('/', socialPlatformController.getAllSocialPlatforms.bind(socialPlatformController));
router.get('/:key', socialPlatformController.getServicePlatformByKey.bind(socialPlatformController));

export default router;
