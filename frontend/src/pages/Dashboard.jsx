import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Button } from '../components/ui/Button';
import { Loader } from '../components/ui/Loader';
import { mapFriendlyFeedback } from '../utils/feedbackHelper.js';
import { 
  ArrowLeft,
  LayoutDashboard, 
  FileText, 
  FolderOpen, 
  CreditCard, 
  ShieldCheck, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Download, 
  AlertCircle, 
  CheckCircle2, 
  Activity, 
  Coins, 
  Plus, 
  RefreshCw, 
  Phone, 
  MapPin, 
  Lock, 
  Bell, 
  ChevronRight, 
  Eye, 
  Upload, 
  AlertTriangle,
  Info,
  Calendar,
  Layers,
  FileCheck,
  Check,
  Play
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';

export function Dashboard() {
  useSEO({
    title: 'Driver Workspace | Underwriting Status & Billing | R2BuyCar',
    description: 'Manage your active lease, track underwriting parameters, submit compliance check-in logs, and download motor insurance certificates directly inside your workspace.',
    keywords: 'driver workspace, active lease status tracker, pay lease invoice, R2BuyCar client hub'
  });

  const { user, driverData, loading, syncDriverData, logout, updateProfile } = useAuth();
  const navigate = useNavigate();

  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }
    const apiBase = import.meta.env.VITE_API_URL || '';
    return `${apiBase.replace(/\/$/, '')}${url}`;
  };

  // Active Tab state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Detail Sub-view state for single application detail page
  const [selectedApp, setSelectedApp] = useState(null);

  // States for actions / edit forms
  const [payAmount, setPayAmount] = useState('250');
  const [payMethod, setPayMethod] = useState('Debit Card');
  const [selectedAppForPayment, setSelectedAppForPayment] = useState('');
  const [payLoading, setPayLoading] = useState(false);
  const [payMessage, setPayMessage] = useState(null);

  // Re-upload documents states
  const [docAppId, setDocAppId] = useState('');
  const [licenseUrl, setLicenseUrl] = useState('');
  const [selfieUrl, setSelfieUrl] = useState('');
  const [addressUrl, setAddressUrl] = useState('');
  const [docLoading, setDocLoading] = useState(false);
  const [docMessage, setDocMessage] = useState(null);

  // Profile update states
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileAddress, setProfileAddress] = useState('');
  const [profilePassword, setProfilePassword] = useState('');
  const [profileConfirmPassword, setProfileConfirmPassword] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login?redirect=dashboard');
    }
  }, [user, loading, navigate]);

  // Sync profile update form values when user changes
  useEffect(() => {
    if (user) {
      setProfileName(user.fullName || '');
      setProfilePhone(user.phone || '');
      setProfileAddress(user.address || '');
    }
  }, [user]);

  // Set up automatic real-time background synchronization to keep the driver workspace fresh
  useEffect(() => {
    if (!user?.email) return;

    const intervalId = setInterval(() => {
      console.log('[Dashboard] Executing real-time background state synchronization update...');
      syncDriverData();
    }, 8000); // Polling every 8 seconds

    return () => clearInterval(intervalId);
  }, [user?.email, syncDriverData]);

  // Pre-fill fields for Documents and Payments if applications exist
  useEffect(() => {
    const { applications = [] } = driverData;
    if (applications.length > 0) {
      if (!docAppId) setDocAppId(applications[0].id);
      if (!selectedAppForPayment) setSelectedAppForPayment(applications[0].id);
      
      const app = applications[0];
      if (app.applyDetails) {
        setLicenseUrl(app.applyDetails.drivingLicence || '');
        setSelfieUrl(app.applyDetails.selfieWithId || '');
        setAddressUrl(app.applyDetails.addressProof || '');
      }
    }
  }, [driverData.applications, docAppId, selectedAppForPayment]);

  if (loading) {
    return <Loader label="Retrieving your Heathrow driver dashboard..." />;
  }

  if (!user) return null;

  const { applications = [], agreements = [], payments = [], notifications = [] } = driverData;

  // Calculative stats
  const submittedCount = applications.length;
  const approvedCount = applications.filter(a => a.step === 4 || a.status === 'Approved').length;
  const pendingCount = applications.filter(a => a.step === 2 || a.step === 1 || a.status === 'In Progress' || a.status === 'Under Review').length;
  const actionRequiredCount = applications.filter(a => a.step === 3 || a.status === 'Action Required').length;

  const handleSimulatePayment = async (e) => {
    e.preventDefault();
    setPayMessage(null);

    const targetApp = applications.find(a => a.id === selectedAppForPayment);
    if (!targetApp) {
      setPayMessage({ type: 'error', text: 'Select an application reference folder to associate your payment.' });
      return;
    }

    setPayLoading(true);
    try {
      const payload = {
        carName: targetApp.carName,
        amount: Number(payAmount),
        email: user.email,
        method: payMethod,
      };

      await api.payments.create(payload);
      
      // If payment is for a deposit, progress application step when paid successfully
      if (Number(payAmount) >= 200 && targetApp.step === 3) {
        await api.applications.updateStep(targetApp.id, 4);
      }

      setPayMessage({ type: 'success', text: "Payment completed successfully." });
      await syncDriverData();
    } catch (err) {
      setPayMessage({ type: 'error', text: mapFriendlyFeedback(err) });
    } finally {
      setPayLoading(false);
    }
  };

  const handleDocumentUpdate = async (e) => {
    e.preventDefault();
    setDocMessage(null);

    if (!docAppId) {
      setDocMessage({ type: 'error', text: 'No active application selected to replace files.' });
      return;
    }

    setDocLoading(true);
    try {
      await api.applications.updateDocuments(docAppId, {
        drivingLicence: licenseUrl,
        selfieWithId: selfieUrl,
        addressProof: addressUrl
      });

      setDocMessage({ type: 'success', text: 'Driver credentials and file references updated successfully!' });
      await syncDriverData();
    } catch (err) {
      setDocMessage({ type: 'error', text: mapFriendlyFeedback(err) });
    } finally {
      setDocLoading(false);
    }
  };

  const handleProfileSettingsSubmit = async (e) => {
    e.preventDefault();
    setProfileMessage(null);

    if (profilePassword && profilePassword !== profileConfirmPassword) {
      setProfileMessage({ type: 'error', text: 'Credentials password confirmation values mismatch.' });
      return;
    }

    setProfileLoading(true);
    try {
      await updateProfile({
        email: user.email,
        fullName: profileName,
        phone: profilePhone,
        address: profileAddress,
        password: profilePassword
      });

      setProfileMessage({ type: 'success', text: 'Driver settings and contact coordinates stored permanently!' });
      setProfilePassword('');
      setProfileConfirmPassword('');
    } catch (err) {
      setProfileMessage({ type: 'error', text: mapFriendlyFeedback(err) });
    } finally {
      setProfileLoading(false);
    }
  };

  const triggerLogout = async () => {
    await logout();
    navigate('/');
  };

  // Status Badge Builder
  const renderStatusBadge = (status, step) => {
    const STAGES = [
      "Documents Uploaded",      // Step 1
      "Application Submitted",   // Step 2
      "Application Under Review",// Step 3
      "Approved",                // Step 4
      "Deposit Paid",            // Step 5
      "Insurance Uploaded",      // Step 6
      "Vehicle Ready",           // Step 7
      "Collection Scheduled"     // Step 8
    ];
    
    // Normalize status from step or fallback
    let resolvedStatus = status;
    if (step >= 1 && step <= 8) {
      resolvedStatus = STAGES[step - 1];
    } else if (status === 'Pending') {
      resolvedStatus = 'Application Submitted';
    }

    if (status === 'Rejected' || resolvedStatus === 'Rejected') {
      return (
        <span className="flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase leading-none">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
          Rejected - Underwriters
        </span>
      );
    }

    let colorClasses = "bg-brand-primary/10 text-brand-secondary border border-brand-primary/20";
    if (step >= 5) {
      colorClasses = "bg-emerald-50 text-emerald-700 border border-emerald-200";
    } else if (step === 4) {
      colorClasses = "bg-teal-50 text-teal-700 border border-teal-200";
    } else if (step === 3) {
      colorClasses = "bg-indigo-50 text-indigo-700 border border-indigo-200";
    }

    return (
      <span className={`flex items-center gap-1.5 ${colorClasses} text-[10px] font-bold px-2.5 py-1 rounded-full uppercase leading-none`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
        {resolvedStatus || "Submitted"}
      </span>
    );
  };

  // Timeline Step Builder
  const getStepDescription = (step, status) => {
    const descriptions = {
      1: 'Personal & Employer documents successfully compiled & uploaded.',
      2: 'Rent-to-Buy lease request has been submitted to current underwriting queue.',
      3: 'Comprehensive DVLA compliance checks & Soft Credit verify ongoing.',
      4: 'Application approved! Digital lease contract package compiled.',
      5: 'Refundable booking deposit verified. Direct vehicle logistics booked.',
      6: 'Automated fleet motor insurance cover policy activated & logged.',
      7: 'Vehicle mechanical inspections completed. Car prepped & cleaned.',
      8: 'Delivery handover scheduled! Keys ready for collection.'
    };
    return descriptions[step] || status || 'Lease underwriting checks in progress.';
  };

  // Navigation config
  const navItems = [
    { id: 'dashboard', label: 'Dashboard Home', icon: LayoutDashboard },
    { id: 'applications', label: 'My Applications', icon: FileText, badge: submittedCount },
    { id: 'documents', label: 'My Documents', icon: FolderOpen },
    { id: 'payments', label: 'Payments', icon: CreditCard, badge: payments.length > 0 ? null : 'Pending' },
    { id: 'insurance', label: 'Motor Insurance', icon: ShieldCheck },
    { id: 'notifications', label: 'Inbox Notifications', icon: Bell, badge: notifications.length > 0 ? notifications.length : null, badgeColor: 'bg-indigo-600 text-white' },
    { id: 'profile', label: 'Profile Settings', icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans" id="user-dashboard-root">
      
      {/* 1. Dashboard Fixed Compact Header Area (64px Height, Logo Left, Menu Icon Right) */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#000000] text-white flex items-center justify-between px-4 z-50 border-b border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (selectedApp) {
                setSelectedApp(null);
              } else if (activeTab !== 'dashboard') {
                setActiveTab('dashboard');
              } else {
                navigate('/');
              }
            }}
            type="button"
            className="p-1 text-slate-300 hover:text-white transition focus:outline-none cursor-pointer"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-[#7CC242] stroke-[2.5]" />
          </button>

          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-full overflow-hidden border border-white shrink-0 bg-white">
              <img
                src="https://r2-buy-car.vercel.app/logo.jpeg"
                alt="R2 BuyCar Logo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-extrabold tracking-tight text-xs xs:text-sm text-white">Rent2Buy Dashboard</span>
          </div>
        </div>

        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          className="p-1.5 text-slate-300 hover:text-white transition focus:outline-none cursor-pointer"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5 text-red-400" /> : <Menu className="w-5 h-5 text-[#7CC242]" />}
        </button>
      </header>

      {/* Outer Flex Container for Sidebar and Main Content with pt-16 padding layout */}
      <div className="flex flex-1 pt-16" id="dashboard-outer-container">
        
        {/* Sidebar Navigation Drawer */}
        <aside className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-[#0a0f1d] text-slate-300 border-r border-[#1e293b] flex flex-col transition-transform duration-300 ease-in-out md:sticky md:top-16 md:h-[calc(100vh-64px)] md:translate-x-0 pt-16 md:pt-0
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          {/* Driver Profile Summary inside sidebar */}
          <div className="p-4 border-b border-slate-900 bg-slate-950/60 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-brand-primary text-xs shrink-0">
              {user.fullName ? user.fullName.substring(0, 2).toUpperCase() : 'DR'}
            </div>
            <div className="overflow-hidden min-w-0">
              <h4 className="font-bold text-xs text-white truncate leading-none mb-1">{user.fullName || 'Heathrow Driver'}</h4>
              <p className="text-[10px] text-slate-500 truncate lowercase font-mono leading-none">{user.email}</p>
            </div>
          </div>

          {/* Sidebar Nav items */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                    setSelectedApp(null);
                  }}
                  className={`
                    w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-colors text-left group
                    ${isActive 
                      ? 'bg-[#7CC242] text-black font-black shadow-md shadow-[#7CC242]/10' 
                      : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 transition-transform group-hover:scale-105 ${isActive ? 'text-black' : 'text-slate-500 group-hover:text-slate-300'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[9.5px] font-black px-1.5 py-0.5 rounded-full leading-none ${
                      isActive ? 'bg-black text-[#7CC242]' : 'bg-slate-900 text-[#7CC242]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {user.role === 'admin' && (
              <Link
                to="/admin"
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-colors text-left text-amber-400 hover:bg-amber-950/40 hover:text-amber-300 mt-4 border border-amber-900/35"
              >
                <div className="flex items-center space-x-3">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Go to Admin Panel</span>
                </div>
              </Link>
            )}
          </nav>

          {/* Sign out */}
          <div className="p-3 border-t border-slate-900">
            <button
              onClick={triggerLogout}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-bold text-red-400 hover:bg-red-500/10 hover:text-white transition-all text-left"
            >
              <LogOut className="w-4 h-4 text-red-400" />
              <span>Sign Out Profile</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-5 md:p-6 lg:p-8 space-y-4 max-w-7xl mx-auto w-full overflow-hidden">
          
          {/* REAL-TIME DYNAMIC AUTO-ALERTS NOTIFICATION BLOCK */}
          {applications.some(a => a.step === 3) && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex gap-3 text-amber-900 text-xs animate-fade-in -mx-0">
              <AlertCircle className="w-4.5 h-4.5 text-amber-500 shrink-0" />
              <div className="space-y-0.5">
                <strong className="block font-bold">Lease Verification Action Needed</strong>
                <span>
                  Your application requires a downpayment guarantee. Visit the <button onClick={() => setActiveTab('payments')} className="underline font-bold text-amber-950">Payments Section</button> to pay the deposit of £250.00.
                </span>
              </div>
            </div>
          )}

          {applications.some(a => a.step === 4) && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex gap-3 text-emerald-950 text-xs animate-fade-in -mx-0">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
              <div className="space-y-0.5">
                <strong className="block font-bold">Rent-to-Buy Agreement Live & Active!</strong>
                <span>
                  Motor insurance cover successfully logged. Download files in the <button onClick={() => setActiveTab('insurance')} className="underline font-bold text-emerald-950">Motor Insurance Tab</button>.
                </span>
              </div>
            </div>
          )}

          {/* CORE CONDITIONAL VIEWS */}
          
          {/* TAB 1: DASHBOARD OVERVIEW HOME */}
          {activeTab === 'dashboard' && (
            <div className="space-y-4">

              {/* 2. Compact Welcome Card (Height < 100px) */}
              <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-xl p-3 flex flex-row items-center justify-between gap-3 shadow-xs -mx-0">
                <div className="space-y-0.5">
                  <span className="text-[9px] uppercase tracking-widest text-[#7CC242] font-mono leading-none">Heathrow Hub</span>
                  <h1 className="text-sm sm:text-base font-black tracking-tight text-white leading-none">Driver Hub Dashboard</h1>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      syncDriverData();
                      setPayMessage(null);
                      setDocMessage(null);
                      setProfileMessage(null);
                    }}
                    className="flex items-center text-[10.5px] font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors px-2.5 py-1.5 rounded-lg cursor-pointer"
                    title="Refresh Status"
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-1" />
                    <span>Refresh</span>
                  </button>
                  <Link to="/apply">
                    <button className="flex items-center text-[10.5px] font-extrabold bg-[#7CC242] hover:bg-[#6cb135] text-black transition-all px-3 py-1.5 rounded-lg cursor-pointer shadow-xs">
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      <span>Apply Car</span>
                    </button>
                  </Link>
                </div>
              </div>

              {/* 3. Current Application Status & Progress Tracker */}
              {applications.length > 0 ? (
                <div className="bg-white border border-gray-150 rounded-xl p-3.5 shadow-3xs space-y-3 animate-fade-in">
                  <div className="flex justify-between items-center text-xs pb-2 border-b border-gray-100">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                      <span className="font-bold text-slate-800">Status: {applications[0].carName}</span>
                    </div>
                    <span className="font-mono text-indigo-650 font-black">
                      {Math.min(100, Math.max(12, Math.round((applications[0].step / 8) * 100)))}%
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-indigo-650 h-full transition-all duration-500 rounded-full" 
                        style={{ width: `${Math.min(100, Math.max(12, Math.round((applications[0].step / 8) * 100)))}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-[9px] text-slate-400 font-mono font-bold leading-none">
                      <span>Docs</span>
                      <span>Review</span>
                      <span>Approved</span>
                      <span>Ready</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs flex flex-row justify-between items-center gap-2">
                    <p className="text-[11px] text-slate-600 leading-snug">
                      <b>Current Stage:</b> {getStepDescription(applications[0].step, applications[0].status)}
                    </p>

                    {/* Immediate CTA Action Buttons (Apply / Pay / Upload Insurance) */}
                    <div className="shrink-0 flex items-center gap-2">
                      {applications[0].step === 4 && (
                        <button
                          onClick={() => setActiveTab('payments')}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10.5px] uppercase tracking-wider px-3.5 py-1.5 rounded-lg cursor-pointer shadow-3xs transition-all active:scale-95 flex items-center justify-center gap-1.5"
                        >
                          💳 Pay Deposit (£250)
                        </button>
                      )}

                      {applications[0].step === 5 && (
                        <button
                          onClick={() => setActiveTab('insurance')}
                          className="bg-indigo-650 hover:bg-indigo-700 text-white font-extrabold text-[10.5px] uppercase tracking-wider px-3.5 py-1.5 rounded-lg cursor-pointer shadow-3xs transition-all active:scale-95 flex items-center justify-center gap-1.5"
                        >
                          🛡️ Upload Insurance
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* If no applications yet, show a nice quick action card to apply quickly */
                <div className="bg-indigo-50 border border-indigo-150 rounded-xl p-4 text-center space-y-2.5 animate-fade-in">
                  <div className="max-w-md mx-auto">
                    <h3 className="font-extrabold text-sm text-indigo-950">Buy Quickly, Apply Quickly!</h3>
                    <p className="text-xs text-indigo-850 mt-1">
                      Get approved under 24 hours. Start verification by submitting your driver documents of taxi dispatch.
                    </p>
                  </div>
                  <Link to="/apply" className="inline-block">
                    <button className="bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer shadow-3xs transition">
                      Apply Fast Now
                    </button>
                  </Link>
                </div>
              )}

              {/* 4. Mini Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { label: 'Apps', val: submittedCount, color: 'text-indigo-600', bg: 'bg-indigo-50/40' },
                  { label: 'Lease', val: agreements.length, color: 'text-emerald-600', bg: 'bg-emerald-50/40' },
                  { label: 'Review', val: pendingCount, color: 'text-amber-600', bg: 'bg-amber-50/40' },
                  { label: 'Wait', val: actionRequiredCount, color: 'text-rose-600', bg: 'bg-rose-50/40' },
                ].map((card, idx) => (
                  <div key={idx} className="bg-white border border-gray-150 p-2.5 rounded-xl flex items-center gap-3 shadow-3xs">
                    <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center font-black text-xs ${card.color} shrink-0`}>
                      {card.val}
                    </div>
                    <div className="leading-none">
                      <span className="block text-[10px] uppercase font-bold tracking-widest text-[#94a3b8]">{card.label}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 5. Active Vehicle Section */}
              <div className="bg-white border border-gray-150 p-3.5 rounded-xl shadow-3xs space-y-2">
                <div className="flex justify-between items-center pb-1.5 border-b border-gray-100">
                  <h4 className="text-[10px] uppercase font-bold tracking-widest text-slate-400">My Vehicle</h4>
                  {agreements.length > 0 && (
                    <span className="text-[9px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">Active Lease</span>
                  )}
                </div>

                {agreements.length === 0 ? (
                  <div className="flex items-center justify-between text-xs py-1">
                    <span className="text-slate-500 font-medium">No vehicle assigned</span>
                    <Link to="/apply">
                      <button className="bg-indigo-650 hover:bg-indigo-700 transition text-white font-bold text-[10px] px-3 py-1.5 rounded-lg shadow-3xs cursor-pointer">
                        Apply Now
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {agreements.map((agr) => (
                      <div key={agr.id} className="flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-11 h-8 rounded bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                            <img 
                              src={agr.carImage || "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800"} 
                              alt={agr.carName} 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <div className="min-w-0">
                            <h5 className="font-bold text-slate-900 truncate leading-tight">{agr.carName}</h5>
                            <span className="text-[9.5px] text-slate-450 text-slate-500 block">Term: {agr.durationMonths || 12} Mos • £{agr.weeklyRate}/wk</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="block font-mono font-bold text-indigo-650 leading-none mb-0.5">£{agr.weeklyRate || 45}/wk</span>
                          <span className="block text-[9.5px] text-emerald-600 font-bold leading-none">Cleared: £{agr.paidContributions || 45}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 6. Recent Activity Section */}
              <div className="bg-white border border-gray-150 p-3.5 rounded-xl shadow-3xs space-y-2.5" id="recent-activity-card">
                <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                  <h4 className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                    Recent Activity
                  </h4>
                  <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400">Latest Logs</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <span className="text-emerald-600 text-xs font-bold shrink-0">✓</span>
                    <span className="truncate flex-1 font-semibold text-slate-800 text-[11px]">Driver Record Created</span>
                  </div>

                  {applications.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-slate-700">
                      <span className="text-emerald-600 text-xs font-bold shrink-0">✓</span>
                      <span className="truncate flex-1 font-semibold text-slate-800 text-[11px]">{applications[0].carName} Submitted</span>
                    </div>
                  )}

                  {payments.length > 0 ? (
                    <div className="flex items-center gap-2 text-xs text-slate-700">
                      <span className="text-emerald-600 text-xs font-bold shrink-0">✓</span>
                      <span className="truncate flex-1 font-semibold text-slate-800 text-[11px]">Payment Received: £{payments[0].amount}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="text-slate-400 text-xs font-bold shrink-0">•</span>
                      <span className="truncate flex-1 text-slate-400 text-[11px]">No payments issued yet</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 7. Need Help Section */}
              <div className="bg-[#0c111d] border border-slate-800 text-white p-3.5 rounded-xl relative overflow-hidden flex items-center justify-between shadow-xs" id="advisory-hotline-card">
                <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl pointer-events-none"></div>
                <div className="space-y-0.5 relative z-10">
                  <span className="block text-[9.5px] uppercase tracking-wider font-extrabold text-[#7CC242] font-mono leading-none">Need Help?</span>
                  <strong className="block text-xs font-mono tracking-tight text-white leading-tight">+44 7700 900222</strong>
                </div>
                <a href="tel:+447700900222" className="bg-[#7CC242] hover:bg-[#6cb135] text-black text-[10.5px] font-bold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shadow-3xs relative z-10">
                  Call Now
                </a>
              </div>

            </div>
          )}

        {/* TAB 2: MY APPLICATIONS LIST & DETAILED SECTION */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            
            {/* Split details if selected application page is active */}
            {selectedApp ? (
              <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-xs space-y-6 animate-fade-in relative">
                
                {/* Back link */}
                <button 
                  onClick={() => setSelectedApp(null)}
                  className="absolute top-6 right-6 text-xs font-bold text-gray-500 hover:text-slate-800 transition flex items-center border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  Back to submissions list
                </button>

                <div className="space-y-1 max-w-sm sm:max-w-md">
                  <span className="text-[10px] text-indigo-650 bg-indigo-50 px-2 py-0.5 rounded uppercase font-black tracking-wider leading-none">Application Underwriting Record Folder</span>
                  <h3 className="text-xl font-bold tracking-tight text-slate-900 font-sans mt-2">{selectedApp.carName}</h3>
                  <span className="block text-xs text-slate-400 font-mono">Reference Folder ID: {selectedApp.id} • Posted on {selectedApp.dateApplied}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-t border-gray-100 pt-6">
                  
                  {/* Car specifications & credentials */}
                  <div className="lg:col-span-8 space-y-6">
                    
                    {/* Status & progress timeline audit */}
                    <div className="bg-slate-50 border border-slate-150 rounded-2xl p-6 space-y-4">
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-sans">Lease Stage Assessment Timeline</span>
                        {renderStatusBadge(selectedApp.status, selectedApp.step)}
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-center pt-2">
                        {[
                          { step: 1, label: 'Uploaded', desc: 'Documents compiled' },
                          { step: 2, label: 'Submitted', desc: 'Folder received' },
                          { step: 3, label: 'Reviewing', desc: 'DVLA compliance search' },
                          { step: 4, label: 'Approved', desc: 'Lease authorized' },
                          { step: 5, label: 'Deposited', desc: 'Deposit cleared' },
                          { step: 6, label: 'Insured', desc: 'Fleet policy added' },
                          { step: 7, label: 'Prepared', desc: 'Vehicle prepped' },
                          { step: 8, label: 'Schedule', desc: 'Keys ready' }
                        ].map((m) => {
                          const isDone = selectedApp.step >= m.step;
                          const isCurrent = selectedApp.step === m.step;
                          return (
                            <div key={m.step} className="space-y-1 bg-white p-2 border border-slate-100 rounded-xl">
                              <div className={`
                                h-1.5 rounded-full transition-all duration-300
                                ${isDone ? (selectedApp.step >= 5 ? 'bg-emerald-500' : 'bg-indigo-600') : 'bg-gray-200'}
                                ${isCurrent ? 'ring-2 ring-indigo-300 animate-pulse' : ''}
                              `}></div>
                              <span className={`block text-[10px] font-bold ${isDone ? (selectedApp.step >= 5 ? 'text-emerald-700' : 'text-indigo-650') : 'text-gray-400'}`}>{m.label}</span>
                              <span className="block text-[8.5px] text-gray-400 leading-tight hidden md:block">{m.desc}</span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="text-[11px] bg-white border border-gray-150 rounded-xl p-3 text-slate-600">
                        <strong className="block text-slate-900 mb-0.5">Current Progress Tracker Outcome:</strong>
                        <span>{getStepDescription(selectedApp.step, selectedApp.status)}</span>
                      </div>
                    </div>

                    {/* Specifications Highlight info */}
                    <div className="space-y-3">
                      <h4 className="font-bold text-xs text-gray-800 uppercase tracking-wider font-sans">Underwriting Profile Details</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="border border-gray-150 rounded-xl p-4 space-y-1 text-xs">
                          <span className="block text-gray-400 font-semibold font-sans uppercase text-[9.5px]">Soft Credit Checking Result</span>
                          <span className="font-bold text-emerald-600 flex items-center font-mono uppercase">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-1" />
                            {selectedApp.creditCheckStatus || 'PASSED'}
                          </span>
                        </div>

                        <div className="border border-gray-150 rounded-xl p-4 space-y-1 text-xs">
                          <span className="block text-gray-400 font-semibold font-sans uppercase text-[9.5px]">Lease Duration Selected</span>
                          <span className="font-bold text-slate-900">
                            {selectedApp.applyDetails?.durationMonths || '12'} Months Contract Plan
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Uploaded credential doc files view block */}
                    <div className="space-y-3">
                      <h4 className="font-bold text-xs text-gray-800 uppercase tracking-wider font-sans">Submitted Driver Credentials Files</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                          { label: 'Driving Licence (Front)', url: selectedApp.applyDetails?.drivingLicence },
                          { label: 'Driving Licence (Back)', url: selectedApp.applyDetails?.addressProof },
                          { label: 'Selfie Photo', url: selectedApp.applyDetails?.selfieWithId }
                        ].map((doc, idx) => (
                          <div key={idx} className="border border-gray-150 rounded-2xl p-4.5 bg-slate-50/50 space-y-3 flex flex-col justify-between">
                            <span className="block font-sans font-bold text-xs text-gray-800 truncate">{doc.label}</span>
                            <div className="w-full h-24 bg-slate-200 border border-slate-350 rounded-lg overflow-hidden relative group flex items-center justify-center">
                              {doc.url ? (
                                <>
                                  <img src={getImageUrl(doc.url)} alt={doc.label} className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                                    <a href={getImageUrl(doc.url)} target="_blank" rel="noopener noreferrer" className="p-1 px-2.5 rounded bg-white text-slate-900 font-bold text-[10px] uppercase shadow-xs flex items-center">
                                      <Eye className="w-3 h-3 mr-1" /> View Full
                                    </a>
                                  </div>
                                </>
                              ) : (
                                <span className="text-gray-400 text-xs font-mono">Not Uploaded</span>
                              )}
                            </div>
                            {doc.url ? (
                              <a href={getImageUrl(doc.url)} download className="block text-center text-[10px] font-bold text-indigo-600 hover:underline">
                                Download File Attachment
                              </a>
                            ) : (
                              <span className="block text-center text-[10px] font-bold text-slate-400">No Attachment Available</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Underwriter internal annotations and support desk */}
                  <div className="lg:col-span-4 bg-slate-50 border border-slate-150 rounded-2xl p-5 space-y-4">
                    <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider font-sans flex items-center">
                      <Info className="w-3.5 h-3.5 text-indigo-650 mr-1.5" />
                      Office Underwriter Annotations
                    </h4>
                    
                    <div className="space-y-3.5 text-xs">
                      <div className="bg-white border border-gray-150 p-4 rounded-xl space-y-1.5">
                        <span className="text-[9.5px] uppercase font-bold tracking-wider text-slate-400">Agent Note ID #0429</span>
                        <p className="text-gray-650 leading-relaxed font-sans text-xs">
                          "References matched successfully with the UK DVLA drivers database. Soft income statements verification checks show balanced salary inflows. Approved subject to lease downpayment security fee."
                        </p>
                        <span className="block text-[10px] text-brand-primary font-bold font-mono text-right">- Heathrow Lead Underwriter</span>
                      </div>

                      {selectedApp.step === 3 && (
                        <div className="bg-brand-secondary border border-slate-900 text-brand-primary p-4.5 rounded-xl space-y-3">
                          <h5 className="font-bold text-xs text-brand-primary">Guaranteed Lease Approval Billing</h5>
                          <p className="text-[11px] text-slate-300 leading-normal">
                             Excellent! Standard eligibility threshold passed successfully. Finalize underwriting by submitting your deposit billing contribution (£250.00).
                          </p>
                          <button 
                            onClick={() => {
                              setSelectedAppForPayment(selectedApp.id);
                              setActiveTab('payments');
                            }}
                            className="w-full bg-brand-primary text-brand-secondary hover:bg-brand-primary-hover transition font-bold py-1.5 rounded-lg text-[11px] uppercase focus:outline-none cursor-pointer"
                          >
                            Pay Lease Deposit (£250) Now
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

              </div>
            ) : (
              <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-xs space-y-4">
                <div>
                  <h3 className="font-sans font-black text-slate-900 text-base leading-none">Underwriting Lease Submissions Folder</h3>
                  <p className="text-xs text-slate-500 mt-1 font-sans">Verify, audit, or follow standard stage assessment milestones for applied vehicles.</p>
                </div>

                {applications.length === 0 ? (
                  <div className="text-center py-12 space-y-4">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto" />
                    <div className="max-w-md mx-auto space-y-1">
                      <h4 className="font-bold text-sm text-gray-800">No underwriting applied folders found.</h4>
                      <p className="text-xs text-gray-500">
                        You have not filed a rent-to-buy lease underwriting folder.
                      </p>
                    </div>
                    <Link to="/apply">
                      <button className="bg-brand-primary text-brand-secondary font-black text-xs px-5 py-2.5 rounded-xl hover:bg-brand-primary-hover transition">
                        Select a Car and Apply Now
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto" id="user-applications-list">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-450 font-bold uppercase tracking-wider text-[10px]">
                          <th className="py-3 px-4">Application ID</th>
                          <th className="py-3 px-4">Vehicle Name</th>
                          <th className="py-3 px-4">Submission Date</th>
                          <th className="py-3 px-4">Current Status</th>
                          <th className="py-3 px-4">Payment Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-sans text-xs">
                        {[...applications]
                          .sort((a, b) => {
                            const dateA = new Date(a.createdAt || a.dateApplied || 0);
                            const dateB = new Date(b.createdAt || b.dateApplied || 0);
                            return dateB - dateA;
                          })
                          .map((app) => (
                            <tr key={app.id} className="hover:bg-slate-50/50 transition">
                              <td className="py-3.5 px-4 font-mono font-bold text-indigo-900">
                                {app.id}
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="font-bold text-gray-900 text-sm leading-snug">{app.carName}</div>
                              </td>
                              <td className="py-3.5 px-4 font-mono text-slate-600">{app.dateApplied || 'N/A'}</td>
                              <td className="py-3.5 px-4">
                                <div className="space-y-1">
                                  {renderStatusBadge(app.status, app.step)}
                                  <span className="block text-[10px] text-slate-500 font-bold font-mono">Stage {app.step}/8 completed</span>
                                </div>
                              </td>
                              <td className="py-3.5 px-4">
                                {(() => {
                                  if (app.step >= 5) {
                                    return (
                                      <span className="inline-flex items-center px-2 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                                        Deposit Paid
                                      </span>
                                    );
                                  }
                                  if (app.step === 4) {
                                    return (
                                      <span className="inline-flex items-center px-2 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 animate-pulse">
                                        Awaiting Deposit
                                      </span>
                                    );
                                  }
                                  return (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-[11px] font-semibold bg-gray-150 text-gray-650">
                                      N/A
                                    </span>
                                  );
                                })()}
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <button
                                  onClick={() => setSelectedApp(app)}
                                  className="inline-flex items-center text-xs font-bold font-sans bg-slate-900 text-white hover:bg-slate-800 transition px-3.5 py-1.5 rounded-lg focus:outline-none cursor-pointer"
                                >
                                  View Details
                                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

          </div>
        )}

        {/* TAB 3: MY DOCUMENTS SECTION */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            
            <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-xs space-y-6">
              <div>
                <h3 className="font-sans font-black text-slate-900 text-base leading-none">Underwriting Driving Identity & Credentials</h3>
                <p className="text-xs text-slate-500 mt-1 font-sans">Verify,replace or download your currently uploaded credentials. Underwriters require clear files to authorize Heathrow dispatch.</p>
              </div>

              {/* Replace documents form */}
              {applications.length === 0 ? (
                <div className="text-center py-10 space-y-4">
                  <FolderOpen className="w-12 h-12 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-500">You must file an underwriting lease application before manager or re-uploading driver documents files.</p>
                  <Link to="/apply">
                    <button className="bg-brand-primary text-brand-secondary font-black text-xs px-4 py-2 rounded-xl hover:bg-brand-primary-hover">Apply First</button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* Current Files list on left */}
                  <div className="lg:col-span-7 space-y-5">
                    <h4 className="font-bold text-xs text-gray-800 uppercase tracking-wider font-sans">Current Folder Uploads</h4>

                    <div className="space-y-4">
                      {[
                        { 
                          label: 'UK Driving Licence Copy', 
                          field: 'drivingLicence',
                          url: licenseUrl || "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=80&w=800",
                          desc: 'Full colored photograph displaying your standard driver license front face and signature.' 
                        },
                        { 
                          label: 'Proof of Address Document', 
                          field: 'addressProof',
                          url: addressUrl || "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800",
                          desc: 'Utility bills description, electricity invoices, bank statements or UK council tax bills dated past 3 months.' 
                        },
                        { 
                          label: 'Security Selfie Verification Check', 
                          field: 'selfieWithId',
                          url: selfieUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
                          desc: 'Liveness checking photograph displaying your face adjacent to your driver licence document.' 
                        }
                      ].map((item, index) => (
                        <div key={index} className="border border-gray-150 rounded-2xl p-5 bg-slate-50/40 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                          <div className="space-y-2 max-w-sm">
                            <span className="block font-sans font-bold text-sm text-slate-900">{item.label}</span>
                            <p className="text-[11px] text-slate-450 leading-relaxed leading-normal">{item.desc}</p>
                            <span className="inline-flex items-center font-bold text-[10px] text-indigo-650 bg-indigo-50 px-2 py-0.5 rounded uppercase">
                              <Check className="w-3 h-3 mr-1" /> ACTIVE FILE PREVIEW
                            </span>
                          </div>
                          
                          <div className="shrink-0 space-y-2 w-full sm:w-auto text-center">
                            <div className="w-24 h-16 bg-slate-200 border border-slate-350 rounded-lg mx-auto overflow-hidden relative group">
                              <img src={item.url} alt={item.label} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                                <a href={item.url} target="_blank" rel="noopener noreferrer" className="bg-white p-1 rounded font-black text-[9px] uppercase text-slate-900">Preview</a>
                              </div>
                            </div>
                            <div className="flex justify-center gap-2">
                              <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-indigo-650 hover:underline">View</a>
                              <span className="text-gray-300">•</span>
                              <a href={item.url} download className="text-[10px] font-bold text-gray-500 hover:underline">Download</a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Re-upload document editor form right */}
                  <div className="lg:col-span-5 bg-slate-50 border border-slate-150 rounded-2xl p-6.5 space-y-4">
                    <div>
                      <h4 className="font-bold text-xs text-gray-800 uppercase tracking-wider font-sans">Replace / Update File Links</h4>
                      <p className="text-[11px] text-gray-500 mt-1">Submit clean visual replacements for underwriter reassessment desks.</p>
                    </div>

                    {docMessage && (
                      <div className={`text-xs p-3 rounded-lg border font-medium ${
                        docMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'
                      }`}>
                        {docMessage.text}
                      </div>
                    )}

                    <form onSubmit={handleDocumentUpdate} className="space-y-4">
                      <div>
                        <label className="block text-[10px] text-slate-450 uppercase font-bold tracking-wider mb-1">Select Application Link</label>
                        <select
                          value={docAppId}
                          onChange={(e) => setDocAppId(e.target.value)}
                          className="w-full text-xs font-semibold py-2 px-2.5 border border-gray-250 rounded-lg bg-white"
                        >
                          {applications.map((app) => (
                            <option key={app.id} value={app.id}>{app.carName} (ID: {app.id})</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-455 uppercase font-bold tracking-wider mb-1">Driving Licence Photograph URL</label>
                        <input
                          type="url"
                          value={licenseUrl}
                          onChange={(e) => setLicenseUrl(e.target.value)}
                          className="w-full text-xs py-2 px-2.5 border border-gray-250 bg-white rounded-lg focus:outline-none focus:border-indigo-600 font-mono"
                          placeholder="Licence visual URL coordinates..."
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-455 uppercase font-bold tracking-wider mb-1">Selfie Verification Photograph URL</label>
                        <input
                          type="url"
                          value={selfieUrl}
                          onChange={(e) => setSelfieUrl(e.target.value)}
                          className="w-full text-xs py-2 px-2.5 border border-gray-250 bg-white rounded-lg focus:outline-none focus:border-indigo-600 font-mono"
                          placeholder="Selfie verification URL coordinates..."
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-455 uppercase font-bold tracking-wider mb-1">Mailing Address Proof Photograph URL</label>
                        <input
                          type="url"
                          value={addressUrl}
                          onChange={(e) => setAddressUrl(e.target.value)}
                          className="w-full text-xs py-2 px-2.5 border border-gray-250 bg-white rounded-lg focus:outline-none focus:border-indigo-600 font-mono"
                          placeholder="Electricity bill / statement URL..."
                          required
                        />
                      </div>

                      <div className="pt-2">
                        <Button
                          type="submit"
                          variant="primary"
                          size="md"
                          className="w-full text-xs font-bold"
                          disabled={docLoading}
                        >
                          {docLoading ? 'Updating credentials folder...' : 'Save & Overwrite Documents'}
                        </Button>
                      </div>
                    </form>
                  </div>

                </div>
              )}

            </div>

          </div>
        )}

        {/* TAB 4: PAYMENTS LEDGER */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Logged Transactions Ledger */}
              <div className="lg:col-span-8 bg-white border border-gray-150 rounded-2xl p-6 shadow-xs space-y-4">
                <div>
                  <h3 className="font-sans font-black text-slate-900 text-base leading-none">Standard contributions dues history</h3>
                  <p className="text-xs text-slate-500 mt-1 font-sans">Trace historic deposit downpayments and weekly lease contribution statement tallies.</p>
                </div>

                {payments.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-xs">
                    No payments logs generated yet. Clear your underwriting deposit invoice on the right to start logs.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse font-sans">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-400 font-bold uppercase tracking-wider text-[10.1px]">
                          <th className="py-3 px-4">Transaction Date</th>
                          <th className="py-3 px-4">Associated Vehicle</th>
                          <th className="py-3 px-4">Method</th>
                          <th className="py-3 px-4 text-right">Fund Cleared</th>
                          <th className="py-3 px-4 text-center">Receipt Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {payments.map((pt) => (
                          <tr key={pt.id} className="hover:bg-slate-50/50 transition font-medium text-xs">
                            <td className="py-3 px-4 font-mono text-slate-500">{pt.date || 'Today'}</td>
                            <td className="py-3 px-4 text-slate-900 font-bold">{pt.carName}</td>
                            <td className="py-3 px-4 font-mono text-slate-450">{pt.method}</td>
                            <td className="py-3 px-4 text-right font-black text-indigo-650">£{pt.amount}.00</td>
                            <td className="py-3 px-4 text-center">
                              <span className="bg-emerald-50 text-emerald-700 tracking-tight text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-150 uppercase">
                                {pt.status || 'Successful'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Right Column: Active Deposit Invoice check & simulated transaction button */}
              <div className="lg:col-span-4 bg-white border border-gray-150 p-6 rounded-2xl shadow-xs space-y-4">
                <div className="border-b border-gray-100 pb-3">
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-amber-500 bg-amber-50 px-2 py-0.5 rounded inline-block mb-1.5">Guaranteed Secure</span>
                  <h4 className="font-sans font-black text-sm text-gray-950 flex items-center">
                    <CreditCard className="w-4.5 h-4.5 text-indigo-650 mr-1.5" />
                    Secure deposit payment desk
                  </h4>
                  <p className="text-[11px] text-gray-500 leading-normal mt-1">Submit your rent-to-buy vehicle deposit booking (£250.00) to release standard motor insurance covers.</p>
                </div>

                {payMessage && (
                  <div className={`text-xs p-3 rounded-xl border font-semibold ${
                    payMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-150' : 'bg-red-50 text-red-700 border-red-150'
                  }`}>
                    {payMessage.text}
                  </div>
                )}

                {/* Filter applications needing deposit */}
                {applications.length === 0 ? (
                  <div className="text-center py-6 text-xs text-slate-500">
                    Apply for a lease stock vehicle to prepare booking downpayment invoices.
                  </div>
                ) : (
                  <form onSubmit={handleSimulatePayment} className="space-y-4">
                    <div>
                      <label className="block text-[10px] text-slate-450 uppercase font-black mb-1.5 tracking-wider">Select Lease Vehicle</label>
                      <select
                        value={selectedAppForPayment}
                        onChange={(e) => {
                          setSelectedAppForPayment(e.target.value);
                          const app = applications.find(a => a.id === e.target.value);
                          if (app && app.step === 3) {
                            setPayAmount('250'); // standard deposit
                          } else {
                            setPayAmount('50'); // weekly rental contribution
                          }
                        }}
                        className="w-full text-xs font-semibold py-2 px-2.5 border border-gray-250 rounded-lg bg-white"
                      >
                        {applications.map((app) => (
                          <option key={app.id} value={app.id}>
                            {app.carName} {app.step === 3 ? '(Deposit Required)' : `(Stage ${app.step})`}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-450 uppercase font-black mb-1.5 tracking-wider">Required Deposit Billing Dues</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs select-none">£</span>
                        <input
                          type="number"
                          value={payAmount}
                          onChange={(e) => setPayAmount(e.target.value)}
                          className="w-full text-xs font-mono font-bold pl-7 pr-2.5 py-2.5 border border-gray-250 rounded-lg"
                          min="5"
                          max="2000"
                          placeholder="Select dues..."
                          required
                        />
                      </div>
                      <span className="block text-[9.5px] text-gray-400 leading-tight mt-1.5">
                        * Standard Rent-to-Buy deposit is <b>£250.00</b> (Stage 3). Weekly rent contribution is <b>£50.00</b>.
                      </span>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-450 uppercase font-black mb-1.5 tracking-wider">Payment Channel Selection</label>
                      <select
                        value={payMethod}
                        onChange={(e) => setPayMethod(e.target.value)}
                        className="w-full text-xs font-semibold py-2 px-2 border border-gray-250 rounded-lg bg-white"
                      >
                        <option value="Debit Card">Debit / Credit Card</option>
                        <option value="Direct Debit">BACS Direct Debit</option>
                        <option value="Bank Transfer">UK Faster Payments Bank Transfer</option>
                      </select>
                    </div>

                    {/* Standard Invoice breakdown widget */}
                    <div className="bg-slate-50 border border-slate-150 p-3.5 rounded-xl text-[11px] text-slate-600 space-y-2">
                      <strong className="block text-slate-900 border-b border-gray-200 pb-1.5 uppercase tracking-wide text-[9.5px]">Deposit Downpayment Invoice Details</strong>
                      <div className="flex justify-between">
                        <span>Vehicles Security Deposit:</span>
                        <span className="font-mono">£250.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Underwriters Document processing:</span>
                        <span className="text-emerald-600 font-bold uppercase text-[9.5px]">Free</span>
                      </div>
                      <div className="flex justify-between text-slate-900 font-bold pt-1.5 border-t border-dashed border-gray-200">
                        <span>Cleared Total:</span>
                        <span className="font-mono text-brand-secondary">£{payAmount}.00</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={payLoading}
                      className="w-full bg-brand-primary hover:bg-brand-primary-hover transition text-brand-secondary font-black py-2.5 rounded-xl text-xs uppercase cursor-pointer shadow-sm"
                    >
                      {payLoading ? 'Processing Secure Clearance...' : `Pay Invoice (£${payAmount}.00) Now`}
                    </button>
                  </form>
                )}

              </div>

            </div>

          </div>
        )}

        {/* TAB 5: MOTOR INSURANCE SECTION */}
        {activeTab === 'insurance' && (
          <div className="space-y-6">
            
            <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-xs space-y-6">
              
              <div className="border-b border-gray-100 pb-4">
                <h3 className="font-sans font-black text-slate-900 text-base leading-none">Motor Insurance Verification Copy</h3>
                <p className="text-xs text-slate-500 mt-1 font-sans">Once downpayments are cleared, our underwriting brokers dispatch Heathrow-accredited road cover certificates.</p>
              </div>

              {/* Check if any approved stage 4 application exists */}
              {!applications.some(a => a.step === 4) ? (
                <div className="text-center py-12 max-w-lg mx-auto space-y-4">
                  <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center border border-amber-100 mx-auto text-amber-505">
                    <AlertTriangle className="w-6 h-6 text-amber-500" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-gray-800">Insurance Cover Pending Underwriting Approval</h4>
                    <p className="text-xs text-gray-500 leading-normal">
                      Automated motor insurance certificates are restricted to <b>Stage 4: Approved</b> drivers. Submit your deposit billing of £250.00 to activate the policy.
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('payments')} 
                    className="bg-brand-primary text-brand-secondary font-black text-xs px-4.5 py-2 rounded-xl hover:bg-brand-primary-hover transition-colors shadow-xs"
                  >
                    Go To Payments & Clear Deposit
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Insurance high fidelity readable certificate simulation */}
                  <div className="lg:col-span-8 bg-slate-950 text-slate-100 rounded-3xl p-6 md:p-8 relative overflow-hidden border border-slate-900 space-y-6 shadow-xl">
                    
                    {/* Glowing Accent vector badge */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-brand-primary/10 rounded-full blur-3xl pointers-event-none"></div>

                    {/* Header */}
                    <div className="flex justify-between items-start border-b border-slate-800 pb-5">
                      <div className="space-y-1.5">
                        <span className="text-[10px] uppercase font-black tracking-widest text-brand-primary font-mono">Certificate of Motor Insurance</span>
                        <h4 className="text-lg md:text-xl font-bold tracking-tight text-white leading-none">R2B HEATHROW FLEET INSURANCE GROUP</h4>
                        <span className="block text-[9.5px] text-slate-500 font-medium">Underwritten by Sentinel UK Brokers Mutual Group Co.</span>
                      </div>
                      <div className="w-14 h-14 border border-dashed border-brand-primary/30 rounded-2xl flex items-center justify-center font-mono text-center text-[10px] leading-none text-brand-primary font-extrabold uppercase shrink-0 p-1">
                        SECURE road tax OK
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                      This certificate serves as official notice that the designated Heathrow driver affiliate holds active, fully underwritten road and taxi dispatch cover complying strictly with the UK Road Traffic Act 1988 (Sub-clause 4).
                    </p>

                    {/* Specifications breakdown */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 pt-3 border-t border-slate-900">
                      
                      <div className="space-y-1">
                        <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-bold">Policy Number</span>
                        <span className="block font-mono text-white text-xs font-extrabold">UK-R2B-92801-HTW</span>
                      </div>

                      <div className="space-y-1">
                        <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-bold">Active Driver Member</span>
                        <span className="block text-white text-xs font-bold font-sans">{user.fullName || 'Registered Partner'}</span>
                      </div>

                      <div className="space-y-1">
                        <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-bold">Designated Leased Vehicle</span>
                        <span className="block text-brand-primary text-xs font-bold truncate">
                          {applications.find(a => a.step === 4)?.carName || 'Approved Rental Fleet Unit'}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-bold">Validity / Cover Class</span>
                        <span className="block text-white text-xs font-semibold">Comprehensive (Includes Ride-Hail/Taxi extension)</span>
                      </div>

                      <div className="space-y-1">
                        <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-bold">Effective Coverage Start</span>
                        <span className="block text-emerald-400 text-xs font-bold font-mono">Today (Fully Cleared)</span>
                      </div>

                      <div className="space-y-1">
                        <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-bold">Underwriters Seal Verification</span>
                        <span className="block text-brand-primary text-xs font-bold flex items-center">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-brand-primary" />
                          VERIFIED SECURITY STAMP
                        </span>
                      </div>

                    </div>

                    {/* Signature block footer */}
                    <div className="border-t border-slate-900 pt-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-slate-500 font-sans">
                      <div>
                        <span>Issuing Officer Signature: </span>
                        <span className="font-serif italic font-bold text-slate-400 tracking-wider">C. Sentinel (Chairman)</span>
                      </div>
                      <div className="text-right">
                        <span>Assigned Region Coordinates: <b>Heathrow, London HQ</b></span>
                      </div>
                    </div>

                  </div>

                  {/* Actions right */}
                  <div className="lg:col-span-4 bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4">
                    <h4 className="font-bold text-xs text-gray-800 uppercase tracking-wider font-sans">Policy Actions</h4>
                    <p className="text-[11px] text-gray-500 leading-normal">
                      Need physical printouts for your taxi dispatch office? Download high-definition PDF certificates.
                    </p>

                    <div className="space-y-2 pt-2.5">
                      <button 
                        onClick={() => alert("Simulating download: Certificate of Motor Insurance 'UK-R2B-92801-HTW.pdf' downloaded successfully!")}
                        className="w-full flex items-center justify-center bg-brand-primary text-brand-secondary font-black text-xs px-4 py-2.5 rounded-xl hover:bg-brand-primary-hover transition focus:outline-none cursor-pointer shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5 mr-1.5" />
                        Download Certificate (PDF)
                      </button>

                      <button 
                        onClick={() => alert("Simulating print: Road Cover details forwarded to your printer.")}
                        className="w-full flex items-center justify-center bg-white text-gray-750 border border-gray-250 font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-gray-50 transition focus:outline-none cursor-pointer"
                      >
                        Print Road Cover Certificate
                      </button>
                    </div>

                    <div className="border-t border-gray-200/80 pt-3.5 text-[10.5px] text-gray-500 space-y-2 leading-relaxed">
                      <strong className="block text-slate-900 uppercase tracking-wide text-[9.5px]">Important Notice for Ride-Hailing:</strong>
                      <p>
                        Uber, Bolt, or Transport for London (TfL) require uploading this exact Certificate of Insurance to clear your private hire drivers account status.
                      </p>
                    </div>
                  </div>

                </div>
              )}

            </div>

          </div>
        )}

        {/* TAB 5b: INBOX NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-xs space-y-6 relative animate-fade-in">
              <div className="border-b border-gray-100 pb-4">
                <h3 className="font-sans font-black text-slate-900 text-base leading-none flex items-center justify-between">
                  <span>Driver Message Center Inbox</span>
                  <span className="text-[10px] font-bold text-indigo-650 bg-indigo-50 px-2.5 py-0.5 rounded uppercase tracking-wider">{notifications.length} message(s)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-sans">Official advisories, dispatch certifications releases, and underwriting reports issued to your profile account.</p>
              </div>

              {notifications.length === 0 ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-400 border border-slate-150 animate-pulse">
                    <Bell className="w-6 h-6 text-slate-400" />
                  </div>
                  <div className="max-w-md mx-auto space-y-1">
                    <h4 className="font-bold text-sm text-gray-800">Your dispatch inbox is currently quiet.</h4>
                    <p className="text-xs text-gray-400 leading-normal">
                      When London Heathrow underwriting coordinates progress or billing schedules update, your administrative notification transcripts will list here in real-time.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 space-y-4">
                  {notifications.map((notif, idx) => (
                    <div key={notif.id || idx} className="pt-4 first:pt-0 hover:bg-slate-50/20 transition rounded-xl">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border border-slate-150 bg-slate-50/55 p-4 rounded-t-xl">
                        <div className="space-y-1">
                          <strong className="block text-sm text-slate-900 font-bold tracking-tight">{notif.subject}</strong>
                          <div className="flex items-center gap-2 text-[10px] text-gray-450 font-mono">
                            <span>Sent: {notif.dateSent || (notif.createdAt && new Date(notif.createdAt).toLocaleDateString()) || 'Recent'}</span>
                          </div>
                        </div>
                        {notif.attachmentUrl && (
                          <a 
                            href={notif.attachmentUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center text-[10px] font-extrabold text-[#1F3F7A] bg-[#1F3F7A]/10 border border-[#1F3F7A]/30 hover:bg-[#1F3F7A]/20 transition px-2.5 py-1 rounded-lg shrink-0 cursor-pointer"
                          >
                            <Download className="w-3 h-3 mr-1" /> Download Attachment
                          </a>
                        )}
                      </div>
                      <div className="text-xs text-slate-650 bg-white border-x border-b border-slate-150 p-4 rounded-b-xl whitespace-pre-wrap font-sans font-medium leading-relaxed">
                        {notif.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: PROFILE CONFIGURATION */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            
            <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-xs space-y-6">
              
              <div className="border-b border-gray-100 pb-4">
                <h3 className="font-sans font-black text-slate-900 text-base leading-none">Personal Account Settings</h3>
                <p className="text-xs text-slate-500 mt-1 font-sans">Update your contact information, physical billing address coordinates, or modify account password.</p>
              </div>

              {profileMessage && (
                <div className={`text-xs p-3.5 rounded-xl border font-bold ${
                  profileMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-150' : 'bg-red-50 text-red-700 border-red-150'
                }`}>
                  {profileMessage.text}
                </div>
              )}

              <form onSubmit={handleProfileSettingsSubmit} className="space-y-6 max-w-2xl font-sans text-xs">
                
                {/* Visual grid row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-450 uppercase font-black tracking-wider">Full Legal Name</label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full text-xs py-2 px-2.5 border border-gray-250 bg-white rounded-lg focus:outline-none focus:border-indigo-650"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-450 uppercase font-black tracking-wider">Account Email (Immutable)</label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full text-xs py-2 px-2.5 border border-gray-200 bg-gray-50 text-gray-400 rounded-lg cursor-not-allowed font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-450 uppercase font-black tracking-wider">UK Contact Telephone</label>
                    <input
                      type="tel"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      placeholder="+44 7700 900077"
                      className="w-full text-xs py-2 px-2.5 border border-gray-250 bg-white rounded-lg focus:outline-none focus:border-indigo-650"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-450 uppercase font-black tracking-wider">Primary Residential Address</label>
                    <input
                      type="text"
                      value={profileAddress}
                      onChange={(e) => setProfileAddress(e.target.value)}
                      placeholder="Street, Town, Postcode"
                      className="w-full text-xs py-2 px-2.5 border border-gray-250 bg-white rounded-lg focus:outline-none focus:border-indigo-650"
                    />
                  </div>
                </div>

                {/* Password reset sub-block */}
                <div className="bg-slate-50 border border-slate-150 p-5 rounded-2xl space-y-4">
                  <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center">
                    <Lock className="w-3.5 h-3.5 text-slate-500 mr-2" />
                    Modify Driver Password Settings
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] text-slate-450 uppercase font-bold tracking-wider">New Password</label>
                      <input
                        type="password"
                        value={profilePassword}
                        onChange={(e) => setProfilePassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full text-xs py-2 px-2.5 bg-white border border-gray-250 rounded-lg focus:outline-none focus:border-indigo-650"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] text-slate-450 uppercase font-bold tracking-wider">Confirm New Password</label>
                      <input
                        type="password"
                        value={profileConfirmPassword}
                        onChange={(e) => setProfileConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full text-xs py-2 px-2.5 bg-white border border-gray-250 rounded-lg focus:outline-none focus:border-indigo-650"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={profileLoading}
                    className="text-xs font-bold px-6 py-2 rounded-xl"
                  >
                    {profileLoading ? 'Writing setting files...' : 'Save Profile Changes'}
                  </Button>
                </div>

              </form>

            </div>

          </div>
        )}

      </main>

    </div>
  </div>
  );
}
