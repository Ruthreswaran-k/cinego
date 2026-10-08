import { Router } from 'express';
import { bookingController } from '../controllers/bookingController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { z } from 'zod';

const router = Router();

const bookingSchema = z.object({
  body: z.object({
    showId: z.string(),
    seatIds: z.array(z.string()).min(1)
  })
});

router.post('/', authenticate, validate(bookingSchema), bookingController.createBooking);
router.get('/history/:customerId', authenticate, bookingController.getBookingHistory);
router.get('/:id', authenticate, bookingController.getBookingById);
router.post('/:id/cancel', authenticate, bookingController.cancelBooking);

export default router;
