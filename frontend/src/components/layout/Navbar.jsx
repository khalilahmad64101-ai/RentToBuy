import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Button } from '../ui/Button';
import { Car, User, LogOut, Menu, X, Shield, Layers, HelpCircle, Mail, HelpCircle as FaqIcon, MessageCircle, CreditCard, ChevronDown, Home, MapPin } from 'lucide-react';

export function Navbar() {
  const { user, logout, syncDriverData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  
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
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm" id="exact-navbar-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Brand matching image 100% same to same */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center group focus:outline-none" id="branding-link">
              {/* Dark circle with gold/beige car icon inside */}
              <div className="w-10 h-10 rounded-full bg-[#111A2E] flex items-center justify-center mr-2 shadow-sm transition-transform group-hover:scale-105">
                <Car className="h-5 w-5 text-[#CDA275]" strokeWidth={2.5} />
              </div>
              
              {/* Text elements: RENT (black/dark-blue), 2GO (bold accent blue), BUYCARZ badge */}
              <div className="flex items-center">
                <span className="font-extrabold text-[#111A2E] text-base min-[360px]:text-[22px] tracking-tight">
                  RENT
                </span>
                <span className="font-extrabold text-[#2563EB] text-base min-[360px]:text-[22px] tracking-tight ml-0.5">
                  2GO
                </span>
                
                {/* Gold BUYCARZ rounded badge with dark navy text */}
                <span className="ml-1 min-[360px]:ml-2 px-1.5 py-0.5 min-[360px]:px-2.5 min-[360px]:py-1 text-[8px] min-[360px]:text-[10px] font-black bg-[#CDA275] text-[#111A2E] tracking-widest rounded-md uppercase align-middle whitespace-nowrap shadow-xs">
                  BUYCARZ
                </span>
              </div>
            </Link>
          </div>

          {/* Center Navigation Links matching image 100% same to same */}
          <div className="hidden lg:flex items-center justify-center space-x-8 h-full">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`h-full inline-flex items-center px-0.5 border-b-[3px] font-sans font-extrabold text-[13px] tracking-wide transition-all ${
                  isActive(link.path)
                    ? 'border-[#2563EB] text-[#2563EB]'
                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-200'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Action Buttons matching image 100% same to same */}
          <div className="hidden lg:flex items-center space-x-3.5">
            {/* Outline Button: MAKE A PAYMENT */}
            <button
              onClick={() => {
                setPayMessage(null);
                setPaymentModalOpen(true);
              }}
              className="flex items-center gap-2 px-4.5 py-2 px-5 bg-white border border-[#CDA275] hover:bg-[#FAF8F5] text-[#111A2E] font-extrabold text-xs uppercase tracking-wider rounded-md transition-all duration-200 cursor-pointer shadow-xs whitespace-nowrap"
            >
              <span>PAYMENTS</span>
            </button>

            {/* Filled Button: TAXI • PORTAL */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#111A2E] hover:bg-[#1D2B4A] text-white font-extrabold text-xs uppercase tracking-wider rounded-md transition-all duration-200 cursor-pointer shadow-sm whitespace-nowrap"
                >
                  <span>👤</span>
                  <span>PROFILE</span>
                  <ChevronDown className={`w-3 h-3 ml-0.5 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* User Dropdown Profile option details */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-1.5 z-10 animate-fade-in">
                    <div className="px-4 py-2 border-b border-gray-50">
                      <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Driver Account</p>
                      <p className="font-bold text-sm text-[#111A2E] truncate mt-0.5">{user.fullName || user.email}</p>
                      <p className="text-[10px] text-[#2563EB] font-bold mt-0.5">{user.role?.toUpperCase()} ACCESS</p>
                    </div>
                    
                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-[#111A2E] font-bold hover:bg-slate-50 transition-colors"
                    >
                      <Layers className="w-4 h-4 mr-2 text-slate-400" />
                      My Portal Dashboard
                    </Link>

                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-amber-600 font-bold hover:bg-amber-50/50 transition-colors"
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
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#111A2E] hover:bg-[#1D2B4A] text-white font-extrabold text-xs uppercase tracking-wider rounded-md transition-all duration-200 cursor-pointer shadow-sm whitespace-nowrap"
                >
                  <span>👤</span>
                  <span>PROFILE</span>
                </button>
              </Link>
            )}
          </div>

          {/* Mobile Profile Trigger (Replacing Hamburger for sleek modern app feel) */}
          <div className="flex items-center lg:hidden">
            {user ? (
              <Link
                to="/dashboard"
                className="w-10 h-10 rounded-full bg-[#111A2E] flex items-center justify-center text-xs font-black text-[#CDA275] border-2 border-[#CDA275]/30 hover:bg-[#1D2B4A] transition-all shadow-sm"
                title="My Driver Dashboard"
              >
                {user.fullName ? user.fullName.substring(0, 2).toUpperCase() : '👤'}
              </Link>
            ) : (
              <Link
                to="/login"
                className="w-10 h-10 rounded-full bg-[#111A2E] flex items-center justify-center text-xs text-white hover:bg-[#1D2B4A] border border-slate-200 transition-all shadow-sm"
                title="Sign In / Profile"
              >
                👤
              </Link>
            )}
          </div>

        </div>
      </div>

      {/* 4. PREMIUM NATIVE MOBILE BOTTOM APP BAR (Facebook Companion Style) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-50 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-1 py-1 flex justify-around items-center h-16 select-none">
        
        {/* Tab 1: HOME */}
        <Link 
          to="/" 
          onClick={() => setMobileMenuOpen(false)}
          className={`flex-1 flex flex-col items-center justify-center h-full transition-all relative ${
            isActive('/') && !mobileMenuOpen && !paymentModalOpen
              ? 'text-[#2563EB]' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Home className="w-[21px] h-[21px]" strokeWidth={isActive('/') && !mobileMenuOpen && !paymentModalOpen ? 2.5 : 2} />
          <span className="text-[9px] font-black tracking-wide mt-1 uppercase">Home</span>
          {isActive('/') && !mobileMenuOpen && !paymentModalOpen && (
            <span className="absolute top-0 w-8 h-[3px] bg-[#2563EB] rounded-b-md"></span>
          )}
        </Link>

        {/* Tab 2: CARS */}
        <Link 
          to="/cars" 
          onClick={() => setMobileMenuOpen(false)}
          className={`flex-1 flex flex-col items-center justify-center h-full transition-all relative ${
            isActive('/cars') && !mobileMenuOpen && !paymentModalOpen
              ? 'text-[#2563EB]' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Car className="w-[21px] h-[21px]" strokeWidth={isActive('/cars') && !mobileMenuOpen && !paymentModalOpen ? 2.5 : 2} />
          <span className="text-[9px] font-black tracking-wide mt-1 uppercase">Cars</span>
          {isActive('/cars') && !mobileMenuOpen && !paymentModalOpen && (
            <span className="absolute top-0 w-8 h-[3px] bg-[#2563EB] rounded-b-md"></span>
          )}
        </Link>

        {/* Tab 3: LIVE TRACK */}
        <Link 
          to="/track-ride" 
          onClick={() => setMobileMenuOpen(false)}
          className={`flex-1 flex flex-col items-center justify-center h-full transition-all relative ${
            isActive('/track-ride') && !mobileMenuOpen && !paymentModalOpen
              ? 'text-[#2563EB]' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <MapPin className="w-[21px] h-[21px]" strokeWidth={isActive('/track-ride') && !mobileMenuOpen && !paymentModalOpen ? 2.5 : 2} />
          <span className="text-[9px] font-black tracking-wide mt-1 uppercase">Track</span>
          {isActive('/track-ride') && !mobileMenuOpen && !paymentModalOpen && (
            <span className="absolute top-0 w-8 h-[3px] bg-[#2563EB] rounded-b-md"></span>
          )}
        </Link>

        {/* Tab 4: PAYMENTS TRIGGER */}
        <button 
          onClick={() => {
            setMobileMenuOpen(false);
            setPayMessage(null);
            setPaymentModalOpen(true);
          }}
          className={`flex-1 flex flex-col items-center justify-center h-full transition-all relative bg-transparent border-none outline-none cursor-pointer ${
            paymentModalOpen 
              ? 'text-[#2563EB]' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <CreditCard className="w-[21px] h-[21px]" strokeWidth={paymentModalOpen ? 2.5 : 2} />
          <span className="text-[9px] font-black tracking-wide mt-1 uppercase">Pay</span>
          {paymentModalOpen && (
            <span className="absolute top-0 w-8 h-[3px] bg-[#2563EB] rounded-b-md"></span>
          )}
        </button>

        {/* Tab 5: MENU SHORTCUTS TRIGGER */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`flex-1 flex flex-col items-center justify-center h-full transition-all relative bg-transparent border-none outline-none cursor-pointer ${
            mobileMenuOpen 
              ? 'text-[#2563EB]' 
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          {mobileMenuOpen ? (
            <X className="w-[21px] h-[21px] text-red-500 animate-pulse" strokeWidth={2.5} />
          ) : (
            <Menu className="w-[21px] h-[21px]" strokeWidth={2} />
          )}
          <span className="text-[9px] font-black tracking-wide mt-1 uppercase">Menu</span>
          {mobileMenuOpen && (
            <span className="absolute top-0 w-8 h-[3px] bg-[#2563EB] rounded-b-md"></span>
          )}
        </button>

      </div>

      {/* Mobile Menu Drawer (Redesigned as Premium Facebook-shortcuts Grid Sheet) */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed bottom-16 left-0 right-0 z-40 bg-[#0c111d] text-white rounded-t-[2rem] shadow-[0_-12px_42px_rgba(0,0,0,0.35)] max-h-[80vh] overflow-y-auto border-t border-slate-800 pb-16 animate-fade-in font-sans">
          
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/40">
            <div>
              <h3 className="font-extrabold text-sm tracking-wider uppercase text-white">Menu Shortcuts</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Rent2Go Premium Fleet Options</p>
            </div>
            <span className="px-2.5 py-1 text-[9px] font-black bg-[#CDA275] text-[#111A2E] tracking-widest rounded-md uppercase whitespace-nowrap shadow-xs align-middle">
              VIP HUB
            </span>
          </div>

          {/* User Account / Profile Details Panel */}
          {user ? (
            <div className="px-6 py-5 bg-slate-950/40 border-b border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#CDA275] text-[#111A2E] font-black text-sm flex items-center justify-center shadow-md">
                  {user.fullName ? user.fullName.substring(0, 2).toUpperCase() : 'DR'}
                </div>
                <div className="min-w-0">
                  <p className="font-black text-sm text-white truncate leading-none">{user.fullName || user.email}</p>
                  <p className="text-[9.5px] text-[#2563EB] font-black tracking-widest uppercase mt-1">{user.role?.toUpperCase()} PORTAL ACCESS</p>
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
            <div className="px-6 py-5 bg-gradient-to-r from-slate-900 to-[#111A2E] border-b border-slate-800">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Join our flexible program today</p>
              <div className="mt-3 flex gap-3">
                <Link 
                  to="/login" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#CDA275] hover:bg-[#b88f63] text-[#111A2E] font-extrabold text-[11px] uppercase tracking-wider rounded-xl transition-all shadow-sm"
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
                <span className="p-2 bg-blue-500/10 text-blue-400 border border-blue-500/10 rounded-xl mb-3">
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
                <span className="p-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 rounded-xl mb-3">
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
                <span className="p-2 bg-amber-500/10 text-[#CDA275] border border-[#CDA275]/15 rounded-xl mb-3">
                  <HelpCircle className="w-4.5 h-4.5" />
                </span>
                <span className="text-xs font-black text-white uppercase tracking-wider">How It Works</span>
                <span className="text-[9px] text-slate-400 mt-0.5 leading-tight">Direct ownership path</span>
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
                <span className="p-2 bg-[#CDA275]/10 text-[#CDA275] border border-[#CDA275]/10 rounded-xl mb-3">
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
                  <p className="text-[10px] text-[#CDA275] font-bold tracking-widest uppercase mt-0.5">Rent2Go BuyCarz Payment System</p>
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
                <div className={`p-4 rounded-xl flex items-start gap-2.5 text-sm font-bold ${
                  payMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
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
