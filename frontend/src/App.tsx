import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';
import { AppRoutes } from './routes';
import { toastConfig } from './components/common/Toast';
import { ScrollToTop } from './components/common/ScrollToTop';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ThemeProvider>
        <AuthProvider>
          <LocationProvider>
            <AppRoutes />
            <Toaster toastOptions={toastConfig} />
          </LocationProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
