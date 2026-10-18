$base = "c:\Users\RUTHRA\Documents\projectWE\CineGo\frontend"
if (!(Test-Path $base)) { New-Item -Path $base -ItemType Directory -Force | Out-Null }
function wf($p, $c) {
    $fp = Join-Path $base $p
    $d = Split-Path $fp -Parent
    if (!(Test-Path $d)) { New-Item -Path $d -ItemType Directory -Force | Out-Null }
    [IO.File]::WriteAllText($fp, $c.Trim() + "`n")
}

wf "package.json" @'
{
  "name": "cinego-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "axios": "^1.6.2",
    "clsx": "^2.1.0",
    "date-fns": "^3.3.1",
    "framer-motion": "^11.0.3",
    "lucide-react": "^0.323.0",
    "qrcode.react": "^3.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hot-toast": "^2.4.1",
    "react-router-dom": "^6.22.0",
    "tailwind-merge": "^2.2.1"
  },
  "devDependencies": {
    "@tailwindcss/forms": "^0.5.7",
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.2.2",
    "vite": "^5.1.0"
  }
}
'@

wf "index.html" @'
<!DOCTYPE html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#0A0A0A" />
    <title>CineGo | Your Movies. Your Seats. Your Experience.</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700;800&display=swap" rel="stylesheet">
  </head>
  <body class="bg-dark text-white font-sans antialiased selection:bg-primary/30 min-h-screen">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
'@

wf "vite.config.ts" @'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
'@

wf "tsconfig.json" @'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
'@

wf "tsconfig.node.json" @'
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
'@

wf "tailwind.config.ts" @'
import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E50914',
        secondary: '#F5C518',
        dark: {
          DEFAULT: '#0A0A0A',
          100: '#141414',
          200: '#1A1A2E',
          300: '#16213E'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 15px rgba(229,9,20,0.5)' },
          '50%': { opacity: '.5', boxShadow: '0 0 5px rgba(229,9,20,0.2)' },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} satisfies Config
'@

wf "postcss.config.js" @'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
'@

wf "src/index.css" @'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    background: #0A0A0A; 
  }
  ::-webkit-scrollbar-thumb {
    background: #333; 
    border-radius: 3px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #E50914; 
  }
}

@layer components {
  .glass-card {
    @apply bg-zinc-900/40 backdrop-blur-md border border-white/5 shadow-xl;
  }
  .gradient-text {
    @apply bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400;
  }
  .seat-available {
    @apply border-2 border-green-500 bg-transparent hover:bg-green-500/20 cursor-pointer;
  }
  .seat-selected {
    @apply bg-blue-500 border-2 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] cursor-pointer text-white;
  }
  .seat-booked {
    @apply bg-zinc-800 border-2 border-zinc-700 cursor-not-allowed opacity-50;
  }
  .seat-locked {
    @apply bg-orange-500 border-2 border-orange-500 cursor-not-allowed opacity-75;
  }
  .cinema-screen {
    @apply w-full h-8 border-t-[4px] border-primary/80 rounded-[50%] shadow-[0_-15px_30px_rgba(229,9,20,0.2)];
  }
}
'@

wf "src/types/index.ts" @'
export interface User { id: string; name: string; phone: string; email?: string; role: 'USER' | 'ADMIN' | 'MANAGER'; }
export interface Movie { id: string; title: string; description: string; posterUrl: string; backdropUrl: string; duration: number; releaseDate: string; format: string[]; language: string[]; genres: string[]; rating: number; certificate: string; cast: any[]; crew: any[]; status: 'NOW_SHOWING' | 'COMING_SOON'; }
export interface Theatre { id: string; name: string; locationId: string; address: string; screens: Screen[]; }
export interface Screen { id: string; theatreId: string; name: string; capacity: number; format: string[]; }
export interface Location { id: string; city: string; state: string; isPopular: boolean; }
export interface Show { id: string; screenId: string; movieId: string; startTime: string; endTime: string; date: string; basePrice: number; }
export enum SeatStatus { AVAILABLE = 'AVAILABLE', SELECTED = 'SELECTED', BOOKED = 'BOOKED', LOCKED = 'LOCKED' }
export interface Seat { id: string; screenId: string; row: string; number: number; type: 'REGULAR' | 'PREMIUM' | 'RECLINER'; status?: SeatStatus; price?: number; }
export interface Booking { id: string; userId: string; showId: string; seats: string[]; totalAmount: number; status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'; createdAt: string; }
'@

wf "src/api/client.ts" @'
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: '/api',
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);
'@

wf "src/api/endpoints.ts" @'
import { apiClient } from './client';

export const authApi = {
  login: (phone: string) => apiClient.post('/auth/login', { phone }),
  verifyOtp: (phone: string, otp: string) => apiClient.post('/auth/verify', { phone, otp }),
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
'@

wf "src/context/AuthContext.tsx" @'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);

    const handleUnauthorized = () => logout();
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const login = (token: string, u: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(u));
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
'@

wf "src/context/LocationContext.tsx" @'
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Location } from '@/types';

interface LocationContextType {
  selectedLocation: Location | null;
  setSelectedLocation: (l: Location) => void;
}

const LocationContext = createContext<LocationContextType>({} as LocationContextType);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  return (
    <LocationContext.Provider value={{ selectedLocation, setSelectedLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
'@

wf "src/utils/cn.ts" @'
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
'@

wf "src/utils/format.ts" @'
export const formatCurrency = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
export const formatTime = (dateStr: string) => new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
export const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
export const formatDuration = (mins: number) => `${Math.floor(mins / 60)}h ${mins % 60}m`;
'@

wf "src/hooks/useDebounce.ts" @'
import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}
'@

wf "src/components/common/Button.tsx" @'
import React from 'react';
import { cn } from '@/utils/cn';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }) => {
  const base = "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-gradient-to-r from-primary to-red-800 text-white hover:shadow-[0_0_15px_rgba(229,9,20,0.4)] border border-transparent",
    secondary: "bg-secondary text-black hover:bg-yellow-500",
    outline: "border border-zinc-700 hover:bg-zinc-800 text-white",
    ghost: "hover:bg-zinc-800/50 text-zinc-300 hover:text-white",
    danger: "bg-red-600/10 text-red-500 hover:bg-red-600/20 border border-red-600/20",
  };
  const sizes = { sm: "h-8 px-3 text-sm", md: "h-10 px-4", lg: "h-12 px-8 text-lg" };

  return (
    <button className={cn(base, variants[variant], sizes[size], className)} disabled={isLoading || props.disabled} {...props}>
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
};
'@

wf "src/components/common/Modal.tsx" @'
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps { isOpen: boolean; onClose: () => void; children: React.ReactNode; title?: string; }

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 glass-card rounded-xl border border-white/10 p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            {title && <h2 className="text-xl font-display font-semibold text-white">{title}</h2>}
            <button onClick={onClose} className="rounded-full p-1 hover:bg-white/10 transition-colors"><X className="h-5 w-5 text-zinc-400" /></button>
          </div>
          {children}
        </motion.div>
      </>
    )}
  </AnimatePresence>
);
'@

wf "src/components/common/Toast.tsx" @'
export const toastConfig = {
  style: { background: '#1A1A2E', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
  success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
  error: { iconTheme: { primary: '#E50914', secondary: '#fff' } },
};
'@

wf "src/components/common/Skeleton.tsx" @'
import React from 'react';
import { cn } from '@/utils/cn';

export const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("animate-pulse rounded-md bg-zinc-800", className)} />
);

export const SkeletonPoster = () => <Skeleton className="aspect-[2/3] w-full rounded-xl" />;
export const SkeletonText = ({ className }: { className?: string }) => <Skeleton className={cn("h-4 w-3/4", className)} />;
'@

wf "src/components/common/EmptyState.tsx" @'
import React from 'react';
import { cn } from '@/utils/cn';

export const EmptyState: React.FC<{ icon: React.ReactNode; title: string; description?: string; action?: React.ReactNode; className?: string }> = ({ icon, title, description, action, className }) => (
  <div className={cn("flex flex-col items-center justify-center p-8 text-center space-y-4", className)}>
    <div className="rounded-full bg-zinc-900 p-4 text-zinc-500">{icon}</div>
    <h3 className="text-xl font-display font-semibold text-white">{title}</h3>
    {description && <p className="text-zinc-400 max-w-sm">{description}</p>}
    {action && <div className="pt-4">{action}</div>}
  </div>
);
'@

wf "src/components/common/Badge.tsx" @'
import React from 'react';
import { cn } from '@/utils/cn';

export const Badge: React.FC<{ children: React.ReactNode; variant?: 'default' | 'success' | 'warning' | 'error'; className?: string }> = ({ children, variant = 'default', className }) => {
  const variants = {
    default: "bg-zinc-800 text-zinc-300 border-zinc-700",
    success: "bg-green-500/10 text-green-400 border-green-500/20",
    warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    error: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border", variants[variant], className)}>
      {children}
    </span>
  );
};
'@

wf "src/components/common/Rating.tsx" @'
import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/utils/cn';

export const Rating: React.FC<{ value: number; className?: string }> = ({ value, className }) => (
  <div className={cn("flex items-center space-x-1", className)}>
    <Star className="w-4 h-4 fill-secondary text-secondary" />
    <span className="text-sm font-semibold text-white">{value.toFixed(1)}</span>
  </div>
);
'@

wf "src/components/common/SearchBar.tsx" @'
import React from 'react';
import { Search } from 'lucide-react';

export const SearchBar = () => (
  <div className="relative w-full max-w-md">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Search className="h-5 w-5 text-zinc-400" />
    </div>
    <input type="text" className="block w-full pl-10 pr-3 py-2 border border-zinc-700 rounded-full leading-5 bg-zinc-900/50 text-zinc-300 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-all" placeholder="Search movies, theatres..." />
  </div>
);
'@

wf "src/components/layout/Header.tsx" @'
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Film, User, MapPin } from 'lucide-react';
import { SearchBar } from '../common/SearchBar';
import { Button } from '../common/Button';
import { useAuth } from '@/context/AuthContext';
import { LoginModal } from '../auth/LoginModal';

export const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full glass-card border-b border-white/10 bg-dark/80 transition-all">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <Film className="h-8 w-8 text-primary group-hover:text-red-500 transition-colors" />
            <span className="font-display font-bold text-2xl tracking-tight text-white group-hover:text-primary transition-colors">Cine<span className="text-primary">Go</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/movies" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">Movies</Link>
            <Link to="/theatres" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">Theatres</Link>
          </div>
        </div>
        <div className="flex-1 hidden md:flex justify-center max-w-md">
          <SearchBar />
        </div>
        <div className="flex items-center gap-4">
          <button className="hidden md:flex items-center gap-1 text-sm text-zinc-400 hover:text-white">
            <MapPin className="h-4 w-4" /> Mumbai
          </button>
          {isAuthenticated ? (
            <Button variant="ghost" onClick={logout} className="gap-2">
              <User className="h-5 w-5" /> Profile
            </Button>
          ) : (
            <Button size="sm" onClick={() => setIsLoginOpen(true)}>Sign In</Button>
          )}
        </div>
      </div>
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </header>
  );
};
'@

wf "src/components/layout/Footer.tsx" @'
import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Github, Twitter, Database } from 'lucide-react';

export const Footer = () => (
  <footer className="border-t border-white/5 bg-zinc-950 mt-20">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-2">
            <Film className="h-6 w-6 text-primary" />
            <span className="font-display font-bold text-xl text-white">CineGo</span>
          </Link>
          <p className="text-sm text-zinc-400">Your Movies. Your Seats. Your Experience. Premium movie ticket booking platform.</p>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li><Link to="/movies" className="hover:text-primary">Movies</Link></li>
            <li><Link to="/theatres" className="hover:text-primary">Theatres</Link></li>
            <li><Link to="/offers" className="hover:text-primary">Offers</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">Engineering</h4>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li><Link to="/db-architecture" className="hover:text-primary flex items-center gap-2"><Database className="w-4 h-4"/> DB Architecture</Link></li>
            <li><Link to="/dbms-demo" className="hover:text-primary">DBMS Demo</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">Connect</h4>
          <div className="flex gap-4">
            <a href="#" className="text-zinc-400 hover:text-white"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="text-zinc-400 hover:text-white"><Github className="w-5 h-5" /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} CineGo. All rights reserved.
      </div>
    </div>
  </footer>
);
'@

wf "src/components/layout/MainLayout.tsx" @'
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export const MainLayout = () => (
  <div className="flex flex-col min-h-screen bg-dark">
    <Header />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);
'@

wf "src/components/movie/MovieCard.tsx" @'
import React from 'react';
import { Link } from 'react-router-dom';
import { Rating } from '../common/Rating';
import { Badge } from '../common/Badge';
import { Movie } from '@/types';

export const MovieCard: React.FC<{ movie: Movie }> = ({ movie }) => (
  <Link to={`/movies/${movie.id}`} className="group relative rounded-xl overflow-hidden glass-card transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 block aspect-[2/3]">
    <img src={movie.posterUrl} alt={movie.title} className="absolute inset-0 w-full h-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
    <div className="absolute inset-x-0 bottom-0 p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
      <div className="flex items-center gap-2 mb-2">
        <Badge variant="success" className="text-[10px]">{movie.certificate}</Badge>
        <Rating value={movie.rating} />
      </div>
      <h3 className="text-lg font-display font-bold text-white line-clamp-1 mb-1">{movie.title}</h3>
      <p className="text-xs text-zinc-300 line-clamp-1">{movie.genres.join(', ')}</p>
      <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-full py-2 bg-primary text-white text-center rounded font-semibold text-sm">Book Tickets</div>
      </div>
    </div>
  </Link>
);
'@

wf "src/components/movie/MovieGrid.tsx" @'
import React from 'react';
import { MovieCard } from './MovieCard';
import { Movie } from '@/types';

export const MovieGrid: React.FC<{ movies: Movie[] }> = ({ movies }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
    {movies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
  </div>
);
'@

wf "src/components/booking/SeatMap.tsx" @'
import React, { useState } from 'react';
import { cn } from '@/utils/cn';

interface Seat { id: string; row: string; number: number; status: 'AVAILABLE' | 'SELECTED' | 'BOOKED' | 'LOCKED'; type: 'REGULAR' | 'PREMIUM'; price: number; }

export const SeatMap: React.FC<{ onSeatSelect: (seats: Seat[]) => void }> = ({ onSeatSelect }) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  
  // Mock data for UI demonstration
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  
  const toggleSeat = (id: string, status: string) => {
    if (status === 'BOOKED' || status === 'LOCKED') return;
    const newSelected = new Set(selected);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelected(newSelected);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-8 glass-card rounded-2xl">
      <div className="flex flex-col items-center mb-16">
        <div className="cinema-screen"></div>
        <span className="text-zinc-500 text-xs mt-4 tracking-[0.3em] font-medium uppercase">All eyes this way</span>
      </div>
      
      <div className="space-y-6 overflow-x-auto pb-8">
        {rows.map(row => (
          <div key={row} className="flex items-center justify-center gap-8 min-w-max">
            <span className="w-6 text-center text-sm font-semibold text-zinc-500">{row}</span>
            <div className="flex gap-2">
              {Array.from({ length: 6 }).map((_, i) => {
                const id = `${row}${i+1}`;
                const isSelected = selected.has(id);
                // Mock random booked seats
                const isBooked = (row === 'D' && i > 2) || (row === 'F' && i === 1);
                const status = isSelected ? 'SELECTED' : isBooked ? 'BOOKED' : 'AVAILABLE';
                return (
                  <button key={id} onClick={() => toggleSeat(id, status)} disabled={isBooked}
                    className={cn(
                      "w-8 h-8 rounded-t-lg rounded-b-sm text-[10px] font-bold transition-all duration-200 flex items-center justify-center",
                      status === 'AVAILABLE' && "seat-available text-transparent hover:text-green-500",
                      status === 'SELECTED' && "seat-selected",
                      status === 'BOOKED' && "seat-booked",
                    )}
                  >{i+1}</button>
                );
              })}
            </div>
            {/* Aisle */}
            <div className="w-8"></div>
            <div className="flex gap-2">
              {Array.from({ length: 6 }).map((_, i) => {
                const id = `${row}${i+7}`;
                const isSelected = selected.has(id);
                const status = isSelected ? 'SELECTED' : 'AVAILABLE';
                return (
                  <button key={id} onClick={() => toggleSeat(id, status)}
                    className={cn(
                      "w-8 h-8 rounded-t-lg rounded-b-sm text-[10px] font-bold transition-all duration-200 flex items-center justify-center",
                      status === 'AVAILABLE' && "seat-available text-transparent hover:text-green-500",
                      status === 'SELECTED' && "seat-selected",
                    )}
                  >{i+7}</button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-8 mt-8 pt-8 border-t border-white/10">
        <div className="flex items-center gap-2"><div className="w-4 h-4 seat-available rounded-t-sm"></div><span className="text-sm text-zinc-400">Available</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 seat-selected rounded-t-sm"></div><span className="text-sm text-zinc-400">Selected</span></div>
        <div className="flex items-center gap-2"><div className="w-4 h-4 seat-booked rounded-t-sm"></div><span className="text-sm text-zinc-400">Booked</span></div>
      </div>
    </div>
  );
};
'@

wf "src/components/auth/LoginModal.tsx" @'
import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Film } from 'lucide-react';

export const LoginModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center mb-8">
        <Film className="h-12 w-12 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-display font-bold text-white">Welcome to CineGo</h2>
        <p className="text-zinc-400 mt-2">Sign in to unlock the best experience</p>
      </div>
      {step === 1 ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Mobile Number</label>
            <div className="flex">
              <span className="inline-flex items-center px-4 rounded-l-md border border-r-0 border-zinc-700 bg-zinc-900 text-zinc-400">+91</span>
              <input type="tel" className="flex-1 block w-full rounded-none rounded-r-md bg-zinc-900/50 border-zinc-700 text-white focus:ring-primary focus:border-primary" placeholder="Enter mobile number" />
            </div>
          </div>
          <Button className="w-full" onClick={() => setStep(2)}>Continue</Button>
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-sm text-zinc-400 text-center">We've sent an OTP to your number</p>
          <div className="flex justify-center gap-2">
            {[1,2,3,4,5,6].map(i => (
              <input key={i} type="text" maxLength={1} className="w-12 h-12 text-center text-xl font-bold rounded-md bg-zinc-900 border-zinc-700 text-white focus:ring-primary focus:border-primary" />
            ))}
          </div>
          <Button className="w-full" onClick={onClose}>Verify & Login</Button>
          <button className="text-primary text-sm font-medium w-full text-center hover:underline" onClick={() => setStep(1)}>Change Number</button>
        </div>
      )}
    </Modal>
  );
};
'@

wf "src/pages/Home.tsx" @'
import React from 'react';
import { Button } from '@/components/common/Button';
import { MovieGrid } from '@/components/movie/MovieGrid';

const MOCK_MOVIES = [
  { id: '1', title: 'Dune: Part Two', genres: ['Sci-Fi', 'Adventure'], rating: 4.8, certificate: 'UA', posterUrl: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2JGqqc9bG.jpg', duration: 166, format: ['IMAX 3D'], status: 'NOW_SHOWING', releaseDate: '', backdropUrl: '', language: [], cast: [], crew: [], description: '' },
  { id: '2', title: 'Oppenheimer', genres: ['Biography', 'Drama'], rating: 4.9, certificate: 'A', posterUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', duration: 180, format: ['IMAX'], status: 'NOW_SHOWING', releaseDate: '', backdropUrl: '', language: [], cast: [], crew: [], description: '' },
];

export const Home = () => (
  <div className="pb-20">
    <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://image.tmdb.org/t/p/original/8rpDcsfLJypbO6vtecsmEZzAUoa.jpg')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-dark/30" />
      <div className="relative z-10 text-center space-y-6 max-w-4xl px-4 animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-display font-bold text-white tracking-tight">
          Your Movies. <br/><span className="gradient-text">Your Experience.</span>
        </h1>
        <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto">Book tickets for the latest blockbusters in premium formats like IMAX and Dolby Atmos.</p>
        <div className="pt-8">
          <Button size="lg" className="px-12 text-lg rounded-full">Explore Movies</Button>
        </div>
      </div>
    </section>
    
    <section className="container mx-auto px-4 mt-12 space-y-12">
      <div>
        <h2 className="text-3xl font-display font-bold text-white mb-8 flex items-center gap-3">
          <span className="w-2 h-8 bg-primary rounded-full"></span> Now Showing
        </h2>
        <MovieGrid movies={MOCK_MOVIES as any} />
      </div>
    </section>
  </div>
);
'@

wf "src/pages/MovieDetails.tsx" @'
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Clock, Calendar, Globe } from 'lucide-react';

export const MovieDetails = () => {
  const { id } = useParams();
  
  return (
    <div>
      <div className="relative h-[60vh] w-full">
        <div className="absolute inset-0 bg-[url('https://image.tmdb.org/t/p/original/1pdfLvkbY9ohJlCjQH2JGqqc9bG.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/80 to-transparent" />
      </div>
      
      <div className="container mx-auto px-4 relative -mt-32 pb-20">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-64 flex-shrink-0 mx-auto md:mx-0">
            <img src="https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2JGqqc9bG.jpg" alt="Poster" className="w-full rounded-xl shadow-2xl shadow-primary/20 border border-white/10" />
          </div>
          <div className="flex-1 space-y-6 text-center md:text-left mt-8 md:mt-0">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white">Dune: Part Two</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <Badge variant="success">UA</Badge>
              <Badge variant="default" className="gap-1"><Clock className="w-3 h-3"/> 2h 46m</Badge>
              <Badge variant="default" className="gap-1"><Globe className="w-3 h-3"/> English, Hindi</Badge>
              <Badge variant="default" className="gap-1"><Calendar className="w-3 h-3"/> Mar 1, 2024</Badge>
            </div>
            <p className="text-zinc-300 text-lg leading-relaxed max-w-3xl">Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.</p>
            <div className="pt-6">
              <Link to={`/shows?movie=${id}`}>
                <Button size="lg" className="w-full md:w-auto px-12 text-lg">Book Tickets</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
'@

wf "src/pages/SeatSelection.tsx" @'
import React from 'react';
import { SeatMap } from '@/components/booking/SeatMap';
import { Button } from '@/components/common/Button';

export const SeatSelection = () => (
  <div className="min-h-screen bg-dark py-12">
    <div className="container mx-auto px-4 flex flex-col lg:flex-row gap-8">
      <div className="flex-1">
        <div className="mb-8">
          <h2 className="text-2xl font-display font-bold text-white mb-2">Dune: Part Two - IMAX</h2>
          <p className="text-zinc-400">PVR ICON: Andheri (W) | Today, 10:30 PM</p>
        </div>
        <SeatMap onSeatSelect={() => {}} />
      </div>
      <div className="w-full lg:w-96">
        <div className="glass-card p-6 rounded-xl sticky top-24">
          <h3 className="text-xl font-bold text-white mb-6">Booking Summary</h3>
          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-zinc-300">
              <span>Selected Seats (2)</span>
              <span className="font-semibold text-white">D4, D5</span>
            </div>
            <div className="flex justify-between text-zinc-300">
              <span>Ticket Price</span>
              <span>₹800</span>
            </div>
            <div className="flex justify-between text-zinc-300">
              <span>Convenience Fee</span>
              <span>₹120</span>
            </div>
            <hr className="border-white/10" />
            <div className="flex justify-between text-xl font-bold text-white">
              <span>Total Amount</span>
              <span className="text-primary">₹920</span>
            </div>
          </div>
          <Button className="w-full" size="lg">Proceed to Pay</Button>
        </div>
      </div>
    </div>
  </div>
);
'@

wf "src/pages/DatabaseArchitecture.tsx" @'
import React from 'react';

export const DatabaseArchitecture = () => (
  <div className="container mx-auto px-4 py-12">
    <h1 className="text-4xl font-display font-bold text-white mb-8">Database Architecture</h1>
    <div className="glass-card p-8 rounded-2xl mb-8">
      <h2 className="text-2xl font-bold text-white mb-4">Relational Schema</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-zinc-300">
        <div>
          <h3 className="text-primary font-bold mb-2">USERS</h3>
          <ul className="list-disc pl-5"><li>user_id (PK)</li><li>phone_number (UNIQUE)</li><li>role</li></ul>
        </div>
        <div>
          <h3 className="text-primary font-bold mb-2">MOVIES</h3>
          <ul className="list-disc pl-5"><li>movie_id (PK)</li><li>title, duration, rating</li></ul>
        </div>
        <div>
          <h3 className="text-primary font-bold mb-2">SHOWS</h3>
          <ul className="list-disc pl-5"><li>show_id (PK)</li><li>movie_id (FK), screen_id (FK)</li><li>start_time, end_time</li></ul>
        </div>
        <div>
          <h3 className="text-primary font-bold mb-2">BOOKINGS</h3>
          <ul className="list-disc pl-5"><li>booking_id (PK)</li><li>user_id (FK), show_id (FK)</li><li>total_amount, status</li></ul>
        </div>
      </div>
    </div>
  </div>
);
'@

wf "src/pages/NotFound.tsx" @'
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
'@

wf "src/routes/index.tsx" @'
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Home } from '@/pages/Home';
import { MovieDetails } from '@/pages/MovieDetails';
import { SeatSelection } from '@/pages/SeatSelection';
import { DatabaseArchitecture } from '@/pages/DatabaseArchitecture';
import { NotFound } from '@/pages/NotFound';

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<MainLayout />}>
      <Route index element={<Home />} />
      <Route path="movies/:id" element={<MovieDetails />} />
      <Route path="seats/:showId" element={<SeatSelection />} />
      <Route path="db-architecture" element={<DatabaseArchitecture />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);
'@

wf "src/App.tsx" @'
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import { AppRoutes } from './routes';
import { toastConfig } from './components/common/Toast';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LocationProvider>
          <AppRoutes />
          <Toaster toastOptions={toastConfig} />
        </LocationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
'@

wf "src/main.tsx" @'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
'@

Write-Host "Scaffolding complete!"
