import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Button } from '../ui/Button';
import { Car, User, LogOut, Menu, X, Shield,Bell, Layers, HelpCircle, Mail, HelpCircle as FaqIcon, MessageCircle, CreditCard, ChevronDown, Home, MapPin } from 'lucide-react';

// Helper Front-Facing Car Icon styled to match the requested logo perfectly

export function Navbar() {
  const { user, logout, syncDriverData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Real-time Database Notifications
  const [dbNotifications, setDbNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [bellDropdownOpen, setBellDropdownOpen] = useState(false);

  useEffect(() => {
    if (!user?.email) {
      setDbNotifications([]);
      setUnreadCount(0);
      return;
    }

    const fetchNotifications = async () => {
      try {
        const list = await api.notifications.getByEmail(user.email);
        setDbNotifications(list || []);
        setUnreadCount((list || []).filter(n => !n.read).length);
      } catch (err) {
        console.warn("Failed to retrieve database notifications: ", err.message);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, [user?.email]);

  const handleMarkRead = async (id) => {
    try {
      await api.notifications.markRead(id);
      setDbNotifications(prev => prev.map(n => (n._id === id || n.id === id) ? { ...n, read: true } : n));
      setUnreadCount(c => Math.max(0, c - 1));
    } catch (err) {
      console.error("Marking of notification reading failed: ", err);
    }
  };

  const handleMarkAllRead = async () => {
    if (!user?.email) return;
    try {
      await api.notifications.markAllRead(user.email);
      setDbNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Clearance of all database unread tags failed: ", err);
    }
  };

  // Payment Modal States
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState('100');
  const [payMethod, setPayMethod] = useState('Debit Card');
  const [payCarName, setPayCarName] = useState('Toyota Prius Hybrid');
  const [payLoading, setPayLoading] = useState(false);
  const [payMessage, setPayMessage] = useState(null);
  const [cardNumber, setCardNumber] = useState('4532 7182 9011 4832');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('341');

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setPayLoading(true);
    setPayMessage(null);

    try {
      const payload = {
        carName: payCarName,
        amount: Number(payAmount),
        email: user ? user.email : 'guest@rent2go.com',
        method: payMethod,
      };

      // Call the simulated API payments endpoint
      await api.payments.create(payload);

      setPayMessage({
        type: 'success',
        text: `Success! Your rent contribution of £${payAmount} has been logged safely. Thank you!`
      });

      if (user) {
        await syncDriverData();
      }

      // Automatically close modal after success
      setTimeout(() => {
        setPaymentModalOpen(false);
        setPayMessage(null);
      }, 3000);

    } catch (err) {
      setPayMessage({
        type: 'error',
        text: err.message || 'Payment processing failed. Please check details and try again.'
      });
    } finally {
      setPayLoading(false);
    }
  };

  const navLinks = [
    { label: 'HOME', path: '/' },
    { label: 'EXPLORE CARS', path: '/cars' },
    { label: 'TRACK RIDE', path: '/track-ride' },
    { label: 'HOW IT WORKS', path: '/how-it-works' },
    { label: 'CONTACT', path: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 overflow-visible" id="exact-navbar-container">
      {/* 1. DESKTOP EXQUISITE LOGO HEADER (Matching the requested layout exactly) */}
      <div className="hidden lg:block relative z-50 w-full bg-white select-none" id="desktop-image-matched-header">

        {/* Top White Strip for Client Actions (Kept only as a clean white background height for circular logo layout) */}
        <div className="bg-white h-11 w-full flex items-center justify-between px-12 border-b border-gray-100">
          
        </div>

        {/* Black Horizontal Band */}
        <div className="bg-[#000000] h-[64px] w-full relative flex items-center justify-between px-6 xl:px-16 animate-fade-in">

          {/* Left Navigation Links: Home, Explore Cars, Track Ride */}
          <div className="flex-1 flex items-center justify-end space-x-10 pr-16 xl:pr-24">
            <Link
              to="/"
              className={`font-sans font-extrabold text-[14px] xl:text-[15px] tracking-wide transition-colors ${isActive('/') ? 'text-[#7CC242]' : 'text-white hover:text-[#7CC242]'
                }`}
            >
              Home
            </Link>
            <Link
              to="/cars"
              className={`font-sans font-extrabold text-[14px] xl:text-[15px] tracking-wide transition-colors ${isActive('/cars') ? 'text-[#7CC242]' : 'text-white hover:text-[#7CC242]'
                }`}
            >
              Explore Cars
            </Link>
            <Link
              to="/track-ride"
              className={`font-sans font-extrabold text-[14px] xl:text-[15px] tracking-wide transition-colors ${isActive('/track-ride') ? 'text-[#7CC242]' : 'text-white hover:text-[#7CC242]'
                }`}
            >
              Track Ride
            </Link>
          </div>

          {/* Centered Circular Logo (Perfectly aligned on the Y-axis) */}
          <div className="flex-none flex items-center justify-center z-50">
            <Link to="/" className="block focus:outline-none group">
              <div className="w-[143px] h-[140px] rounded-full overflow-hidden shadow-lg">
                <img
                  src="https://r2-buy-car.vercel.app/logo.jpeg"
                  alt="R2 BuyCar Logo"
                  className="w-full h-full object-cover scale-104"
                />
              </div>
            </Link>
          </div>

          {/* Right Navigation Links: How It Works, Contact, and Profile */}
          <div className="flex-1 flex items-center justify-start space-x-8 pl-16 xl:pl-24">
            <Link
              to="/how-it-works"
              className={`font-sans font-extrabold text-[14px] xl:text-[15px] tracking-wide transition-colors ${isActive('/how-it-works') ? 'text-[#7CC242]' : 'text-white hover:text-[#7CC242]'
                }`}
            >
              How it works
            </Link>
            <Link
              to="/contact"
              className={`font-sans font-extrabold text-[14px] xl:text-[15px] tracking-wide transition-colors ${isActive('/contact') ? 'text-[#7CC242]' : 'text-white hover:text-[#7CC242]'
                }`}
            >
              Contact
            </Link>

            {/* REAL-TIME NOTIFICATIONS BELL */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setBellDropdownOpen(!bellDropdownOpen)}
                  className="p-2 hover:bg-zinc-900 rounded-full text-white hover:text-[#7CC242] transition relative cursor-pointer"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-[#7CC242] text-black text-[9px] font-black rounded-full flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {bellDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-2xl border border-gray-150 py-2 z-50 animate-fade-in text-slate-800">
                    <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center bg-slate-50/50 rounded-t-xl">
                      <span className="font-extrabold text-[10px] text-slate-900 uppercase tracking-wider">Inbox Notifications</span>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-[9.5px] font-extrabold text-indigo-600 hover:underline uppercase tracking-tight"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
                      {dbNotifications.length === 0 ? (
                        <div className="py-8 px-4 text-center text-xs text-slate-400 space-y-1">
                          <p className="font-bold">🔔 All quiet here.</p>
                          <p className="text-[10px]">No new updates processed.</p>
                        </div>
                      ) : (
                        dbNotifications.map((note) => {
                          const noteId = note._id || note.id;
                          return (
                            <div
                              key={noteId}
                              onClick={() => handleMarkRead(noteId)}
                              className={`p-3.5 hover:bg-slate-50 transition cursor-pointer text-left flex gap-2.5 w-full ${!note.read ? 'bg-indigo-50/20 border-l-2 border-[#7CC242]' : ''}`}
                            >
                              <span className="text-xs mt-0.5">
                                {note.type === 'success' ? '🟢' : '🔵'}
                              </span>
                              <div className="space-y-0.5 min-w-0 flex-1">
                                <h4 className={`text-xs font-bold leading-normal text-slate-950 ${!note.read ? 'font-black' : ''}`}>{note.title}</h4>
                                <p className="text-[10.5px] leading-snug text-slate-500 font-medium">{note.content}</p>
                                <span className="block text-[8.5px] text-slate-400 font-mono mt-1">
                                  {note.createdAt ? new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PROFILE ACTION */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#7CC242] hover:bg-[#6cb135] text-[#000000] font-extrabold text-[11px] xl:text-[12px] uppercase tracking-wider rounded-md transition-all duration-200 cursor-pointer shadow-sm whitespace-nowrap"
                >
                  <span>👤</span>
                  <span>PROFILE</span>
                  <ChevronDown className={`w-3 h-3 ml-0.5 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-1.5 z-50 animate-fade-in text-slate-800">
                    <div className="px-4 py-2 border-b border-gray-50">
                      <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Driver Account</p>
                      <p className="font-bold text-sm text-[#1F3F7A] truncate mt-0.5">{user.fullName || user.email}</p>
                      <p className="text-[10px] text-[#7CC242] font-bold mt-0.5">{user.role?.toUpperCase()} ACCESS</p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-[#1F3F7A] font-bold hover:bg-slate-50 transition-colors"
                    >
                      <Layers className="w-4 h-4 mr-2 text-slate-400" />
                      My Portal Dashboard
                    </Link>

                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-yellow-600 font-bold hover:bg-yellow-50/50 transition-colors"
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Admin Panel
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 font-bold hover:bg-red-50/50 text-left transition-colors border-t border-gray-50 mt-1.5"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <button
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#7CC242] hover:bg-[#6cb135] text-[#000000] font-extrabold text-[11px] xl:text-[12px] uppercase tracking-wider rounded-md transition-all duration-200 cursor-pointer shadow-sm whitespace-nowrap"
                >
                  <span>👤</span>
                  <span>PROFILE</span>
                </button>
              </Link>
            )}
          </div>

        </div>
      </div>

      {/* 2. MOBILE HEADER (Centered image logo, text brand removed, background black matching other devices) */}
      <div className="lg:hidden bg-[#000000] border-b border-zinc-900 shadow-sm w-full py-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative flex justify-between items-center h-[50px]">

            {/* Left standard spacer to preserve alignment flex balance / Mobile Notification Bell */}
            <div className="w-10 text-left">
              {user && (
                <div className="relative inline-block">
                  <button
                    onClick={() => setBellDropdownOpen(!bellDropdownOpen)}
                    className="p-1 px-1.5 hover:bg-zinc-900 rounded-full text-white hover:text-[#7CC242] transition relative cursor-pointer"
                  >
                    <Bell className="w-4.5 h-4.5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#7CC242] rounded-full flex items-center justify-center animate-pulse">
                      </span>
                    )}
                  </button>

                  {bellDropdownOpen && (
                    <div className="absolute left-0 mt-3 w-[260px] sm:w-[280px] bg-white rounded-xl shadow-2xl border border-gray-150 py-2 z-[100] animate-fade-in text-slate-800">
                      <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center bg-slate-50/50 rounded-t-xl">
                        <span className="font-extrabold text-[10px] text-slate-900 uppercase tracking-wider">Inbox Notifications</span>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="text-[9px] font-extrabold text-indigo-600 hover:underline uppercase tracking-tight"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-60 overflow-y-auto divide-y divide-gray-50">
                        {dbNotifications.length === 0 ? (
                          <div className="py-6 px-4 text-center text-xs text-slate-400">
                            No notifications yet.
                          </div>
                        ) : (
                          dbNotifications.map((note) => {
                            const noteId = note._id || note.id;
                            return (
                              <div
                                key={noteId}
                                onClick={() => {
                                  handleMarkRead(noteId);
                                  setBellDropdownOpen(false);
                                }}
                                className={`p-3 hover:bg-slate-50 transition cursor-pointer text-left flex gap-2 ${!note.read ? 'bg-indigo-50/20 border-l-2 border-[#7CC242]' : ''}`}
                              >
                                <span className="text-[11px] mt-0.5">
                                  {note.type === 'success' ? '🟢' : '🔵'}
                                </span>
                                <div className="text-[10.5px] leading-snug font-sans flex-1">
                                  <span className="font-bold text-slate-900 block">{note.title}</span>
                                  <span className="text-slate-500 block text-[10px] mt-0.5">{note.content}</span>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Logo Brand: Centered, text removed, displaying the circular logo beautifully */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Link to="/" className="flex items-center group focus:outline-none pointer-events-auto" id="branding-link">
                <div className="w-[100px] h-[98px] mt-12 rounded-full overflow-hidden shadow-md border-2 border-slate-100 bg-white">
                  <img
                    src="https://r2-buy-car.vercel.app/logo.jpeg"
                    alt="R2 BuyCar Logo"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
            </div>

           

          </div>
        </div>
      </div>

      {/* 4. PREMIUM NATIVE MOBILE BOTTOM APP BAR (Facebook Companion Style) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-50 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-1 py-1 flex justify-around items-center h-16 select-none">

        {/* Tab 1: HOME */}
        <Link
          to="/"
          onClick={() => setMobileMenuOpen(false)}
          className={`flex-1 flex flex-col items-center justify-center h-full transition-all relative ${isActive('/') && !mobileMenuOpen && !paymentModalOpen
              ? 'text-brand-primary'
              : 'text-slate-400 hover:text-slate-600'
            }`}
        >
          <Home className="w-[21px] h-[21px]" strokeWidth={isActive('/') && !mobileMenuOpen && !paymentModalOpen ? 2.5 : 2} />
          <span className="text-[9px] font-black tracking-wide mt-1 uppercase">Home</span>
          {isActive('/') && !mobileMenuOpen && !paymentModalOpen && (
            <span className="absolute top-0 w-8 h-[3px] bg-brand-primary rounded-b-md"></span>
          )}
        </Link>

        {/* Tab 2: CARS */}
        <Link
          to="/cars"
          onClick={() => setMobileMenuOpen(false)}
          className={`flex-1 flex flex-col items-center justify-center h-full transition-all relative ${isActive('/cars') && !mobileMenuOpen && !paymentModalOpen
              ? 'text-brand-primary'
              : 'text-slate-400 hover:text-slate-600'
            }`}
        >
          <Car className="w-[21px] h-[21px]" strokeWidth={isActive('/cars') && !mobileMenuOpen && !paymentModalOpen ? 2.5 : 2} />
          <span className="text-[9px] font-black tracking-wide mt-1 uppercase">Cars</span>
          {isActive('/cars') && !mobileMenuOpen && !paymentModalOpen && (
            <span className="absolute top-0 w-8 h-[3px] bg-brand-primary rounded-b-md"></span>
          )}
        </Link>

        {/* Tab 3: LIVE TRACK */}
        <Link
          to="/track-ride"
          onClick={() => setMobileMenuOpen(false)}
          className={`flex-1 flex flex-col items-center justify-center h-full transition-all relative ${isActive('/track-ride') && !mobileMenuOpen && !paymentModalOpen
              ? 'text-brand-primary'
              : 'text-slate-400 hover:text-slate-600'
            }`}
        >
          <MapPin className="w-[21px] h-[21px]" strokeWidth={isActive('/track-ride') && !mobileMenuOpen && !paymentModalOpen ? 2.5 : 2} />
          <span className="text-[9px] font-black tracking-wide mt-1 uppercase">Track</span>
          {isActive('/track-ride') && !mobileMenuOpen && !paymentModalOpen && (
            <span className="absolute top-0 w-8 h-[3px] bg-brand-primary rounded-b-md"></span>
          )}
        </Link>

        {/* Tab 4: ACCOUNT SHORTCUTS TRIGGER */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`flex-1 flex flex-col items-center justify-center h-full transition-all relative bg-transparent border-none outline-none cursor-pointer ${mobileMenuOpen
              ? 'text-brand-primary'
              : 'text-slate-400 hover:text-slate-600'
            }`}
        >
          {mobileMenuOpen ? (
            <X className="w-[21px] h-[21px] text-red-500 animate-pulse" strokeWidth={2.5} />
          ) : (
            <User className="w-[21px] h-[21px]" strokeWidth={2} />
          )}
          <span className="text-[9px] font-black tracking-wide mt-1 uppercase">Account</span>
          {mobileMenuOpen && (
            <span className="absolute top-0 w-8 h-[3px] bg-brand-primary rounded-b-md"></span>
          )}
        </button>

      </div>

      {/* Mobile Menu Drawer (Redesigned as Premium Facebook-shortcuts Grid Sheet) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed bottom-16 left-0 right-0 z-40 bg-[#0c111d] text-white rounded-t-[2rem] shadow-[0_-12px_42px_rgba(0,0,0,0.35)] max-h-[80vh] overflow-y-auto border-t border-slate-800 pb-16 animate-fade-in font-sans">

          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/40">
            <div>
              <h3 className="font-extrabold text-sm tracking-wider uppercase text-white">Account</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Manage your rent-to-buy profile</p>
            </div>
            <span className="px-2.5 py-1 text-[9px] font-black bg-brand-primary text-brand-secondary tracking-widest rounded-md uppercase whitespace-nowrap shadow-xs align-middle">
              VIP HUB
            </span>
          </div>

          {/* User Account / Profile Details Panel */}
          {user ? (
            <div className="px-6 py-5 bg-slate-950/40 border-b border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-primary text-brand-secondary font-black text-sm flex items-center justify-center shadow-md">
                  {user.fullName ? user.fullName.substring(0, 2).toUpperCase() : 'DR'}
                </div>
                <div className="min-w-0">
                  <p className="font-black text-sm text-white truncate leading-none">{user.fullName || user.email}</p>
                  <p className="text-[9.5px] text-brand-primary font-black tracking-widest uppercase mt-1">{user.role?.toUpperCase()} PORTAL ACCESS</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-900/30 text-red-400 text-[10px] font-black uppercase tracking-wider transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Out</span>
              </button>
            </div>
          ) : (
            <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-brand-secondary border-b border-slate-800">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Join our flexible program today</p>
              <div className="mt-3 flex gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-brand-secondary font-extrabold text-[11px] uppercase tracking-wider rounded-xl transition-all shadow-sm"
                >
                  <span>👤</span>
                  <span>SIGN IN</span>
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-xl transition-all"
                >
                  <span>📝</span>
                  <span>REGISTER</span>
                </Link>
              </div>
            </div>
          )}

          {/* Shortcut Cards Grid representing premium Facebook app layout */}
          <div className="p-6 space-y-5">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Shortcut Categories</p>

            <div className="grid grid-cols-2 gap-3">
              {/* Option 1: Explore Cars */}
              <Link
                to="/cars"
                onClick={() => setMobileMenuOpen(false)}
                className="flex flex-col items-start p-4.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all text-left"
              >
                <span className="p-2 bg-brand-primary/10 text-brand-primary border border-brand-primary/10 rounded-xl mb-3">
                  <Car className="w-4.5 h-4.5" />
                </span>
                <span className="text-xs font-black text-white uppercase tracking-wider">Explore Cars</span>
                <span className="text-[9px] text-slate-400 mt-0.5 leading-tight">Find premium models</span>
              </Link>

              {/* Option 2: Live Tracking */}
              <Link
                to="/track-ride"
                onClick={() => setMobileMenuOpen(false)}
                className="flex flex-col items-start p-4.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all text-left"
              >
                <span className="p-2 bg-brand-secondary/15 text-brand-primary border border-brand-primary/10 rounded-xl mb-3">
                  <MapPin className="w-4.5 h-4.5" />
                </span>
                <span className="text-xs font-black text-white uppercase tracking-wider">Track Ride</span>
                <span className="text-[9px] text-slate-400 mt-0.5 leading-tight">Live program tracking</span>
              </Link>

              {/* Option 3: Portal Dashboard */}
              <Link
                to={user ? "/dashboard" : "/apply"}
                onClick={() => setMobileMenuOpen(false)}
                className="flex flex-col items-start p-4.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all text-left"
              >
                <span className="p-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 rounded-xl mb-3">
                  <Layers className="w-4.5 h-4.5" />
                </span>
                <span className="text-xs font-black text-white uppercase tracking-wider">
                  {user ? "Dashboard" : "Apply Program"}
                </span>
                <span className="text-[9px] text-slate-400 mt-0.5 leading-tight">
                  {user ? "Manage drivers" : "Lease-to-own application"}
                </span>
              </Link>

              {/* Option 4: How It Works */}
              <Link
                to="/how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="flex flex-col items-start p-4.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all text-left"
              >
                <span className="p-2 bg-brand-primary/10 text-brand-primary border border-brand-primary/15 rounded-xl mb-3">
                  <HelpCircle className="w-4.5 h-4.5" />
                </span>
                <span className="text-xs font-black text-white uppercase tracking-wider">How It Works</span>
                <span className="text-[9px] text-slate-400 mt-0.5 leading-tight font-light">Direct ownership path</span>
              </Link>

              {/* Option 5: Contact Support */}
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="flex flex-col items-start p-4.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all text-left"
              >
                <span className="p-2 bg-purple-500/10 text-purple-400 border border-purple-500/10 rounded-xl mb-3">
                  <Mail className="w-4.5 h-4.5" />
                </span>
                <span className="text-xs font-black text-white uppercase tracking-wider">Contact Us</span>
                <span className="text-[9px] text-slate-400 mt-0.5 leading-tight">24/7 client center</span>
              </Link>

              {/* Option 6: FAQ Help */}
              <Link
                to="/faq"
                onClick={() => setMobileMenuOpen(false)}
                className="flex flex-col items-start p-4.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all text-left"
              >
                <span className="p-2 bg-brand-primary/10 text-brand-primary border border-brand-primary/10 rounded-xl mb-3">
                  <MessageCircle className="w-4.5 h-4.5" />
                </span>
                <span className="text-xs font-black text-white uppercase tracking-wider">Knowledge Base</span>
                <span className="text-[9px] text-slate-400 mt-0.5 leading-tight font-light text-ellipsis">Frequently asked questions</span>
              </Link>
            </div>

            {/* Special Administrator Portal Shortcut (Admin Only) */}
            {user && user.role === 'admin' && (
              <div className="pt-2">
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3.5 w-full p-4.5 rounded-2xl bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/10 transition-all text-left"
                >
                  <span className="p-2 bg-amber-500/10 text-amber-500 border border-amber-500/10 rounded-xl">
                    <Shield className="w-4.5 h-4.5" />
                  </span>
                  <div>
                    <span className="text-xs font-black text-white uppercase tracking-wider block">Security Admin Hub</span>
                    <span className="text-[9.5px] text-amber-500/80 font-black tracking-wide block mt-0.5">Control live agreement leases</span>
                  </div>
                </Link>
              </div>
            )}

          </div>

        </div>
      )}

      {/* Embedded High-Fidelity Custom Payment Modal */}
      {paymentModalOpen && (
        <div className="fixed inset-0 bg-[#111A2ED9] backdrop-blur-xs flex items-center justify-center z-[100] p-4 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-100 overflow-hidden transform transition-all animate-scale-up">

            {/* Modal Header */}
            <div className="px-6 py-5 bg-[#111A2E] text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-xl">💳</span>
                <div>
                  <h3 className="font-extrabold text-base tracking-wider text-white uppercase">Settle Contribution</h3>
                  <p className="text-[10px] text-brand-primary font-bold tracking-widest uppercase mt-0.5">Rent2Go BuyCarz Payment System</p>
                </div>
              </div>
              <button
                onClick={() => setPaymentModalOpen(false)}
                className="p-1 px-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handlePaymentSubmit} className="p-6 space-y-4">

              {payMessage && (
                <div className={`p-4 rounded-xl flex items-start gap-2.5 text-sm font-bold ${payMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                  }`}>
                  <span className="text-base">{payMessage.type === 'success' ? '✅' : '❌'}</span>
                  <div className="flex-1">{payMessage.text}</div>
                </div>
              )}

              {/* Vehicle Selection */}
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Selected Asset / Lease Vehicle</label>
                <select
                  value={payCarName}
                  onChange={(e) => setPayCarName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-bold bg-white text-slate-900 focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                  required
                >
                  <option value="Toyota Prius Hybrid">Toyota Prius Hybrid (Uber-Ready)</option>
                  <option value="Hyundai Ioniq Hybrid">Hyundai Ioniq Hybrid (Premium)</option>
                  <option value="Nissan Leaf EV">Nissan Leaf EV (All Electric)</option>
                  <option value="Tesla Model 3">Tesla Model 3 Long Range</option>
                  <option value="Skoda Octavia Hatch">Skoda Octavia Hatch (Elite)</option>
                </select>
              </div>

              {/* Amount Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Contribution Amount (£)</label>
                  <input
                    type="number"
                    min="10"
                    max="5000"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-bold text-slate-900 focus:ring-2 focus:ring-[#2563EB]/20"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">Payment Channel</label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-bold bg-white text-slate-900 focus:ring-2 focus:ring-[#2563EB]/20"
                    required
                  >
                    <option value="Debit Card">Debit Card</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Stripe Link">Stripe Gate</option>
                    <option value="Bank Transfer">Direct Bank Wire</option>
                  </select>
                </div>
              </div>

              {/* Card Form Mock representation */}
              <div className="border border-slate-100 bg-slate-50/70 p-4.5 rounded-2xl relative overflow-hidden">
                <div className="absolute right-4 top-4 text-xs font-extrabold uppercase tracking-widest text-slate-300">SECURE SHIELD</div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Card Number (Simulated)</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-white px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-mono font-bold text-slate-800"
                      placeholder="XXXX XXXX XXXX XXXX"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Expiration</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-white px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-mono font-bold text-slate-800"
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Security Code</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full bg-white px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-mono font-bold text-slate-800"
                        placeholder="CVV"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPaymentModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-slate-50 text-slate-600 text-xs font-extrabold uppercase tracking-wide cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={payLoading}
                  className="px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-[#2563EB]/50 text-white text-xs font-extrabold uppercase tracking-wide cursor-pointer transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  {payLoading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Payment (£{payAmount})</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </nav>
  );
}
