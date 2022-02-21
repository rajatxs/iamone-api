import { Router } from 'express';
import userRoutes from './userRoutes.js';
import socialPlatformRoutes from './socialPlatformRoutes.js';
import socialLinkRoutes from './socialLinkRoutes.js';
import linkRoutes from './linkRoutes.js';
import pageConfigRoutes from './pageConfigRoutes.js';
import pageRoutes from './pageRoutes.js';
import pageOutputRoutes from './pageOutputRoutes.js';

const router = Router();

router.use('/x/api/user', userRoutes);
router.use('/x/api/social-platforms', socialPlatformRoutes);
router.use('/x/api/social-links', socialLinkRoutes);
router.use('/x/api/links', linkRoutes);
router.use('/x/api/page-config', pageConfigRoutes);
router.use('/x/api/page', pageRoutes);

/**
 * Tesing endpoint
 * @route GET /api/ping
 */
router.get("/x/api/ping", (req, res) => {
   res.send({ message: "Pong!" });
});

router.use(pageOutputRoutes);

export default router;
