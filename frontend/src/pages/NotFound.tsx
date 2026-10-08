import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';

export const NotFound = () => (
  <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
    <h1 className="text-9xl font-display font-bold text-primary mb-4 animate-pulse-glow">404</h1>
    <h2 className="text-3xl font-bold text-white mb-6">Page Not Found</h2>
    <p className="text-zinc-400 mb-8 max-w-md">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
    <Link to="/"><Button size="lg">Return to Home</Button></Link>
  </div>
);
