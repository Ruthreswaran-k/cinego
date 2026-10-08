import { seatRepository } from '../repositories/seatRepository.js';
import { ShowSeat } from '../types/index.js';
import { ConflictError } from '../utils/errors.js';

export class SeatService {
  async getAvailableSeats(showId: string): Promise<ShowSeat[]> {
    return seatRepository.getAvailableSeats(showId);
  }

  async lockSeat(showId: string, seatId: string, customerId: string): Promise<void> {
    try {
      await seatRepository.lockSeat(showId, seatId, customerId);
    } catch (error: any) {
      if (error.message && error.message.includes('ORA-')) { // Simplified check for DB error
        throw new ConflictError('Seat is already locked or booked');
      }
      throw error;
    }
  }

  async unlockExpiredSeats(): Promise<void> {
    await seatRepository.unlockExpiredSeats();
  }
}

export const seatService = new SeatService();
