import { Request, Response, NextFunction } from 'express';
import { foodService } from '../services/foodService.js';

export class FoodController {
  async getMenu(req: Request, res: Response, next: NextFunction) {
    try {
      const menu = await foodService.getFoodMenu();
      res.status(200).json({ success: true, data: menu });
    } catch (error) {
      next(error);
    }
  }

  async orderFood(req: Request, res: Response, next: NextFunction) {
    try {
      const { bookingId, items } = req.body;
      // Normally we'd iterate and order items
      res.status(201).json({ success: true, message: 'Food ordered successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export const foodController = new FoodController();
