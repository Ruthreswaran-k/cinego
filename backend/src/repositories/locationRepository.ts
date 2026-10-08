import { executeQuery } from '../config/database.js';
import { Location } from '../types/index.js';

const DEMO_LOCATIONS: Location[] = [
  { id: '1', city: 'Chennai', state: 'Tamil Nadu', isPopular: true },
  { id: '2', city: 'Pondicherry', state: 'Puducherry', isPopular: true },
  { id: '3', city: 'Bengaluru', state: 'Karnataka', isPopular: true },
  { id: '4', city: 'Hyderabad', state: 'Telangana', isPopular: true },
  { id: '5', city: 'Mumbai', state: 'Maharashtra', isPopular: true },
  { id: '6', city: 'Karaikal', state: 'Puducherry', isPopular: true },
  { id: '7', city: 'Nagapattinam', state: 'Tamil Nadu', isPopular: true },
];

export class LocationRepository {
  async getAllLocations(): Promise<Location[]> {
    try {
      const sql = `
        SELECT LOCATION_ID AS "id", CITY AS "city", STATE AS "state", 
               CASE WHEN CITY IN ('Chennai', 'Bengaluru', 'Mumbai', 'Hyderabad') THEN 1 ELSE 0 END AS "isPopular"
        FROM LOCATIONS 
        WHERE IS_ACTIVE = 1 
        ORDER BY CITY ASC
      `;
      const result = await executeQuery(sql);
      if (result.rows && result.rows.length > 0) {
        return result.rows.map((r: any) => ({
          ...r,
          id: String(r.id),
          isPopular: Boolean(r.isPopular)
        }));
      }
      return DEMO_LOCATIONS;
    } catch (err: any) {
      console.warn('⚠️ [Oracle Query Fallback] Locations fallback used:', err.message);
      return DEMO_LOCATIONS;
    }
  }

  async getLocationById(id: string): Promise<Location | null> {
    try {
      const sql = `
        SELECT LOCATION_ID AS "id", CITY AS "city", STATE AS "state", 1 AS "isPopular"
        FROM LOCATIONS 
        WHERE LOCATION_ID = :id
      `;
      const result = await executeQuery(sql, { id: Number(id) });
      if (result.rows && result.rows.length > 0) {
        const r: any = result.rows[0];
        return { ...r, id: String(r.id), isPopular: Boolean(r.isPopular) };
      }
      return DEMO_LOCATIONS.find(l => l.id === id) || null;
    } catch {
      return DEMO_LOCATIONS.find(l => l.id === id) || null;
    }
  }
  
  async getNearbyLocations(city: string): Promise<Location[]> {
    return this.getAllLocations();
  }
}

export const locationRepository = new LocationRepository();
