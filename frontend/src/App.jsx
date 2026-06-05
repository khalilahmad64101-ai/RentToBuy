import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { BackToTop } from './components/layout/BackToTop';

// Page declarations
import { Home } from './pages/Home';
import { Cars } from './pages/Cars';
import { CarDetails } from './pages/CarDetails';
import { Apply } from './pages/Apply';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { TrackRide } from './pages/TrackRide';
import { Admin } from './pages/Admin';
import { FAQ } from './pages/FAQ';
import { Contact } from './pages/Contact';
import { HowItWorks } from './pages/HowItWorks';

function AppContent() {
  const location = useLocation();
  const hideFooterPaths = ['/dashboard', '/admin'];
  const showFooter = !hideFooterPaths.some(path => location.pathname.toLowerCase().startsWith(path));

  // Automatically scroll to the top of the page on route change
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50" id="main-reactive-app">
      {/* Global Header */}
      <Navbar />

      {/* Core Layout Content */}
      <main className="flex-1 pb-16 lg:pb-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/cars/:id" element={<CarDetails />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/track-ride" element={<TrackRide />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          {/* Fallback route */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      {/* Global Footer and Helpers */}
      {showFooter && <Footer />}
      {showFooter && <BackToTop />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
