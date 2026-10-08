import { Router } from 'express';
import { authController } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { z } from 'zod';

const router = Router();

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    mobile: z.string().min(10),
    password: z.string().min(6)
  })
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().optional(),
    mobile: z.string().optional(),
    identifier: z.string().optional(),
    password: z.string().min(1)
  })
});

const sendOtpSchema = z.object({
  body: z.object({
    mobile: z.string().min(10)
  })
});

const verifyOtpSchema = z.object({
  body: z.object({
    mobile: z.string().min(10),
    otp: z.string().min(4)
  })
});

const sendEmailOtpSchema = z.object({
  body: z.object({
    email: z.string().email(),
    name: z.string().optional()
  })
});

const verifyEmailOtpSchema = z.object({
  body: z.object({
    email: z.string().email(),
    otp: z.string().min(4)
  })
});

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/send-otp', validate(sendOtpSchema), authController.sendOtp);
router.post('/verify-otp', validate(verifyOtpSchema), authController.verifyOtp);
router.post('/verify', validate(verifyOtpSchema), authController.verifyOtp);
router.post('/send-email-otp', validate(sendEmailOtpSchema), authController.sendEmailOtp);
router.post('/verify-email-otp', validate(verifyEmailOtpSchema), authController.verifyEmailOtp);
router.post('/send-ticket-email', authController.sendTicketEmail);
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getMe);

export default router;
