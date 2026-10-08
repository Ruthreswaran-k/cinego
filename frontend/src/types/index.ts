export interface User { id: string; name: string; phone: string; email?: string; role: 'USER' | 'ADMIN' | 'MANAGER'; avatar?: string; }
export interface Movie { id: string; title: string; description: string; posterUrl: string; backdropUrl: string; duration: number; releaseDate: string; format: string[]; language: string[]; genres: string[]; rating: number; certificate: string; cast: any[]; crew: any[]; status: 'NOW_SHOWING' | 'COMING_SOON'; }
export interface Theatre { id: string; name: string; locationId: string; address: string; screens: Screen[]; }
export interface Screen { id: string; theatreId: string; name: string; capacity: number; format: string[]; }
export interface Location { id: string; city: string; state: string; isPopular: boolean; }
export interface Show { id: string; screenId: string; movieId: string; startTime: string; endTime: string; date: string; basePrice: number; }
export enum SeatStatus { AVAILABLE = 'AVAILABLE', SELECTED = 'SELECTED', BOOKED = 'BOOKED', LOCKED = 'LOCKED' }
export interface Seat { id: string; screenId: string; row: string; number: number; type: 'REGULAR' | 'PREMIUM' | 'RECLINER'; status?: SeatStatus; price?: number; }
export interface Booking { id: string; userId: string; showId: string; seats: string[]; totalAmount: number; status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'; createdAt: string; }
