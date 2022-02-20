import { Router } from 'express';
import userRoutes from './userRoutes.js';
import socialPlatformRoutes from './socialPlatformRoutes.js';
import socialLinkRoutes from './socialLinkRoutes.js';
import linkRoutes from './linkRoutes.js';

const router = Router();

router.use('/x/api/user', userRoutes);
router.use('/x/api/social-platforms', socialPlatformRoutes);
router.use('/x/api/social-links', socialLinkRoutes);
router.use('/x/api/links', linkRoutes);

/**
 * Tesing endpoint
 * @route GET /api/ping
 */
router.get("/api/ping", (req, res) => {
   res.status(200).send({
      message: "Pong!"
   });
});

export default router;
