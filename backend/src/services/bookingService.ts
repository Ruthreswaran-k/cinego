import { bookingRepository } from '../repositories/bookingRepository.js';
import { Booking } from '../types/index.js';
import { CONSTANTS } from '../utils/constants.js';

export class BookingService {
  async createBooking(customerId: string, showId: string, seatIds: string[]): Promise<string> {
    // In a real scenario, we would calculate price based on seat prices from DB
    // For now, let's assume a fixed calculation or that the procedure does it.
    // We pass 0 and let procedure calculate it, or calculate here if needed.
    const totalAmount = seatIds.length * 150 + CONSTANTS.CONVENIENCE_FEE_PER_SEAT * seatIds.length;
    return bookingRepository.createBooking(customerId, showId, seatIds, totalAmount);
  }

  async getBookingHistory(customerId: string): Promise<Booking[]> {
    return bookingRepository.getBookingHistory(customerId);
  }

  async getBookingById(id: string): Promise<Booking | null> {
    return bookingRepository.getBookingById(id);
  }

  async cancelBooking(id: string): Promise<void> {
    await bookingRepository.cancelBooking(id);
  }
}

export const bookingService = new BookingService();
