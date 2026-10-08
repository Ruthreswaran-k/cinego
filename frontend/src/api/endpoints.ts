import { apiClient } from './client';

export const authApi = {
  login: (data: { email: string; password: string }) => apiClient.post('/auth/login', data),
  register: (data: { name: string; email: string; mobile: string; password: string }) => apiClient.post('/auth/register', data),
  sendOtp: (mobile: string) => apiClient.post('/auth/send-otp', { mobile }),
  verifyOtp: (mobile: string, otp: string) => apiClient.post('/auth/verify-otp', { mobile, otp }),
  sendEmailOtp: (email: string, name?: string) => apiClient.post('/auth/send-email-otp', { email, name }),
  verifyEmailOtp: (email: string, otp: string) => apiClient.post('/auth/verify-email-otp', { email, otp }),
  sendTicketEmail: (data: any) => apiClient.post('/auth/send-ticket-email', data),
  getMe: () => apiClient.get('/auth/me'),
};

export const moviesApi = {
  getAll: () => apiClient.get('/movies'),
  getById: (id: string) => apiClient.get(`/movies/${id}`),
};

export const theatresApi = {
  getNearby: (lat: number, lng: number) => apiClient.get('/theatres/nearby', { params: { lat, lng } }),
  getShows: (theatreId: string, movieId: string, date: string) => apiClient.get(`/theatres/${theatreId}/shows`, { params: { movieId, date } }),
};

export const seatsApi = {
  getShowSeats: (showId: string) => apiClient.get(`/shows/${showId}/seats`),
  lockSeats: (showId: string, seatIds: string[]) => apiClient.post(`/shows/${showId}/seats/lock`, { seatIds }),
};
