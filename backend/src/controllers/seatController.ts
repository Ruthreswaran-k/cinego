import { Request, Response, NextFunction } from 'express';
import { seatService } from '../services/seatService.js';

export class SeatController {
  async getAvailableSeats(req: Request, res: Response, next: NextFunction) {
    try {
      const seats = await seatService.getAvailableSeats(req.params.showId);
      res.status(200).json({ success: true, data: seats });
    } catch (error) {
      next(error);
    }
  }

  async lockSeat(req: Request, res: Response, next: NextFunction) {
    try {
      const { showId, seatId } = req.body;
      const customerId = req.user!.id;
      await seatService.lockSeat(showId, seatId, customerId);
      res.status(200).json({ success: true, message: 'Seat locked successfully' });
    } catch (error) {
      next(error);
    }
  }

  async unlockSeat(req: Request, res: Response, next: NextFunction) {
    try {
      // In a real system, you'd specify which seat to unlock or rely on the cron/expired mechanism
      // This is a stub for explicit unlock
      res.status(200).json({ success: true, message: 'Seat unlocked' });
    } catch (error) {
      next(error);
    }
  }
}

export const seatController = new SeatController();
