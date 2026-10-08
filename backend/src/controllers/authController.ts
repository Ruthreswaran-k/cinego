import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService.js';
import { smsService } from '../services/smsService.js';
import { emailService } from '../services/emailService.js';
import { MESSAGES } from '../utils/constants.js';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, mobile, password } = req.body;
      const data = await authService.registerCustomer(name, email, mobile, password);
      res.status(201).json({ success: true, message: MESSAGES.CREATED, data });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, mobile, identifier, password } = req.body;
      const targetId = identifier || email || mobile;
      if (!targetId) {
        return res.status(400).json({ success: false, message: 'Please provide email or mobile number' });
      }
      const data = await authService.loginCustomer(targetId, password);
      res.status(200).json({ success: true, message: MESSAGES.SUCCESS, data });
    } catch (error) {
      next(error);
    }
  }

  async sendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { mobile } = req.body;
      const result = await smsService.generateAndSendOtp(mobile);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || 'Failed to dispatch OTP' });
    }
  }

  async verifyOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { mobile, otp } = req.body;
      const verification = smsService.verifyOtp(mobile, otp);
      if (!verification.valid) {
        return res.status(400).json({ success: false, message: verification.message });
      }

      const user = {
        id: '1003',
        name: 'Ravi Kumar',
        email: 'ravi@gmail.com',
        mobile: mobile.replace(/[^0-9]/g, '').slice(-10),
        role: 'CUSTOMER',
      };

      res.status(200).json({
        success: true,
        message: 'OTP verified successfully',
        data: {
          user,
          token: 'token_customer_session_' + user.id,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async sendEmailOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, name } = req.body;
      const result = await emailService.generateAndSendEmailOtp(email, name);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || 'Failed to dispatch Gmail OTP' });
    }
  }

  async verifyEmailOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otp } = req.body;
      const verification = emailService.verifyEmailOtp(email, otp);
      if (!verification.valid) {
        return res.status(400).json({ success: false, message: verification.message });
      }

      const cleanEmail = email.trim().toLowerCase();
      const namePart = cleanEmail.split('@')[0];
      const displayName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

      const user = {
        id: '1004',
        name: displayName,
        email: cleanEmail,
        mobile: '9876543210',
        role: 'CUSTOMER',
      };

      res.status(200).json({
        success: true,
        message: 'Email OTP verified successfully',
        data: {
          user,
          token: 'token_customer_session_' + user.id,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async sendTicketEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body;
      const result = await emailService.sendTicketConfirmationEmail(payload);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || 'Failed to send ticket email' });
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.getMe(req.user!.id);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    // Usually handled client-side by deleting token. 
    // If blacklisting is needed, implement here.
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  }
}

export const authController = new AuthController();

