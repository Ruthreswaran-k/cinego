import { Request, Response, NextFunction } from 'express';
import { locationService } from '../services/locationService.js';

export class LocationController {
  async getAllLocations(req: Request, res: Response, next: NextFunction) {
    try {
      const locations = await locationService.getAllLocations();
      res.status(200).json({ success: true, data: locations });
    } catch (error) {
      next(error);
    }
  }

  async getNearbyLocations(req: Request, res: Response, next: NextFunction) {
    try {
      const { city } = req.query;
      const locations = await locationService.getNearbyLocations(city as string);
      res.status(200).json({ success: true, data: locations });
    } catch (error) {
      next(error);
    }
  }
}

export const locationController = new LocationController();
