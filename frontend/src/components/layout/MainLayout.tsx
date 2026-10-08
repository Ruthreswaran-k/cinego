import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { CinematicBackground } from '../common/CinematicBackground';

export const MainLayout: React.FC = () => (
  <div className="flex flex-col min-h-screen relative text-white selection:bg-primary selection:text-white">
    {/* Classy 3D Animated Cinematic Background */}
    <CinematicBackground variant="cinema" />

    <Header />
    <main className="flex-1 relative z-10">
      <Outlet />
    </main>
    <Footer />
  </div>
);
