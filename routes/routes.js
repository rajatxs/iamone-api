import express from 'express';
import userRoutes from './userRoutes.js';
import socialLinkRoutes from './socialLinkRoutes.js';
import linkRoutes from './linkRoutes.js';
import pageConfigRoutes from './pageConfigRoutes.js';
import utlityRoutes from './utilityRoutes.js';

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
