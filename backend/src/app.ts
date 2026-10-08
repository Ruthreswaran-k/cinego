import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';

import { errorHandler } from './middleware/errorHandler.js';
import { env } from './config/env.js';

// Import routes (we'll define these later)
import authRoutes from './routes/auth.routes.js';
import locationRoutes from './routes/location.routes.js';
import movieRoutes from './routes/movie.routes.js';
import theatreRoutes from './routes/theatre.routes.js';
import showRoutes from './routes/show.routes.js';
import seatRoutes from './routes/seat.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import foodRoutes from './routes/food.routes.js';
import couponRoutes from './routes/coupon.routes.js';
import ticketRoutes from './routes/ticket.routes.js';
import refundRoutes from './routes/refund.routes.js';
import reviewRoutes from './routes/review.routes.js';
import favoriteRoutes from './routes/favorite.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import adminRoutes from './routes/admin.routes.js';
import managerRoutes from './routes/manager.routes.js';

const app = express();

const currentDir = typeof __dirname !== 'undefined' ? __dirname : process.cwd();

// Security and utility middlewares
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use(cors({ origin: true, credentials: true }));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});
app.use('/api', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/theatres', theatreRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/seats', seatRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/refunds', refundRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/manager', managerRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Resolve frontend production build directory if present
const possibleDistPaths = [
  path.resolve(currentDir, '../../frontend/dist'),
  path.resolve(currentDir, '../frontend/dist'),
  path.resolve(process.cwd(), 'frontend/dist'),
  path.resolve(process.cwd(), '../frontend/dist'),
];
const frontendDistPath = possibleDistPaths.find((p) => fs.existsSync(p));

if (frontendDistPath) {
  // Serve static assets from Vite build
  app.use(express.static(frontendDistPath));

  // SPA fallback for all client routes (except /api)
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found' });
});

// Generic 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint not found' });
});

// Error handling middleware
app.use(errorHandler);

export default app;
