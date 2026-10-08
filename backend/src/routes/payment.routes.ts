import { Router } from 'express';
import { paymentController } from '../controllers/paymentController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { z } from 'zod';

const router = Router();

const paymentSchema = z.object({
  body: z.object({
    bookingId: z.string(),
    amount: z.number().positive(),
    method: z.string(),
    transactionId: z.string()
  })
});

import os from 'os';

// In-memory store for real-time mobile payment authorization decisions
const mobileApprovals = new Map<string, { status: 'APPROVED' | 'DECLINED' | 'PENDING'; timestamp: number }>();

// GET /api/payments/network-info
router.get('/network-info', (req, res) => {
  const interfaces = os.networkInterfaces();
  let localIp = '127.0.0.1';
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        localIp = iface.address;
        break;
      }
    }
    if (localIp !== '127.0.0.1') break;
  }
  res.json({ ip: localIp });
});

// POST /api/payments/mobile-approval/:bookingId (called by mobile phone)
router.post('/mobile-approval/:bookingId', (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body;
  mobileApprovals.set(bookingId, { status, timestamp: Date.now() });
  console.log(`[MOBILE PAYMENT SYNC] Booking #${bookingId} status updated to: ${status}`);
  res.json({ success: true, bookingId, status });
});

// GET /api/payments/mobile-approval/:bookingId (polled by desktop)
router.get('/mobile-approval/:bookingId', (req, res) => {
  const { bookingId } = req.params;
  const data = mobileApprovals.get(bookingId);
  if (!data) {
    return res.json({ status: 'PENDING' });
  }
  res.json(data);
});

router.post('/', authenticate, validate(paymentSchema), paymentController.processPayment);

export default router;
