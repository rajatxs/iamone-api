import { Router } from 'express';

const router = Router();

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
