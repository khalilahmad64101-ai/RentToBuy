import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Button } from '../components/ui/Button';
import { Loader } from '../components/ui/Loader';
import { 
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

export function Dashboard() {
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

  const { applications = [], agreements = [], payments = [] } = driverData;

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

      setPayMessage({ type: 'success', text: `Successful deposit billing of £${payAmount} logged on our Heathrow servers!` });
      await syncDriverData();
    } catch (err) {
      setPayMessage({ type: 'error', text: err.message || 'Payment simulation failed.' });
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
      setDocMessage({ type: 'error', text: err.message || 'Document coordinates change failed.' });
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
      setProfileMessage({ type: 'error', text: err.message || 'Settings write operation failed.' });
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
    if (step === 4 || status === 'Approved') {
      return (
        <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase leading-none">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          Approved / Active
        </span>
      );
    }
    if (step === 3 || status === 'Action Required') {
      return (
        <span className="flex items-center gap-1.5 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase leading-none">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          Action Required
        </span>
      );
    }
    if (status === 'Rejected') {
      return (
        <span className="flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase leading-none">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
          Rejected - Underwriters
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase leading-none">
        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
        Under Review
      </span>
    );
  };

  // Timeline Step Builder
  const getStepDescription = (step, status) => {
    if (step === 1) return 'Personal & Employer details validation';
    if (step === 2) return 'Driving Licencing authentication & soft search ongoing';
    if (step === 3) return 'Disclosures uploaded. Awaiting deposit downpayment clearing';
    if (step === 4) return 'Eligibility Approved! Lease Active, insurance certificate ready';
    return status;
  };

  // Navigation config
  const navItems = [
    { id: 'dashboard', label: 'Dashboard Home', icon: LayoutDashboard },
    { id: 'applications', label: 'My Applications', icon: FileText, badge: submittedCount },
    { id: 'documents', label: 'My Documents', icon: FolderOpen },
    { id: 'payments', label: 'Payments', icon: CreditCard, badge: payments.length > 0 ? null : 'Pending' },
    { id: 'insurance', label: 'Motor Insurance', icon: ShieldCheck },
    { id: 'profile', label: 'Profile Settings', icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans" id="user-dashboard-root">
      
      {/* Mobile Header Nav */}
      <div className="md:hidden bg-slate-900 border-b border-slate-800 text-white p-4 flex justify-between items-center z-40 sticky top-0">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-sm">R</div>
          <span className="font-extrabold tracking-tight text-sm">Rent2Buy Drivers Dashboard</span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          className="p-1 text-slate-400 hover:text-white transition focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Layout */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 text-slate-300 border-r border-slate-900 flex flex-col transition-transform duration-300 ease-in-out md:sticky md:top-0 md:h-screen md:translate-x-0
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Container */}
        <div className="p-6 border-b border-slate-900 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-white text-base shadow-lg shadow-indigo-600/30">
              R
            </div>
            <div>
              <span className="block font-black tracking-tight text-white leading-none text-sm uppercase">Rent2Buy Leases</span>
              <span className="block text-[10px] text-slate-500 font-medium tracking-wider mt-1">DRIVER DASHBOARD</span>
            </div>
          </div>
          {/* Close Menu Button on Mobile */}
          <button onClick={() => setMobileMenuOpen(false)} className="md:hidden text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Driver Profile Summary */}
        <div className="p-5 border-b border-slate-900/80 bg-slate-950/60 flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center font-black text-indigo-400 text-sm">
            {user.fullName ? user.fullName.substring(0, 2).toUpperCase() : 'DR'}
          </div>
          <div className="overflow-hidden min-w-0">
            <h4 className="font-bold text-xs text-white truncate leading-none mb-1">{user.fullName || 'Heathrow Driver'}</h4>
            <p className="text-[10px] text-slate-500 truncate lowercase font-mono">{user.email}</p>
          </div>
        </div>

        {/* Nav Items List */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
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
                    ? 'bg-indigo-650 text-white font-bold' 
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-105 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[9.5px] font-black px-2 py-0.5 rounded-full uppercase leading-none ${
                    isActive ? 'bg-indigo-700 text-white' : 'bg-slate-900 text-indigo-400'
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

        {/* Logout widget */}
        <div className="p-4 border-t border-slate-900">
          <button
            onClick={triggerLogout}
            className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-xs font-bold text-red-400 hover:bg-red-500/10 hover:text-white transition-all text-left"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span>Sign Out Profile</span>
          </button>
        </div>
      </aside>

      {/* Main Right Area */}
      <main className="flex-1 p-6 md:p-8 space-y-6 max-w-7xl mx-auto w-full overflow-hidden">
        
        {/* Sync & Support Header Panel */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-white border border-gray-150 rounded-2xl shadow-xs gap-4 animate-fade-in" id="workspace-sub-header">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-wider">Heathrow Terminus</span>
              <span className="text-xs text-gray-400">• Fully Underwritten Plan</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight mt-1 font-sans">
              Driver Hub: {navItems.find(n => n.id === activeTab)?.label}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                syncDriverData();
                setPayMessage(null);
                setDocMessage(null);
                setProfileMessage(null);
              }}
              className="flex items-center text-xs font-bold bg-white text-gray-700 border border-gray-250 hover:bg-gray-50 focus:outline-none transition-colors px-3 py-1.5 rounded-xl cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-indigo-600" />
              Pulse Re-sync
            </button>
            <Link to="/apply">
              <button className="flex items-center text-xs font-bold bg-slate-950 text-white hover:bg-slate-900 focus:outline-none transition-all px-4 py-1.5 rounded-xl cursor-pointer shadow-xs">
                <Plus className="w-3.5 h-3.5 mr-1" />
                Apply Car
              </button>
            </Link>
          </div>
        </div>

        {/* REAL-TIME DYNAMIC AUTO-ALERTS NOTIFICATION BLOCK */}
        {applications.some(a => a.step === 3) && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-900 text-xs animate-fade-in">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
            <div className="space-y-1">
              <strong className="block font-bold">Lease Verification Action Needed: Welcome Premium Approved</strong>
              <span>
                Your rent-to-buy application requires a downpayment guarantee. Visit the <button onClick={() => setActiveTab('payments')} className="underline font-bold text-amber-950">Payments Section</button> to pay the lease deposit of £250.00 and release your vehicle.
              </span>
            </div>
          </div>
        )}

        {applications.some(a => a.step === 4) && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex gap-3 text-emerald-900 text-xs animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <div className="space-y-1">
              <strong className="block font-bold">Rent-to-Buy Agreement Live & Fully Active!</strong>
              <span>
                Congratulations! Standard motor insurance covers have been dispatched to your files folder. Download certificates directly inside the <button onClick={() => setActiveTab('insurance')} className="underline font-bold text-emerald-950">Motor Insurance Tab</button>.
              </span>
            </div>
          </div>
        )}

        {/* CORE CONDITIONAL VIEWS */}
        
        {/* TAB 1: DASHBOARD OVERVIEW HOME */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Stats Cards Section */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-gray-150 p-5 rounded-2xl shadow-xs space-y-2">
                <div className="flex justify-between items-center text-gray-400">
                  <span className="text-[10px] uppercase font-bold tracking-wider font-sans">Applications Submitted</span>
                  <FileText className="w-4 h-4 text-slate-400" />
                </div>
                <div className="text-2xl font-black text-slate-900">{submittedCount}</div>
                <div className="text-[11px] text-slate-500">Global applied files</div>
              </div>

              <div className="bg-white border border-gray-150 p-5 rounded-2xl shadow-xs space-y-2">
                <div className="flex justify-between items-center text-emerald-500">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-450 font-sans">Approved Leases</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-2xl font-black text-emerald-600">{approvedCount}</div>
                <div className="text-[11px] text-slate-500">Approved agreements</div>
              </div>

              <div className="bg-white border border-gray-150 p-5 rounded-2xl shadow-xs space-y-2">
                <div className="flex justify-between items-center text-indigo-500">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-450 font-sans">Processing Folders</span>
                  <Activity className="w-4 h-4 text-indigo-500" />
                </div>
                <div className="text-2xl font-black text-indigo-600">{pendingCount}</div>
                <div className="text-[11px] text-slate-500">Under review indices</div>
              </div>

              <div className="bg-white border border-gray-150 p-5 rounded-2xl shadow-xs space-y-2">
                <div className="flex justify-between items-center text-amber-500">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-455 font-sans">Action Prone</span>
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-2xl font-black text-amber-600">{actionRequiredCount}</div>
                <div className="text-[11px] text-slate-500">Awaiting deposit</div>
              </div>
            </div>

            {/* Split layout: Selected Active Car Detail and Latest status audit */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Primary Active Lease View */}
              <div className="lg:col-span-8 bg-white border border-gray-150 rounded-2xl p-6 shadow-xs space-y-5">
                <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center justify-between">
                  <span>My Active Vehicle Leases ({agreements.length})</span>
                  <Link to="/cars" className="text-xs text-indigo-600 hover:underline">Browse fleet stock</Link>
                </h3>

                {agreements.length === 0 ? (
                  <div className="text-center py-10 space-y-4">
                    <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-400 border border-slate-100">
                      <Layers className="w-6 h-6" />
                    </div>
                    <div className="max-w-md mx-auto space-y-1">
                      <h4 className="font-bold text-sm text-gray-800">No live Rent-to-Buy lease assigned yet.</h4>
                      <p className="text-xs text-gray-500 leading-normal">
                        Submit a lease application to get accredited by our underwriting team. Once approved, your active vehicle lease shows up here.
                      </p>
                    </div>
                    <Link to="/apply">
                      <button className="bg-indigo-600 text-white font-bold text-xs px-5 py-2 rounded-xl mt-2 hover:bg-indigo-700 transition">
                        Start New Underwriting Apply
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {agreements.map((agr) => (
                      <div key={agr.id} className="border border-gray-150 rounded-2xl p-5 bg-gradient-to-r from-white to-slate-50/50 flex flex-col md:flex-row gap-5 items-start md:items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-20 h-14 bg-slate-100 border border-slate-200 rounded-xl overflow-hidden shrink-0">
                            <img 
                              src={agr.carImage || "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800"} 
                              alt={agr.carName} 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono text-indigo-650 bg-indigo-50 font-black px-2 py-0.5 rounded leading-none uppercase inline-block">Rent-to-Buy Agreement Active</span>
                            <h4 className="font-black text-sm text-gray-900 font-sans tracking-tight">{agr.carName}</h4>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-405 text-slate-500 font-medium font-sans">
                              <span className="flex items-center"><Calendar className="w-3 h-3 mr-1 text-slate-400" /> Term: <b>{agr.durationMonths || 12} Mos</b></span>
                              <span>•</span>
                              <span>Started: <b>{agr.startDate}</b></span>
                            </div>
                          </div>
                        </div>

                        <div className="flex md:flex-col justify-between w-full md:w-auto md:text-right border-t md:border-t-0 border-slate-100 pt-3 md:pt-0">
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Weekly Rates</span>
                            <strong className="block text-indigo-650 text-base font-black font-mono">£{agr.weeklyRate || 45}/wk</strong>
                          </div>
                          <div className="md:mt-2 text-right">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Total Cleared</span>
                            <span className="block text-emerald-600 font-bold text-xs">£{agr.paidContributions || 45} Paid</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Activity Log & Notifications panel */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Underwriter Advisory Contact Desk */}
                <div className="bg-slate-900 border border-slate-950 text-white p-5 rounded-2xl relative overflow-hidden space-y-3 shadow-md shadow-slate-950/20">
                  <span className="text-[9px] uppercase tracking-wider font-extrabold text-indigo-400 block bg-indigo-950/60 font-mono w-max px-2.5 py-0.5 rounded">Advisory Hotline</span>
                  <h4 className="font-sans font-black text-sm tracking-tight">Heathrow Processing Desk</h4>
                  <p className="text-[11px] text-slate-400 leading-normal">
                    Do you have enquiries about your rent-to-buy lease eligibility or want to process manual documents uploads? Talk directly to processing desks.
                  </p>
                  <div className="border-t border-slate-800/80 pt-3 flex justify-between items-center text-[11px] text-slate-300">
                    <span className="font-mono">Inquiries Line</span>
                    <strong className="text-white bg-indigo-650 px-2.5 py-1 rounded">+44 7700 900222</strong>
                  </div>
                </div>

                {/* Notifications Module */}
                <div className="bg-white border border-gray-150 p-5 rounded-2xl shadow-xs space-y-3.5">
                  <h4 className="font-bold text-xs text-gray-800 uppercase tracking-wider font-sans flex items-center justify-between">
                    <span>Recent Activity Feed</span>
                    <Bell className="w-3.5 h-3.5 text-indigo-600" />
                  </h4>

                  <div className="space-y-3">
                    <div className="flex gap-2.5 items-start text-xs text-gray-600 border-b border-gray-50 pb-2.5">
                      <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 shrink-0"></div>
                      <div>
                        <p className="font-semibold text-gray-900">Driver registration record created</p>
                        <span className="text-[10px] text-gray-400 font-mono mt-0.5 block">Status: Completed</span>
                      </div>
                    </div>

                    {applications.length > 0 && (
                      <div className="flex gap-2.5 items-start text-xs text-gray-600 border-b border-gray-50 pb-2.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0"></div>
                        <div>
                          <p className="font-semibold text-gray-900">Application applied: {applications[0].carName}</p>
                          <span className="text-[10px] text-gray-400 font-mono mt-0.5 block">Logged on standard files</span>
                        </div>
                      </div>
                    )}

                    {payments.length > 0 && (
                      <div className="flex gap-2.5 items-start text-xs text-gray-600">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0"></div>
                        <div>
                          <p className="font-semibold text-gray-900">Secured rent billing contribution: £{payments[0].amount}</p>
                          <span className="text-[10px] text-gray-400 font-mono mt-0.5 block">{payments[0].method}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>

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

                      <div className="grid grid-cols-4 gap-2 text-center pt-2">
                        {[
                          { step: 1, label: 'Validation', desc: 'Personal details checks' },
                          { step: 2, label: 'Licencing', desc: 'DVLA credential scan' },
                          { step: 3, label: 'Deposit', desc: 'Secure fee clearance' },
                          { step: 4, label: 'Accredited', desc: 'Agreement issued' }
                        ].map((m) => {
                          const isDone = selectedApp.step >= m.step;
                          const isCurrent = selectedApp.step === m.step;
                          return (
                            <div key={m.step} className="space-y-1">
                              <div className={`
                                h-1.5 rounded-full transition-all duration-300
                                ${isDone ? 'bg-indigo-600' : 'bg-gray-200'}
                                ${isCurrent ? 'ring-2 ring-indigo-300 animate-pulse' : ''}
                              `}></div>
                              <span className={`block text-[10px] font-bold ${isDone ? 'text-indigo-650' : 'text-gray-400'}`}>{m.label}</span>
                              <span className="block text-[8px] text-gray-400 leading-tight hidden sm:block">{m.desc}</span>
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
                        <span className="block text-[10px] text-indigo-600 font-bold font-mono text-right">- Heathrow Lead Underwriter</span>
                      </div>

                      {selectedApp.step === 3 && (
                        <div className="bg-indigo-900 border border-indigo-950 text-indigo-100 p-4.5 rounded-xl space-y-3">
                          <h5 className="font-bold text-xs text-white">Guaranteed Lease Approval Billing</h5>
                          <p className="text-[11px] text-indigo-300 leading-normal">
                            Excellent! Standard eligibility threshold passed successfully. Finalize underwriting by submitting your deposit billing contribution (£250.00).
                          </p>
                          <button 
                            onClick={() => {
                              setSelectedAppForPayment(selectedApp.id);
                              setActiveTab('payments');
                            }}
                            className="w-full bg-white text-indigo-900 hover:bg-slate-50 transition font-bold py-1.5 rounded-lg text-[11px] uppercase focus:outline-none cursor-pointer"
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
                      <button className="bg-indigo-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition">
                        Select a Car and Apply Now
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200/80 text-slate-450 font-bold uppercase tracking-wider text-[10px]">
                          <th className="py-3 px-4">Applied Vehicle specs</th>
                          <th className="py-3 px-4">Filing Date</th>
                          <th className="py-3 px-4">Soft Credit checks</th>
                          <th className="py-3 px-4">Status & Step</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-sans text-xs">
                        {applications.map((app) => (
                          <tr key={app.id} className="hover:bg-slate-50/50 transition">
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-gray-900 text-sm leading-snug">{app.carName}</div>
                              <div className="text-[10px] text-gray-400 font-mono mt-0.5">Reference ID: {app.id}</div>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-slate-600">{app.dateApplied}</td>
                            <td className="py-3.5 px-4">
                              <span className="flex items-center text-emerald-600 font-bold tracking-wide">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-1 shrink-0" />
                                {app.creditCheckStatus || 'PASSED'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="space-y-1">
                                {renderStatusBadge(app.status, app.step)}
                                <span className="block text-[10px] text-slate-500 font-bold font-mono">Stage {app.step}/4 completed</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => setSelectedApp(app)}
                                className="inline-flex items-center text-xs font-bold font-sans bg-slate-900 text-white hover:bg-slate-800 transition px-3.5 py-1.5 rounded-lg focus:outline-none cursor-pointer"
                              >
                                View Folder Page 
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
                    <button className="bg-indigo-650 text-white font-bold text-xs px-4 py-2 rounded-xl">Apply First</button>
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
                        <span className="font-mono text-indigo-650">£{payAmount}.00</span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={payLoading}
                      className="w-full bg-indigo-650 hover:bg-indigo-700 transition text-white font-bold py-2.5 rounded-xl text-xs uppercase cursor-pointer"
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
                    className="bg-indigo-650 text-white font-bold text-xs px-4.5 py-2 rounded-xl"
                  >
                    Go To Payments & Clear Deposit
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Insurance high fidelity readable certificate simulation */}
                  <div className="lg:col-span-8 bg-slate-950 text-slate-100 rounded-3xl p-6 md:p-8 relative overflow-hidden border border-slate-900 space-y-6 shadow-xl">
                    
                    {/* Glowing Accent vector badge */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointers-event-none"></div>

                    {/* Header */}
                    <div className="flex justify-between items-start border-b border-slate-800 pb-5">
                      <div className="space-y-1.5">
                        <span className="text-[10px] uppercase font-black tracking-widest text-indigo-400 font-mono">Certificate of Motor Insurance</span>
                        <h4 className="text-lg md:text-xl font-bold tracking-tight text-white leading-none">R2B HEATHROW FLEET INSURANCE GROUP</h4>
                        <span className="block text-[9.5px] text-slate-500 font-medium">Underwritten by Sentinel UK Brokers Mutual Group Co.</span>
                      </div>
                      <div className="w-14 h-14 border border-dashed border-indigo-500/30 rounded-2xl flex items-center justify-center font-mono text-center text-[10px] leading-none text-indigo-400 font-extrabold uppercase shrink-0 p-1">
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
                        <span className="block text-indigo-400 text-xs font-bold truncate">
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
                        <span className="block text-indigo-300 text-xs font-bold flex items-center">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-indigo-400" />
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
                        className="w-full flex items-center justify-center bg-indigo-650 text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition focus:outline-none cursor-pointer"
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
  );
}
