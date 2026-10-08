import { foodRepository } from '../repositories/foodRepository.js';
import { Food, FoodOrder } from '../types/index.js';

export class FoodService {
  async getFoodMenu(): Promise<Food[]> {
    return foodRepository.getFoodMenu();
  }

  async orderFood(bookingId: string, foodId: string, quantity: number, price: number): Promise<string> {
    return foodRepository.orderFood(bookingId, foodId, quantity, price);
  }

  async getFoodOrdersByBooking(bookingId: string): Promise<FoodOrder[]> {
    return foodRepository.getFoodOrdersByBooking(bookingId);
  }
}

export const foodService = new FoodService();
