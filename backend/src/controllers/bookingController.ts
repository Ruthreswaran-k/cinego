import { Request, Response, NextFunction } from 'express';
import { bookingService } from '../services/bookingService.js';

export class BookingController {
  async createBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const { showId, seatIds } = req.body;
      const customerId = req.user!.id;
      const bookingId = await bookingService.createBooking(customerId, showId, seatIds);
      res.status(201).json({ success: true, data: { bookingId } });
    } catch (error) {
      next(error);
    }
  }

  async getBookingHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const customerId = req.params.customerId;
      // Ensure user is fetching their own history unless admin
      if (req.user!.id !== customerId && req.user!.role !== 'ADMIN') {
        res.status(403).json({ success: false, message: 'Forbidden' });
        return;
      }
      const bookings = await bookingService.getBookingHistory(customerId);
      res.status(200).json({ success: true, data: bookings });
    } catch (error) {
      next(error);
    }
  }

  async getBookingById(req: Request, res: Response, next: NextFunction) {
    try {
      const booking = await bookingService.getBookingById(req.params.id);
      res.status(200).json({ success: true, data: booking });
    } catch (error) {
      next(error);
    }
  }

  async cancelBooking(req: Request, res: Response, next: NextFunction) {
    try {
      await bookingService.cancelBooking(req.params.id);
      res.status(200).json({ success: true, message: 'Booking cancelled' });
    } catch (error) {
      next(error);
    }
  }
}

export const bookingController = new BookingController();
