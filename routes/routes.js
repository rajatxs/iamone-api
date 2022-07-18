import express from 'express';
import userRoutes from './user.route.js';
import socialLinkRoutes from './social-link.route.js';
import linkRoutes from './link.route.js';
import pageConfigRoutes from './page-config.route.js';
import utlityRoutes from './utility.route.js';

const router = express.Router();

router.use('/user', userRoutes);
router.use('/social-links', socialLinkRoutes);
router.use('/links', linkRoutes);
router.use('/page-config', pageConfigRoutes);
router.use('/utils', utlityRoutes);

/**
 * Tesing endpoint
 * @route GET /api/ping
 */
router.get("/ping", (req, res) => {
   res.setHeader('Cache-Control', 'public');
   res.send({ message: "Pong!" });
});

export default router;
