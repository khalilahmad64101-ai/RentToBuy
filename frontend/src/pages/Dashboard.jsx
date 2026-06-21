import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
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
  AlertCircle, 
  CheckCircle2, 
  Bell
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSEO } from '../hooks/useSEO';

// Reusable Sub-sections import
import { DashboardHero } from '../sections/dashboard/DashboardHero';
import { ActiveLeaseSection } from '../sections/dashboard/ActiveLeaseSection';
import { ActivitySection } from '../sections/dashboard/ActivitySection';
import { SupportSection } from '../sections/dashboard/SupportSection';

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

  // Simple Insurance Upload Helper state
  const [insuranceFile, setInsuranceFile] = useState(null);
  const [insuranceUploadSuccess, setInsuranceUploadSuccess] = useState(false);
  const [insuranceUploading, setInsuranceUploading] = useState(false);

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

  const submittedCount = applications.length;

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

  const clearAllMessages = () => {
    setPayMessage(null);
    setDocMessage(null);
    setProfileMessage(null);
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
    { id: 'payments', label: 'Payments', icon: payments.length > 0 ? null : 'Pending' },
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
            <DashboardHero
              user={user}
              driverData={driverData}
              syncDriverData={syncDriverData}
              setActiveTab={setActiveTab}
              getStepDescription={getStepDescription}
              clearAllMessages={clearAllMessages}
            />
          )}

          {/* TAB 2: MY APPLICATIONS LIST & DETAILED SECTION */}
          {activeTab === 'applications' && (
            <ActiveLeaseSection
              applications={applications}
              selectedApp={selectedApp}
              setSelectedApp={setSelectedApp}
              setDocAppId={setDocAppId}
              setActiveTab={setActiveTab}
              renderStatusBadge={renderStatusBadge}
              getStepDescription={getStepDescription}
              getImageUrl={getImageUrl}
            />
          )}

          {/* TAB 3: MY DOCUMENTS SECTION */}
          {activeTab === 'documents' && (
            <ActivitySection
              applications={applications}
              docAppId={docAppId}
              setDocAppId={setDocAppId}
              licenseUrl={licenseUrl}
              setLicenseUrl={setLicenseUrl}
              selfieUrl={selfieUrl}
              setSelfieUrl={setSelfieUrl}
              addressUrl={addressUrl}
              setAddressUrl={setAddressUrl}
              docMessage={docMessage}
              docLoading={docLoading}
              handleDocumentUpdate={handleDocumentUpdate}
            />
          )}

          {/* SUPPORT SECTIONS AND TABS (Payments, Insurance, Notifications, Profile) */}
          <SupportSection
            activeTab={activeTab}
            user={user}
            applications={applications}
            notifications={notifications}
            
            // Payments
            payMessage={payMessage}
            payLoading={payLoading}
            payAmount={payAmount}
            setPayAmount={setPayAmount}
            payMethod={payMethod}
            setPayMethod={setPayMethod}
            selectedAppForPayment={selectedAppForPayment}
            setSelectedAppForPayment={setSelectedAppForPayment}
            handleSimulatePayment={handleSimulatePayment}

            // Insurance
            insuranceUploadSuccess={insuranceUploadSuccess}
            insuranceFile={insuranceFile}
            setInsuranceFile={setInsuranceFile}
            insuranceUploading={insuranceUploading}
            setInsuranceUploading={setInsuranceUploading}
            setInsuranceUploadSuccess={setInsuranceUploadSuccess}
            api={api}
            syncDriverData={syncDriverData}

            // Profile
            profileMessage={profileMessage}
            profileLoading={profileLoading}
            profileName={profileName}
            setProfileName={setProfileName}
            profilePhone={profilePhone}
            setProfilePhone={setProfilePhone}
            profileAddress={profileAddress}
            setProfileAddress={setProfileAddress}
            profilePassword={profilePassword}
            setProfilePassword={setProfilePassword}
            profileConfirmPassword={profileConfirmPassword}
            setProfileConfirmPassword={setProfileConfirmPassword}
            handleProfileSettingsSubmit={handleProfileSettingsSubmit}
          />

        </main>

      </div>
    </div>
  );
}
