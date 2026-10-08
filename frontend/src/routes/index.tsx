import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';

// Customer Pages
import { Home } from '@/pages/Home';
import { Movies } from '@/pages/Movies';
import { MovieDetails } from '@/pages/MovieDetails';
import { Theatres } from '@/pages/Theatres';
import { TheatreDetails } from '@/pages/TheatreDetails';
import { ShowSelection } from '@/pages/ShowSelection';
import { SeatSelection } from '@/pages/SeatSelection';
import { FoodSelection } from '@/pages/FoodSelection';
import { Offers } from '@/pages/Offers';
import { Experiences } from '@/pages/Experiences';
import { BookingSummary } from '@/pages/BookingSummary';
import { Payment } from '@/pages/Payment';
import { ETicket } from '@/pages/ETicket';
import { Profile } from '@/pages/Profile';
import { BookingHistory } from '@/pages/BookingHistory';
import { Favorites } from '@/pages/Favorites';
import { Notifications } from '@/pages/Notifications';
import { Search } from '@/pages/Search';
import { DatabaseArchitecture } from '@/pages/DatabaseArchitecture';
import { DBMSDemo } from '@/pages/DBMSDemo';
import { ManagerDashboard } from '@/pages/manager/ManagerDashboard';
import { MobilePaySimulate } from '@/pages/MobilePaySimulate';
import { ContactSupport } from '@/pages/ContactSupport';
import { NotFound } from '@/pages/NotFound';

// Admin Pages
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminMovies } from '@/pages/admin/AdminMovies';
import { AdminShows } from '@/pages/admin/AdminShows';
import { AdminBookings } from '@/pages/admin/AdminBookings';
import { AdminReports } from '@/pages/admin/AdminReports';
import { AdminCoupons } from '@/pages/admin/AdminCoupons';
import { AdminScreens } from '@/pages/admin/AdminScreens';
import { AdminTheatres } from '@/pages/admin/AdminTheatres';
import { AdminUsers } from '@/pages/admin/AdminUsers';
import { AdminPricing } from '@/pages/admin/AdminPricing';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Customer & General Routes with Header/Footer */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/theatres" element={<Theatres />} />
        <Route path="/theatres/:id" element={<TheatreDetails />} />
        <Route path="/shows" element={<ShowSelection />} />
        <Route path="/seats/:showId" element={<SeatSelection />} />
        <Route path="/food" element={<FoodSelection />} />
        <Route path="/food/:bookingId" element={<FoodSelection />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/experiences" element={<Experiences />} />
        <Route path="/booking/summary/:bookingId" element={<BookingSummary />} />
        <Route path="/payment/:bookingId" element={<Payment />} />
        <Route path="/ticket/:bookingId" element={<ETicket />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/bookings" element={<BookingHistory />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/search" element={<Search />} />
        <Route path="/db-architecture" element={<DatabaseArchitecture />} />
        <Route path="/dbms-demo" element={<DBMSDemo />} />
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/contact" element={<ContactSupport />} />
        <Route path="/support" element={<ContactSupport />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Standalone Mobile UPI Simulation Route */}
      <Route path="/pay-simulate/:bookingId" element={<MobilePaySimulate />} />

      {/* Admin Dashboard Routes with Admin Sidebar Layout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="movies" element={<AdminMovies />} />
        <Route path="shows" element={<AdminShows />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="coupons" element={<AdminCoupons />} />
        <Route path="screens" element={<AdminScreens />} />
        <Route path="theatres" element={<AdminTheatres />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="pricing" element={<AdminPricing />} />
      </Route>
    </Routes>
  );
};
