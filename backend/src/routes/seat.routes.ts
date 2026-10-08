import { Router } from 'express';
import { seatController } from '../controllers/seatController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { z } from 'zod';

const router = Router();

const lockSchema = z.object({
  body: z.object({
    showId: z.string(),
    seatId: z.string()
  })
});

router.get('/:showId', seatController.getAvailableSeats);
router.post('/lock', authenticate, validate(lockSchema), seatController.lockSeat);
router.post('/unlock', authenticate, seatController.unlockSeat);

export default router;
