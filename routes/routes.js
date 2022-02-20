import { Router } from 'express';
import userRoutes from './userRoutes.js';
import socialPlatformRoutes from './socialPlatformRoutes.js';

const router = Router();

router.use('/x/api/user', userRoutes);
router.use('/x/api/social-platforms', socialPlatformRoutes);

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
