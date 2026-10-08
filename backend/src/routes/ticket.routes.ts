import { Router } from 'express';
import { ticketController } from '../controllers/ticketController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/:bookingId', authenticate, ticketController.getTicket);

export default router;
