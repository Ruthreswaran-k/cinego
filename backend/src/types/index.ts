export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
  THEATRE_MANAGER = 'THEATRE_MANAGER'
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export enum SeatStatus {
  AVAILABLE = 'AVAILABLE',
  LOCKED = 'LOCKED',
  BOOKED = 'BOOKED'
}

export enum TicketStatus {
  VALID = 'VALID',
  USED = 'USED',
  CANCELLED = 'CANCELLED'
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: UserRole;
  createdAt?: Date;
}

export interface Location {
  id: string;
  city: string;
  state: string;
  pincode?: string;
  isPopular?: boolean;
}

export interface Movie {
  id: string;
  title: string;
  description: string;
  language: string;
  genre: string;
  durationMinutes: number;
  releaseDate: Date | string;
  posterUrl?: string;
  trailerUrl?: string;
  format?: string;
  status?: string;
  rating?: number;
}

export interface Theatre {
  id: string;
  name: string;
  locationId: string;
  managerId: string;
  address: string;
}

export interface Screen {
  id: string;
  theatreId: string;
  name: string;
  totalSeats: number;
}

export interface Seat {
  id: string;
  screenId: string;
  rowNumber: string;
  seatNumber: number;
  seatType: string;
}

export interface Show {
  id: string;
  screenId: string;
  movieId: string;
  startTime: Date;
  endTime: Date;
  date: Date;
}

export interface ShowSeat {
  id: string;
  showId: string;
  seatId: string;
  status: SeatStatus;
  price: number;
  lockedUntil?: Date;
}

export interface Booking {
  id: string;
  customerId: string;
  showId: string;
  bookingTime: Date;
  totalAmount: number;
  status: BookingStatus;
}

export interface Ticket {
  id: string;
  bookingId: string;
  qrCode: string;
  status: TicketStatus;
}

export interface Food {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
}

export interface FoodOrder {
  id: string;
  bookingId: string;
  foodId: string;
  quantity: number;
  price: number;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercentage: number;
  maxDiscountAmount: number;
  validUntil: Date;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  paymentMethod: string;
  transactionId: string;
  status: PaymentStatus;
  paymentTime: Date;
}

export interface Refund {
  id: string;
  paymentId: string;
  amount: number;
  reason: string;
  status: string;
  processedAt?: Date;
}

export interface Review {
  id: string;
  movieId: string;
  customerId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
}

export interface Favorite {
  id: string;
  customerId: string;
  movieId: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  customerId: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  createdAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface AuthPayload {
  user: Customer;
  token: string;
}

export interface JwtPayload {
  id: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}
