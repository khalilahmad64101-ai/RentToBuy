import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Button } from '../components/ui/Button';
import { Loader } from '../components/ui/Loader';
import { 
  Gauge, 
  Car, 
  FileSearch, 
  Users, 
  CreditCard, 
  Mail, 
  MessageSquare, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit2, 
  CheckCircle, 
  XCircle, 
  Lock, 
  Unlock, 
  Globe,
  Settings, 
  Search, 
  FileText, 
  RefreshCw, 
  Sliders, 
  ShieldAlert, 
  Upload, 
  Activity, 
  Briefcase, 
  Clock, 
  User,
  ExternalLink,
  ChevronRight,
  PlusCircle,
  TrendingUp,
  MailOpen,
  Send,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export function Admin() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      return url;
    }
    const apiBase = import.meta.env.VITE_API_URL || '';
    return `${apiBase.replace(/\/$/, '')}${url}`;
  };

  // Active Admin Sidebar Tab selector
  const [activeTab, setActiveTab] = useState('dashboard');

  // Cars Management sub-views: 'list', 'add', 'edit'
  const [carViewMode, setCarViewMode] = useState('list');
  const [selectedCar, setSelectedCar] = useState(null);

  // Master records synchronised from backend DB
  const [systemRecords, setSystemRecords] = useState({
    users: [],
    applications: [],
    agreements: [],
    payments: [],
    cars: [],
    emails: [],
    inquiries: []
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [sysAlert, setSysAlert] = useState(null);

  // Cars Management form states
  const [carName, setCarName] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carPrice, setCarPrice] = useState('45');
  const [carDeposit, setCarDeposit] = useState('150');
  const [carFuel, setCarFuel] = useState('Hybrid');
  const [carTransmission, setCarTransmission] = useState('Automatic');
  const [carEconomy, setCarEconomy] = useState('65 mpg');
  const [carYear, setCarYear] = useState('2024');
  const [carMileage, setCarMileage] = useState('15,000 miles');
  const [carImage, setCarImage] = useState('https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800');
  const [carImages, setCarImages] = useState(Array(10).fill(''));
  const [carDescription, setCarDescription] = useState('This fuel-efficient EV vehicle is primed and prepared for Heathrow Airport dispatch networks. Includes servicing logs and active road tax profiles.');
  const [carStatus, setCarStatus] = useState('Available');

  // Underwriting Inspection selection
  const [selectedApp, setSelectedApp] = useState(null);
  const [docChecks, setDocChecks] = useState({
    drivingLicence: false,
    addressProof: false,
    selfie: false
  });
  const [auditNotes, setAuditNotes] = useState('');

  // Email Composer states
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');

  // Insurance Uploader state
  const [insuranceTargetEmail, setInsuranceTargetEmail] = useState('');
  const [insurancePolicyUrl, setInsurancePolicyUrl] = useState('https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800');

  // Trigger loading master data records
  const fetchAllData = async () => {
    setIsLoading(true);
    setSysAlert(null);
    try {
      const resp = await api.admin.getAllRecords();
      setSystemRecords(resp);
      
      // Auto-configure default drivers options if empty
      if (resp.users && resp.users.length > 0) {
        const firstUser = resp.users.find(u => u.role !== 'admin') || resp.users[0];
        setEmailTo(firstUser.email);
        setInsuranceTargetEmail(firstUser.email);
      }
    } catch (err) {
      console.error("Error loading system logs:", err);
      setSysAlert({ type: 'error', text: 'Error synching data records with persistent storage. Check backend directories.' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=admin');
      return;
    }
    if (user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchAllData();
  }, [user, navigate]);

  // Handle Logout Trigger
  const handleLogoutClick = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout issues:', err);
    }
  };

  // 1. CAR MANAGEMENT CONTROLLERS
  const startAddCar = () => {
    setSelectedCar(null);
    setCarName('');
    setCarModel('');
    setCarPrice('45');
    setCarDeposit('150');
    setCarFuel('Hybrid');
    setCarTransmission('Automatic');
    setCarEconomy('65 mpg');
    setCarYear('2024');
    setCarMileage('15,000 miles');
    setCarImage('https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800');
    setCarImages(Array(10).fill(''));
    setCarDescription('Fuel efficient electric hybrid primed and checked for prompt Heathrow delivery networks. Includes full breakdown protection and road taxes.');
    setCarStatus('Available');
    setCarViewMode('add');
  };

  const startEditCar = (car) => {
    setSelectedCar(car);
    setCarName(car.name || '');
    setCarModel(car.model || '');
    setCarPrice(String(car.weeklyRate || car.price || '45'));
    setCarDeposit(String(car.deposit || '150'));
    setCarFuel(car.fuel || 'Hybrid');
    setCarTransmission(car.transmission || 'Automatic');
    setCarEconomy(car.economy || '65 mpg');
    setCarYear(car.year || '2024');
    setCarMileage(car.mileage || '15,000 miles');
    setCarImage(car.image || 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800');
    
    // Format existing images or fallback to empty strings
    const existingImgs = Array.isArray(car.images) && car.images.length > 0 ? car.images : [];
    const formattedImgs = Array(10).fill('').map((_, idx) => existingImgs[idx] || '');
    setCarImages(formattedImgs);

    setCarDescription(car.description || '');
    setCarStatus(car.status || 'Available');
    setCarViewMode('edit');
  };

  const handleCarFormSubmit = async (e) => {
    e.preventDefault();
    setSysAlert(null);
    if (!carName || !carModel) {
      setSysAlert({ type: 'error', text: 'Please fill name and model specifications parameters.' });
      return;
    }

    const payload = {
      name: carName,
      model: carModel,
      price: Number(carPrice),
      weeklyRate: Number(carPrice),
      deposit: Number(carDeposit),
      fuel: carFuel,
      transmission: carTransmission,
      economy: carEconomy,
      year: carYear,
      mileage: carMileage,
      image: carImage,
      images: carImages.filter(img => img.trim() !== ''), // Filter out empty strings
      description: carDescription,
      status: carStatus
    };

    try {
      if (carViewMode === 'edit' && selectedCar) {
        await api.admin.editCar(selectedCar.id, payload);
        setSysAlert({ type: 'success', text: `Specs edited successfully for target vehicle "${carName}"!` });
      } else {
        await api.admin.addCar(payload);
        setSysAlert({ type: 'success', text: `New EV listing "${carName}" registered to fleet inventory database!` });
      }
      setCarViewMode('list');
      await fetchAllData();
    } catch (err) {
      setSysAlert({ type: 'error', text: err.message || 'Action on fleet roster rejected by server.' });
    }
  };

  const handleDeleteCar = async (carId) => {
    if (!window.confirm("Verify Deletion: Permanently prune this EV from global lists?")) return;
    setSysAlert(null);
    try {
      await api.admin.deleteCar(carId);
      setSysAlert({ type: 'success', text: 'Vehicle listing successfully pruned!' });
      await fetchAllData();
    } catch (err) {
      setSysAlert({ type: 'error', text: err.message || 'Vehicle pruning rejected.' });
    }
  };

  const handleToggleCarStatus = async (car) => {
    const nextStatus = car.status === 'Available' ? 'Unavailable' : 'Available';
    try {
      await api.admin.editCar(car.id, { status: nextStatus });
      setSysAlert({ type: 'info', text: `Vehicle "${car.name}" status switched to ${nextStatus}.` });
      await fetchAllData();
    } catch (err) {
      setSysAlert({ type: 'error', text: 'Failed to update vehicle availability.' });
    }
  };

  // 2. LEASE APPLICATION MANUAL WORKFLOW CONTROLLERS
  const startInspectApp = (app) => {
    setSelectedApp(app);
    setDocChecks({
      drivingLicence: app.documentChecks?.drivingLicence || false,
      addressProof: app.documentChecks?.addressProof || false,
      selfie: app.documentChecks?.selfie || false
    });
    setAuditNotes(app.notes || '');
  };

  const handleSaveAppVerification = async (newStatus, stepNum) => {
    if (!selectedApp) return;
    setSysAlert(null);
    try {
      await api.admin.updateApplicationStatus(selectedApp.id, {
        status: newStatus,
        step: stepNum,
        documentChecks: docChecks,
        notes: auditNotes
      });
      setSysAlert({ type: 'success', text: `Underwriting dossier ID ${selectedApp.id} updated permanently to Status: ${newStatus} (Stage ${stepNum})!` });
      setSelectedApp(null);
      await fetchAllData();
    } catch (err) {
      setSysAlert({ type: 'error', text: err.message || 'Underwriting folder submission fail.' });
    }
  };

  // 3. USER MANAGEMENT CONTROLLERS
  const handleToggleBlockUser = async (email, currentBlocked) => {
    setSysAlert(null);
    try {
      const nextBlocked = !currentBlocked;
      await api.admin.blockUser(email, nextBlocked);
      setSysAlert({ type: 'info', text: `Member "${email}" credentials access ${nextBlocked ? 'SUSPENDED' : 'RESTORED'} successfully!` });
      await fetchAllData();
    } catch (err) {
      setSysAlert({ type: 'error', text: 'Failed to toggle member block access state.' });
    }
  };

  const handleDeleteUser = async (email) => {
    if (!window.confirm(`Critical Warn: Completely purge profile records for ${email}? This action is irreversible.`)) return;
    setSysAlert(null);
    try {
      await api.admin.deleteUser(email);
      setSysAlert({ type: 'success', text: 'Member profile records permanently purged.' });
      await fetchAllData();
    } catch (err) {
      setSysAlert({ type: 'error', text: err.message || 'Clear profile action denied.' });
    }
  };

  // 4. PAYMENTS BOOKKEEPING
  const handleVerifyManualPayment = async (payId) => {
    setSysAlert(null);
    try {
      await api.admin.verifyPayment(payId);
      setSysAlert({ type: 'success', text: 'Payment transaction confirmed. Reflected on driver dashboard & contracts ledger.' });
      await fetchAllData();
    } catch (err) {
      setSysAlert({ type: 'error', text: 'Fail to approve payment.' });
    }
  };

  // 5. EMAIL DIRECT DISPATCH CONTROLLER
  const handleSendManualEmail = async (e) => {
    e.preventDefault();
    if (!emailTo || !emailSubject || !emailContent) {
      setSysAlert({ type: 'error', text: 'Complete email recipient and content fields first.' });
      return;
    }
    setSysAlert(null);
    try {
      await api.admin.sendEmail({
        userEmail: emailTo,
        subject: emailSubject,
        content: emailContent
      });
      setSysAlert({ type: 'success', text: `Mail notification dispatched to recipient driver: ${emailTo}!` });
      setEmailSubject('');
      setEmailContent('');
      await fetchAllData();
    } catch (err) {
      setSysAlert({ type: 'error', text: 'Could not queue system email.' });
    }
  };

  // 6. INSURANCE MANAGEMENT POLICY COMMISSION
  const handleUploadInsuranceAction = async (e) => {
    e.preventDefault();
    if (!insuranceTargetEmail || !insurancePolicyUrl) {
      setSysAlert({ type: 'error', text: 'Provide driver identifier and policy URL specs.' });
      return;
    }
    setSysAlert(null);
    try {
      await api.admin.uploadInsurance({
        userEmail: insuranceTargetEmail,
        insuranceCopyUrl: insurancePolicyUrl
      });
      setSysAlert({ type: 'success', text: `Official Fleet Motor Policy uploaded & mailed to driver user: ${insuranceTargetEmail}!` });
      await fetchAllData();
    } catch (err) {
      setSysAlert({ type: 'error', text: 'Failed compiling motor policy files attachment.' });
    }
  };

  // Calculations for KPI metric cards
  const totalCarsCount = systemRecords.cars?.length || 0;
  const totalAppsCount = systemRecords.applications?.length || 0;
  const pendingAppsCount = systemRecords.applications?.filter(a => ['In Progress', 'Under Review', 'Action Required'].includes(a.status) || a.step < 4).length || 0;
  const approvedAppsCount = systemRecords.applications?.filter(a => a.status === 'Approved' || a.step === 4).length || 0;
  const rejectedAppsCount = systemRecords.applications?.filter(a => a.status === 'Rejected').length || 0;
  const totalRevenue = systemRecords.payments?.reduce((tot, current) => tot + (Number(current.amount) || 0), 0) || 0;

  // Render navigation style class helper
  const sidebarBtnClass = (tabName) => {
    const isSelected = activeTab === tabName;
    return `w-full flex items-center space-x-3.5 px-4.5 py-3 rounded-xl text-xs font-bold transition duration-150 ${
      isSelected 
        ? 'bg-amber-500 text-gray-950 font-black shadow-lg shadow-amber-500/10' 
        : 'text-slate-400 hover:bg-slate-850 hover:text-slate-100'
    }`;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row font-sans" id="master-admin-control-room">
      
      {/* LEFT SIDEBAR COHESIVE NAVIGATION RAIL */}
      <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-800 shrink-0 flex flex-col justify-between" id="navigation-sidebar-rail">
        <div className="p-6">
          <div className="flex items-center space-x-2.5 mb-8 border-b border-slate-850 pb-5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-gray-950 shrink-0">
              <ShieldAlert className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="block text-[15.5px] font-black text-white tracking-tight">HEATHROW HQ</span>
              <span className="block text-[8.5px] uppercase text-amber-500 font-bold tracking-widest leading-0">Administration</span>
            </div>
          </div>

          <nav className="space-y-1.5" id="sidebar-tabs-list">
            <button 
              onClick={() => { setActiveTab('dashboard'); setSysAlert(null); }} 
              className={sidebarBtnClass('dashboard')}
              id="sidebar-btn-dashboard"
            >
              <Gauge className="w-4 h-4" />
              <span>Dashboard Home</span>
            </button>

            <button 
              onClick={() => { setActiveTab('cars'); setSysAlert(null); setCarViewMode('list'); }} 
              className={sidebarBtnClass('cars')}
              id="sidebar-btn-cars"
            >
              <Car className="w-4 h-4" />
              <span>Cars Management</span>
            </button>

            <button 
              onClick={() => { setActiveTab('applications'); setSysAlert(null); setSelectedApp(null); }} 
              className={sidebarBtnClass('applications')}
              id="sidebar-btn-applications"
            >
              <FileSearch className="w-4 h-4" />
              <span className="flex-1 text-left">Applications Queue</span>
              {pendingAppsCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-red-500 text-white font-mono font-bold text-[9px] flex items-center justify-center animate-pulse">
                  {pendingAppsCount}
                </span>
              )}
            </button>

            <button 
              onClick={() => { setActiveTab('users'); setSysAlert(null); }} 
              className={sidebarBtnClass('users')}
              id="sidebar-btn-users"
            >
              <Users className="w-4 h-4" />
              <span>User Profiles</span>
            </button>

            <button 
              onClick={() => { setActiveTab('payments'); setSysAlert(null); }} 
              className={sidebarBtnClass('payments')}
              id="sidebar-btn-payments"
            >
              <CreditCard className="w-4 h-4" />
              <span>Payments Ledger</span>
            </button>

            <button 
              onClick={() => { setActiveTab('emails'); setSysAlert(null); }} 
              className={sidebarBtnClass('emails')}
              id="sidebar-btn-emails"
            >
              <Mail className="w-4 h-4" />
              <span>System Communications</span>
            </button>

            <button 
              onClick={() => { setActiveTab('settings'); setSysAlert(null); }} 
              className={sidebarBtnClass('settings')}
              id="sidebar-btn-settings"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Inquiries Inbox</span>
              {systemRecords.inquiries?.length > 0 && (
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                  {systemRecords.inquiries.length}
                </span>
              )}
            </button>

            <Link
              to="/dashboard"
              className="w-full flex items-center space-x-3.5 px-4.5 py-3 rounded-xl text-xs font-bold text-indigo-400 hover:bg-slate-800 hover:text-indigo-300 transition duration-150 mt-4 border border-indigo-950/40"
              id="sidebar-btn-go-to-portal"
            >
              <ExternalLink className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Go to Driver Portal</span>
            </Link>
          </nav>
        </div>

        {/* BOTTOM LOGOUT RAIL PROFILE DETAILS */}
        <div className="p-5 border-t border-slate-850 bg-slate-960">
          <div className="flex items-center space-x-3 mb-4.5 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-amber-500">
              AD
            </div>
            <div className="min-w-0">
              <strong className="block text-xs text-white truncate font-sans">{user?.fullName || 'General Admin'}</strong>
              <span className="block text-[10px] text-slate-400 font-mono truncate">{user?.email}</span>
            </div>
          </div>
          <button 
            onClick={handleLogoutClick}
            className="w-full flex items-center justify-center space-x-2 text-xs text-red-450 hover:text-red-400 hover:bg-red-500/5 py-2.5 px-4 rounded-xl font-bold transition"
            id="sidebar-btn-logout"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* RIGHT WORKSPACE BLOCK */}
      <main className="flex-1 flex flex-col min-w-0" id="main-content-panel">
        
        {/* UPPER TOPBAR ACTIONS PANEL */}
        <header className="h-16 border-b border-slate-800 bg-slate-950/40 backdrop-blur px-6 flex items-center justify-between" id="topbar-actions-panel">
          <div className="flex items-center space-x-3">
            <span className="text-slate-400 text-xs font-mono">LOCATION: /root/admin/{activeTab}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase">Database Synchronised Live</span>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={fetchAllData}
              className="p-1 px-3 text-[11px] font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-755 border border-slate-700/60 rounded-lg flex items-center space-x-1.5 transition"
              title="Refresh DB Roster"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Db Synch</span>
            </button>

            <div className="h-5 w-px bg-slate-850"></div>
            
            <span className="text-xs text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800 font-semibold text-center">
              Active Control Console
            </span>
          </div>
        </header>

        {/* BOTTOM REAL ADHERENT VIEW CONTENT */}
        <div className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          
          {/* Global Dashboard Alert banners if present */}
          {sysAlert && (
            <div className={`p-4 rounded-xl border text-xs font-bold font-sans flex items-center justify-between shadow-lg animate-fade-in ${
              sysAlert.type === 'success' 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                : sysAlert.type === 'error'
                  ? 'bg-red-500/15 text-red-400 border-red-500/20'
                  : 'bg-sky-500/10 text-sky-400 border-sky-500/20'
            }`} id="hud-system-notification-hud">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 shrink-0" />
                <span>{sysAlert.text}</span>
              </div>
              <button onClick={() => setSysAlert(null)} className="text-sm p-1 ml-4 hover:opacity-75 tracking-widest text-white">✖</button>
            </div>
          )}

          {isLoading ? (
            <div className="py-24 text-center flex flex-col items-center justify-center bg-slate-950/40 border border-slate-800 rounded-3xl" id="admin-workspace-placeholder-loader">
              <Loader label="Synchronising Heathrow Fleet and Documents matrices..." />
            </div>
          ) : (
            <div className="space-y-6">

              {/* ==========================================
                  TAB 1: DASHBOARD HOME OVERVIEW
                  ========================================== */}
              {activeTab === 'dashboard' && (
                <div className="space-y-8 animate-fade-in" id="dashboard-home-module">
                  
                  {/* Master Banner Greetings */}
                  <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-910 to-transparent">
                    <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none"></div>
                    <div className="space-y-1 relative z-10">
                      <span className="text-[10px] text-amber-500 uppercase tracking-widest font-bold font-mono">Administrative Control</span>
                      <h2 className="text-2xl font-black text-white leading-none tracking-tight">System Global Performance KPI Metrics</h2>
                      <p className="text-xs text-slate-400">Review real-time rent-to-own files statuses, collected user deposit ledger books, and active vehicle counts.</p>
                    </div>
                  </div>

                  {/* Stat cards grids */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    
                    <div className="bg-slate-950 rounded-xl border border-slate-800 p-5 shadow-xs relative overflow-hidden" id="stat-card-total-cars">
                      <div className="absolute top-4 right-4 bg-slate-900 border border-slate-850 p-1.5 rounded-lg text-amber-400">
                        <Car className="w-4.5 h-4.5" />
                      </div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Total Cars</span>
                      <strong className="block text-2xl font-black text-white mt-2.5 font-sans">{totalCarsCount}</strong>
                      <span className="block text-[9.5px] text-slate-400 mt-1 font-mono">Listed fleet stock items</span>
                    </div>

                    <div className="bg-slate-950 rounded-xl border border-slate-800 p-5 shadow-xs relative overflow-hidden" id="stat-card-all-apps">
                      <div className="absolute top-4 right-4 bg-slate-900 border border-slate-850 p-1.5 rounded-lg text-indigo-400">
                        <FileSearch className="w-4.5 h-4.5" />
                      </div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Total Applications</span>
                      <strong className="block text-2xl font-black text-white mt-2.5 font-sans">{totalAppsCount}</strong>
                      <span className="block text-[9.5px] text-slate-400 mt-1 font-mono">All drivers underwriting files</span>
                    </div>

                    <div className="bg-slate-950 rounded-xl border border-slate-800 p-5 shadow-xs relative overflow-hidden" id="stat-card-pending-apps">
                      <div className="absolute top-4 right-4 bg-slate-900 border border-slate-850 p-1.5 rounded-lg text-amber-400">
                        <Clock className="w-4.5 h-4.5" />
                      </div>
                      <span className="block text-[10px] font-bold text-amber-400 uppercase tracking-widest leading-none">Pending Applications</span>
                      <strong className="block text-2xl font-black text-amber-300 mt-2.5 font-sans">{pendingAppsCount}</strong>
                      <span className="block text-[9.5px] text-slate-450 mt-1 font-mono">Awaiting verification audits</span>
                    </div>

                    <div className="bg-slate-950 rounded-xl border border-slate-800 p-5 shadow-xs relative overflow-hidden" id="stat-card-approved-apps">
                      <div className="absolute top-4 right-4 bg-slate-900 border border-slate-850 p-1.5 rounded-lg text-emerald-400">
                        <CheckCircle className="w-4.5 h-4.5" />
                      </div>
                      <span className="block text-[10px] font-bold text-emerald-400 uppercase tracking-widest leading-none">Approved Files</span>
                      <strong className="block text-2xl font-black text-emerald-300 mt-2.5 font-sans">{approvedAppsCount}</strong>
                      <span className="block text-[9.5px] text-slate-450 mt-1 font-mono">Active leases/contracts generated</span>
                    </div>

                    <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-5 shadow-xs relative overflow-hidden bg-gradient-to-br from-amber-600/5 to-transparent" id="stat-card-rejected-apps">
                      <div className="absolute top-4 right-4 bg-slate-950 border border-slate-800 p-1.5 rounded-lg text-red-400">
                        <XCircle className="w-4.5 h-4.5" />
                      </div>
                      <span className="block text-[10px] font-bold text-red-400 uppercase tracking-widest leading-none">Rejected Files</span>
                      <strong className="block text-2xl font-black text-red-300 mt-2.5 font-sans">{rejectedAppsCount}</strong>
                      <span className="block text-[9.5px] text-slate-450 mt-1 font-mono">Declined underwriting targets</span>
                    </div>

                  </div>

                  {/* Bottom distribution columns & Recents tracking */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Recent underwriting applications logs */}
                    <div className="lg:col-span-7 bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-850 pb-3">
                        <h3 className="font-sans font-black text-sm text-white uppercase tracking-wider flex items-center gap-1.5">
                          <Activity className="w-4 h-4 text-amber-500" /> Recent Application Submissions
                        </h3>
                        <button onClick={() => setActiveTab('applications')} className="text-[10.5px] text-amber-500 hover:underline font-bold">
                          Manage Queue ↗
                        </button>
                      </div>

                      {systemRecords.applications?.length === 0 ? (
                        <p className="text-xs text-slate-400 py-6 text-center">No applications active in queue.</p>
                      ) : (
                        <div className="divide-y divide-slate-850 space-y-2.5 pt-1">
                          {systemRecords.applications.slice(0, 4).map((app) => (
                            <div key={app.id} className="pt-2.5 flex justify-between items-start text-xs gap-3">
                              <div>
                                <strong className="text-slate-100 font-sans block text-[13px]">{app.carName}</strong>
                                <span className="text-[10px] text-slate-400 font-mono">ID: {app.id} • Driver: <span className="text-slate-250 italic">{app.userEmail}</span></span>
                                <span className="block text-[10px] text-slate-400 pt-0.5">Date Submitted: {app.dateApplied}</span>
                              </div>
                              <div className="text-right">
                                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                  app.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' :
                                  app.status === 'Rejected' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
                                }`}>
                                  {app.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Recent ledger summaries */}
                    <div className="lg:col-span-5 bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-850 pb-3">
                        <h3 className="font-sans font-black text-sm text-white uppercase tracking-wider flex items-center gap-1.5">
                          <TrendingUp className="w-4 h-4 text-emerald-500" /> Quick Deposit & Lease Revenues
                        </h3>
                        <span className="font-mono text-xs text-white bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                          SUM: £{totalRevenue}
                        </span>
                      </div>

                      {systemRecords.payments?.length === 0 ? (
                        <p className="text-xs text-slate-450 py-8 text-center">No accounts ledger records yet.</p>
                      ) : (
                        <div className="divide-y divide-slate-850 space-y-3 pt-1">
                          {systemRecords.payments.slice(0, 4).map((pay) => (
                            <div key={pay.id} className="pt-2.5 flex justify-between items-center text-xs">
                              <div>
                                <strong className="text-slate-200 block truncate max-w-[150px]">{pay.carName}</strong>
                                <span className="text-[10px] text-slate-400 font-mono block">{pay.userEmail} • {pay.date}</span>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="text-emerald-400 font-black block">£{pay.amount}</span>
                                <span className="text-[9px] text-slate-450 uppercase block font-mono">{pay.method}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>

                </div>
              )}


              {/* ==========================================
                  TAB 2: CARS MANAGEMENT (CRUD)
                  ========================================== */}
              {activeTab === 'cars' && (
                <div className="space-y-6 animate-fade-in" id="cars-module">
                  
                  {carViewMode === 'list' ? (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h2 className="text-xl font-black text-white">Heathrow Active EV Listings Catalog</h2>
                          <p className="text-xs text-slate-400">Total listed: {totalCarsCount} fleet vehicles. Add, edit, remove or toggle local availability profiles.</p>
                        </div>
                        <button 
                          onClick={startAddCar} 
                          className="bg-amber-500 hover:bg-amber-440 text-gray-950 font-black text-xs px-4 py-2.5 rounded-xl flex items-center space-x-1.5 transition shadow shadow-amber-500/10"
                        >
                          <PlusCircle className="w-4 h-4" />
                          <span>Register New Vehicle</span>
                        </button>
                      </div>

                      {systemRecords.cars?.length === 0 ? (
                        <div className="py-24 text-center border-2 border-dashed border-slate-800 rounded-3xl bg-slate-950/20">
                          <Car className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                          <strong className="block text-white text-sm">No Fleet Cars Available</strong>
                          <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">Register new vehicles into Heathrow EV records using the action button above.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="cars-catalog-grid">
                          {systemRecords.cars.map((car) => (
                            <div key={car.id} className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between group">
                              <div>
                                <div className="relative aspect-video w-full bg-slate-900 border-b border-slate-850">
                                  <img 
                                    src={car.image} 
                                    alt={car.name} 
                                    className="w-full h-full object-cover group-hover:scale-103 transition duration-300" 
                                    referrerPolicy="no-referrer"
                                  />
                                  <span className={`absolute top-4 left-4 text-[10.5px] px-2.5 py-0.5 font-bold rounded-full ${
                                    car.status === 'Available' 
                                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/10' 
                                      : 'bg-red-500/20 text-red-400 border border-red-500/10'
                                  }`}>
                                    {car.status === 'Available' ? '● Available' : '○ Unavailable'}
                                  </span>

                                  <span className="absolute bottom-4 right-4 bg-gray-950/80 backdrop-blur font-mono px-2.5 py-1 text-xs text-amber-500 rounded font-black">
                                    £{car.weeklyRate || car.price}/wk
                                  </span>
                                </div>

                                <div className="p-5 space-y-3.5">
                                  <div>
                                    <span className="text-[10px] text-amber-504 tracking-wider uppercase font-bold block">{car.id} • model {car.year || '2024'}</span>
                                    <h4 className="font-sans font-bold text-lg text-white block">{car.name}</h4>
                                    <p className="text-xs text-slate-400 block font-light">{car.model}</p>
                                  </div>

                                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 font-mono bg-slate-900/60 p-2.5 rounded-xl border border-slate-850">
                                    <div>Fuel: <span className="text-white font-semibold">{car.fuel}</span></div>
                                    <div>Gearbox: <span className="text-white font-semibold">{car.transmission}</span></div>
                                    <div>Milage: <span className="text-white font-semibold">{car.mileage || '15k mi'}</span></div>
                                    <div>Deposit: <span className="text-amber-500 font-bold">£{car.deposit || '150'}</span></div>
                                  </div>

                                  <p className="text-[11.5px] text-slate-400 leading-relaxed font-light line-clamp-2">
                                    {car.description || 'Pristine EV vehicle ready for immediate active lease support.'}
                                  </p>
                                </div>
                              </div>

                              <div className="p-5 pt-0 border-t border-slate-850 mt-2 grid grid-cols-3 gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleToggleCarStatus(car)}
                                  className="py-2 rounded-lg text-[10px] uppercase font-bold text-center border border-slate-805 bg-slate-900 hover:bg-slate-850 text-slate-300"
                                >
                                  {car.status === 'Available' ? 'Mark Busy' : 'Free Car'}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => startEditCar(car)}
                                  className="py-2 rounded-lg text-[10px] uppercase font-bold text-center bg-slate-800 hover:bg-slate-750 text-white flex items-center justify-center space-x-1"
                                >
                                  <Edit2 className="w-3 h-3" />
                                  <span>Edit</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteCar(car.id)}
                                  className="py-2 rounded-lg text-[10px] uppercase font-bold text-center bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center space-x-1"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    // Add & Edit dynamic form
                    <div className="max-w-3xl mx-auto bg-slate-950 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
                      <div className="flex justify-between items-center border-b border-slate-850 pb-4">
                        <h3 className="font-sans font-black text-lg text-white">
                          {carViewMode === 'add' ? 'Register New Fleet Asset' : `Edit Vehicle Specifications - ID: ${selectedCar?.id}`}
                        </h3>
                        <button 
                          onClick={() => setCarViewMode('list')}
                          className="text-xs text-slate-400 hover:text-white font-bold"
                        >
                          ← Returns to inventory
                        </button>
                      </div>

                      <form onSubmit={handleCarFormSubmit} className="space-y-4.5 text-xs text-slate-100">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-slate-450 font-semibold mb-1 uppercase tracking-wide">Vehicle Make/Title</label>
                            <input
                              type="text"
                              required
                              value={carName}
                              onChange={(e) => setCarName(e.target.value)}
                              placeholder="e.g. TOYOTA PRIUS"
                              className="w-full text-xs py-2.5 px-3 border border-slate-800 bg-slate-900 rounded-lg text-white focus:outline-none focus:border-amber-500"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-450 font-semibold mb-1 uppercase tracking-wide">Model Details</label>
                            <input
                              type="text"
                              required
                              value={carModel}
                              onChange={(e) => setCarModel(e.target.value)}
                              placeholder="e.g. 1.8 PLUG-IN COMPOSITE HYBRID"
                              className="w-full text-xs py-2.5 px-3 border border-slate-800 bg-slate-900 rounded-lg text-white focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-slate-450 font-semibold mb-1 uppercase tracking-wide">Weekly Dues Rent (£)</label>
                            <input
                              type="number"
                              required
                              value={carPrice}
                              onChange={(e) => setCarPrice(e.target.value)}
                              className="w-full text-xs py-2.5 px-3 border border-slate-800 bg-slate-900 rounded-lg text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-450 font-semibold mb-1 uppercase tracking-wide">Refundable Deposit (£)</label>
                            <input
                              type="number"
                              required
                              value={carDeposit}
                              onChange={(e) => setCarDeposit(e.target.value)}
                              className="w-full text-xs py-2.5 px-3 border border-slate-800 bg-slate-900 rounded-lg text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-450 font-semibold mb-1 uppercase tracking-wide">Manufacture Year</label>
                            <input
                              type="text"
                              required
                              value={carYear}
                              onChange={(e) => setCarYear(e.target.value)}
                              placeholder="e.g. 2024"
                              className="w-full text-xs py-2.5 px-3 border border-slate-800 bg-slate-900 text-white rounded-lg"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="block text-slate-450 font-semibold mb-1 uppercase tracking-wide">Fuel Engine Trim</label>
                            <select
                              value={carFuel}
                              onChange={(e) => setCarFuel(e.target.value)}
                              className="w-full text-xs py-2.5 px-2 border border-slate-800 bg-slate-900 text-white rounded-lg"
                            >
                              <option value="Hybrid">Hybrid</option>
                              <option value="Electric">Electric</option>
                              <option value="Petrol">Petrol</option>
                              <option value="Diesel">Diesel</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-slate-450 font-semibold mb-1 uppercase tracking-wide">Transmission Box</label>
                            <select
                              value={carTransmission}
                              onChange={(e) => setCarTransmission(e.target.value)}
                              className="w-full text-xs py-2.5 px-2 border border-slate-800 bg-slate-900 text-white rounded-lg"
                            >
                              <option value="Automatic">Automatic</option>
                              <option value="Manual">Manual</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-slate-450 font-semibold mb-1 uppercase tracking-wide">Economy Specification</label>
                            <input
                              type="text"
                              required
                              value={carEconomy}
                              onChange={(e) => setCarEconomy(e.target.value)}
                              className="w-full text-xs py-2.5 px-3 border border-slate-800 bg-slate-900 text-white rounded-lg"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-slate-450 font-semibold mb-1 uppercase tracking-wide">Mileage logged</label>
                            <input
                              type="text"
                              required
                              value={carMileage}
                              onChange={(e) => setCarMileage(e.target.value)}
                              className="w-full text-xs py-2.5 px-3 border border-slate-800 bg-slate-900 text-white rounded-lg"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-450 font-semibold mb-1 uppercase tracking-wide">Primary Thumbnail Image URL</label>
                            <input
                              type="url"
                              required
                              value={carImage}
                              onChange={(e) => setCarImage(e.target.value)}
                              className="w-full text-xs py-2.5 px-3 border border-slate-800 bg-slate-900 text-white font-mono rounded-lg"
                            />
                          </div>
                        </div>

                        {/* 10 Multi-Angle Grid Images */}
                        <div className="bg-slate-900 border border-slate-800 p-4.5 rounded-xl space-y-3.5">
                          <div>
                            <span className="block text-amber-500 font-extrabold uppercase tracking-wider text-[11px]">
                              Visual Multi-Angle Gallery URLs (10 Angles)
                            </span>
                            <span className="block text-[10px] text-slate-400 mt-1 font-sans">
                              Provide URL links to 10 distinct showcase photographs of this vehicle (e.g., front, dashboard, wheels, profile angles).
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 pt-1">
                            {carImages.map((imgUrl, index) => (
                              <div key={index} className="space-y-1">
                                <label className="block text-[10px] text-slate-400 font-mono font-bold">Angle {index + 1} URL</label>
                                <input
                                  type="url"
                                  value={imgUrl}
                                  onChange={(e) => {
                                    const updated = [...carImages];
                                    updated[index] = e.target.value;
                                    setCarImages(updated);
                                  }}
                                  placeholder={`Showcase URL #${index + 1}`}
                                  className="w-full text-slate-100 placeholder-slate-600 border border-slate-800 bg-slate-950 px-2 py-1.5 text-[11px] rounded font-mono focus:outline-none focus:border-amber-500"
                                />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-450 font-semibold mb-1 uppercase tracking-wide font-sans">Public Highlights & Specifications Description</label>
                          <textarea
                            required
                            rows={3}
                            value={carDescription}
                            onChange={(e) => setCarDescription(e.target.value)}
                            className="w-full text-xs py-2 px-3 border border-slate-800 bg-slate-900 text-white rounded-lg"
                          />
                        </div>

                        <div className="pt-4 border-t border-slate-850 flex gap-3">
                          <Button type="button" variant="dark" size="md" className="flex-1 font-bold" onClick={() => setCarViewMode('list')}>
                            Discard Form
                          </Button>
                          <Button type="submit" variant="primary" size="md" className="flex-1 font-bold">
                            Save Vehicle Specifications
                          </Button>
                        </div>
                      </form>
                    </div>
                  )}

                </div>
              )}


              {/* ==========================================
                  TAB 3: APPLICATIONS MANAGEMENT & SECURITY UNDERWRITING
                  ========================================== */}
              {activeTab === 'applications' && (
                <div className="space-y-6 animate-fade-in" id="applications-module">
                  
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Left Applicants queue checklist list */}
                    <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
                      <div>
                        <h3 className="font-sans font-black text-sm text-white uppercase tracking-wider flex items-center gap-1.5">
                          <Activity className="w-4 h-4 text-amber-500" /> Pending Verification Queue
                        </h3>
                        <p className="text-[11px] text-slate-400">Total queued files: {totalAppsCount}. Click to examine uploaded driving license files, ID proofs and selfie certifications.</p>
                      </div>

                      {systemRecords.applications?.length === 0 ? (
                        <p className="text-xs text-slate-400 py-6 text-center">No underwriting folders currently registered.</p>
                      ) : (
                        <div className="divide-y divide-slate-850 space-y-2 max-h-[600px] overflow-y-auto pr-1">
                          {systemRecords.applications.map((app) => (
                            <div 
                              key={app.id}
                              className={`p-4 rounded-xl border text-xs cursor-pointer transition flex flex-col gap-2 ${
                                selectedApp?.id === app.id 
                                  ? 'border-amber-500 bg-amber-500/5 ring-2 ring-amber-500/10' 
                                  : 'border-slate-800 hover:bg-slate-900 bg-slate-950'
                              }`}
                              onClick={() => startInspectApp(app)}
                            >
                              <div className="flex justify-between items-start gap-2">
                                <div className="space-y-1">
                                  <strong className="text-white font-sans text-[13.5px] block truncate">{app.carName}</strong>
                                  <span className="block text-[10.5px] text-slate-400">Applicant: <strong className="text-slate-200">{app.fullName || app.applyDetails?.fullName || "Not Specified"}</strong></span>
                                  <span className="block text-[10.5px] text-slate-400">Email: <span className="text-slate-200">{app.userEmail}</span></span>
                                  {app.phone && <span className="block text-[10.5px] text-slate-400">Phone: <span className="text-slate-300">{app.phone}</span></span>}
                                </div>
                                <span className={`inline-block px-2 py-0.5 rounded text-[8.5px] uppercase font-bold tracking-wider leading-none shrink-0 ${
                                  app.status === 'Approved' ? 'bg-emerald-500/15 text-emerald-400' :
                                  app.status === 'Rejected' ? 'bg-red-500/15 text-red-400' : 'bg-amber-500/15 text-amber-400'
                                }`}>
                                  {app.status || 'Pending'}
                                </span>
                              </div>

                              <div className="flex justify-between items-center text-[10px] text-slate-450 bg-slate-900 border border-slate-850 p-2 rounded-lg font-mono">
                                <span>Ref: {app.id}</span>
                                <span>Applied: {app.dateApplied}</span>
                              </div>

                              <div className="flex justify-between items-center pt-1">
                                <span className="text-[10.5px] font-bold text-amber-505">Inspect Credentials Folder ↗</span>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm("Verify Deletion: Permanently delete application folder?")) {
                                      api.admin.deleteApplication(app.id).then(() => fetchAllData());
                                    }
                                  }}
                                  className="text-red-400 hover:text-red-300 font-bold text-[10.5px]"
                                >
                                  Clear History
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right Applicant Credentials Dossier Inspection Terminal */}
                    <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-5">
                      <h3 className="font-sans font-black text-sm text-white uppercase tracking-wider flex items-center gap-1.5">
                        <FileCheck className="w-4 h-4 text-emerald-500" /> Administrative Verification Terminal
                      </h3>

                      {selectedApp ? (
                        <div className="space-y-6 animate-fade-in" id="credentials-audit-dossier">
                          <div className="pb-3 border-b border-slate-850 flex justify-between items-start text-xs">
                            <div>
                              <span className="text-[9.5px] text-slate-400 uppercase tracking-widest block font-bold">Lease Underwrite dossier</span>
                              <strong className="text-base text-white tracking-tight block font-sans">{selectedApp.carName}</strong>
                              <span className="text-slate-400 block font-mono">ID: {selectedApp.id} • Driver Email: {selectedApp.userEmail}</span>
                            </div>
                            <span className="bg-amber-500/10 text-amber-400 font-black py-1 px-3 rounded-lg border border-amber-500/20 uppercase">
                              Status: {selectedApp.status}
                            </span>
                          </div>

                          {/* Driving Dossier specifics info */}
                          <div className="space-y-3 p-4 bg-slate-900 rounded-xl border border-slate-800 text-xs">
                            <span className="block text-[10px] text-amber-500 font-bold uppercase tracking-wider">Applicant Personal & Income Profile</span>
                            <div className="grid grid-cols-2 gap-3.5 text-slate-300 bg-slate-950/40 p-3 rounded-lg border border-slate-850">
                              <div>Applicant Name: <strong className="text-white block font-sans font-medium text-sm mt-0.5">{selectedApp.fullName || (selectedApp.applyDetails?.fullName && selectedApp.applyDetails.fullName !== 'Not Provided' ? selectedApp.applyDetails.fullName : null) || 'N/A'}</strong></div>
                              <div>Phone Number: <strong className="text-white block font-sans font-medium text-sm mt-0.5">{selectedApp.phone || (selectedApp.applyDetails?.phone && selectedApp.applyDetails.phone !== 'Not Provided' ? selectedApp.applyDetails.phone : null) || 'N/A'}</strong></div>
                              <div>Email Address: <strong className="text-white block font-sans font-medium text-xs break-all mt-0.5">{selectedApp.userEmail || 'N/A'}</strong></div>
                              <div>Employment Type: <strong className="text-white block font-sans font-medium text-sm mt-0.5">{(selectedApp.applyDetails?.employment && selectedApp.applyDetails.employment !== 'Not Provided') ? selectedApp.applyDetails.employment : 'N/A'}</strong></div>
                              <div>Weekly Income: <strong className="text-emerald-400 block font-sans font-semibold text-sm mt-0.5">{(selectedApp.applyDetails?.weeklyIncome !== undefined && selectedApp.applyDetails?.weeklyIncome !== null && selectedApp.applyDetails?.weeklyIncome !== '') ? `£${selectedApp.applyDetails.weeklyIncome} / week` : 'N/A'}</strong></div>
                              <div>Requested Term: <strong className="text-white block font-sans font-medium text-sm mt-0.5">{selectedApp.applyDetails?.durationMonths ? `${selectedApp.applyDetails.durationMonths} Mos` : 'N/A'}</strong></div>
                              <div>Location / Area: <strong className="text-white block font-sans font-medium text-sm mt-0.5">{(selectedApp.applyDetails?.location && selectedApp.applyDetails.location !== 'Not Provided' && selectedApp.applyDetails.location !== 'Manchester, UK') ? selectedApp.applyDetails.location : 'N/A'}</strong></div>
                              <div>Soft credit status: <strong className="text-emerald-400 block font-sans font-semibold text-sm mt-0.5">{selectedApp.creditCheckStatus || 'N/A'}</strong></div>
                            </div>
                                  {/* Credentials document previews */}
                          <div className="space-y-2.5">
                            <span className="block text-[10px] text-slate-450 uppercase font-black tracking-widest">Submitted Identity Certificates</span>
                            <div className="grid grid-cols-3 gap-3">
                              
                              <div className="bg-slate-900 border border-slate-800 p-2 rounded-xl space-y-1.5 text-center flex flex-col justify-between">
                                <span className="block text-[9.5px] text-slate-300 font-bold">Driving Licence (Front)</span>
                                {(selectedApp.licenseFrontUrl && !selectedApp.licenseFrontUrl.includes('unsplash.com')) || (selectedApp.applyDetails?.drivingLicence && !selectedApp.applyDetails.drivingLicence.includes('unsplash.com')) ? (
                                  <>
                                    <img 
                                      src={getImageUrl(selectedApp.licenseFrontUrl || selectedApp.applyDetails?.drivingLicence)} 
                                      alt="Licence Front" 
                                      className="w-full aspect-video object-cover rounded bg-slate-950 hover:opacity-90 transition-opacity cursor-pointer duration-200"
                                      referrerPolicy="no-referrer"
                                      onClick={() => window.open(getImageUrl(selectedApp.licenseFrontUrl || selectedApp.applyDetails?.drivingLicence), '_blank')}
                                    />
                                    <a href={getImageUrl(selectedApp.licenseFrontUrl || selectedApp.applyDetails?.drivingLicence)} target="_blank" rel="noreferrer" className="text-[9px] text-amber-400 hover:underline block pt-1 font-bold">Examine Fullscreen ↗</a>
                                  </>
                                ) : (
                                  <div className="w-full aspect-video rounded bg-slate-950 flex flex-col items-center justify-center text-slate-500 border border-slate-850 py-3">
                                    <span className="text-[10px] font-mono">N/A</span>
                                  </div>
                                )}
                              </div>

                              <div className="bg-slate-900 border border-slate-800 p-2 rounded-xl space-y-1.5 text-center flex flex-col justify-between">
                                <span className="block text-[9.5px] text-slate-300 font-bold">Selfie Photo</span>
                                {(selectedApp.selfieUrl && !selectedApp.selfieUrl.includes('unsplash.com')) || (selectedApp.applyDetails?.selfieWithId && !selectedApp.applyDetails.selfieWithId.includes('unsplash.com')) ? (
                                  <>
                                    <img 
                                      src={getImageUrl(selectedApp.selfieUrl || selectedApp.applyDetails?.selfieWithId)} 
                                      alt="Selfie" 
                                      className="w-full aspect-video object-cover rounded bg-slate-950 hover:opacity-90 transition-opacity cursor-pointer duration-200"
                                      referrerPolicy="no-referrer"
                                      onClick={() => window.open(getImageUrl(selectedApp.selfieUrl || selectedApp.applyDetails?.selfieWithId), '_blank')}
                                    />
                                    <a href={getImageUrl(selectedApp.selfieUrl || selectedApp.applyDetails?.selfieWithId)} target="_blank" rel="noreferrer" className="text-[9px] text-amber-400 hover:underline block pt-1 font-bold">Examine Fullscreen ↗</a>
                                  </>
                                ) : (
                                  <div className="w-full aspect-video rounded bg-slate-950 flex flex-col items-center justify-center text-slate-500 border border-slate-850 py-3">
                                    <span className="text-[10px] font-mono">N/A</span>
                                  </div>
                                )}
                              </div>

                              <div className="bg-slate-900 border border-slate-800 p-2 rounded-xl space-y-1.5 text-center flex flex-col justify-between">
                                <span className="block text-[9.5px] text-slate-300 font-bold">Driving Licence (Back)</span>
                                {(selectedApp.licenseBackUrl && !selectedApp.licenseBackUrl.includes('unsplash.com')) || (selectedApp.applyDetails?.addressProof && !selectedApp.applyDetails.addressProof.includes('unsplash.com')) ? (
                                  <>
                                    <img 
                                      src={getImageUrl(selectedApp.licenseBackUrl || selectedApp.applyDetails?.addressProof)} 
                                      alt="Licence Back" 
                                      className="w-full aspect-video object-cover rounded bg-slate-950 hover:opacity-90 transition-opacity cursor-pointer duration-200"
                                      referrerPolicy="no-referrer"
                                      onClick={() => window.open(getImageUrl(selectedApp.licenseBackUrl || selectedApp.applyDetails?.addressProof), '_blank')}
                                    />
                                    <a href={getImageUrl(selectedApp.licenseBackUrl || selectedApp.applyDetails?.addressProof)} target="_blank" rel="noreferrer" className="text-[9px] text-amber-400 hover:underline block pt-1 font-bold">Examine Fullscreen ↗</a>
                                  </>
                                ) : (
                                  <div className="w-full aspect-video rounded bg-slate-950 flex flex-col items-center justify-center text-slate-500 border border-slate-850 py-3">
                                    <span className="text-[10px] font-mono">N/A</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                          {/* Validation checklists */}
                          <div className="space-y-4 border-t border-slate-850 pt-4 bg-slate-900 p-4.5 rounded-xl border border-slate-800 text-xs">
                            <span className="block text-[10.5px] font-bold text-white uppercase tracking-wide">Step Verification Checklist</span>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              
                              <label className="flex items-center space-x-2.5 cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={docChecks.drivingLicence} 
                                  onChange={(e) => setDocChecks({ ...docChecks, drivingLicence: e.target.checked })} 
                                  className="w-4.5 h-4.5 text-amber-500 rounded border-slate-700 bg-slate-950 focus:ring-0 focus:ring-offset-0"
                                />
                                <span className="text-slate-300">Verify driving license</span>
                              </label>

                              <label className="flex items-center space-x-2.5 cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={docChecks.addressProof} 
                                  onChange={(e) => setDocChecks({ ...docChecks, addressProof: e.target.checked })} 
                                  className="w-4.5 h-4.5 text-amber-500 rounded border-slate-700 bg-slate-950 focus:ring-0"
                                />
                                <span className="text-slate-300">Verify address proof</span>
                              </label>

                              <label className="flex items-center space-x-2.5 cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={docChecks.selfie} 
                                  onChange={(e) => setDocChecks({ ...docChecks, selfie: e.target.checked })} 
                                  className="w-4.5 h-4.5 text-amber-500 rounded border-slate-700 bg-slate-950 focus:ring-0"
                                />
                                <span className="text-slate-300">Verify selfie photo</span>
                              </label>

                            </div>

                            <div className="space-y-1.5">
                              <label className="block text-slate-450 font-semibold uppercase tracking-wide">Review/underwriting Notes</label>
                              <textarea
                                rows={2}
                                value={auditNotes}
                                onChange={(e) => setAuditNotes(e.target.value)}
                                placeholder="Add private underwriter comments or checks logs..."
                                className="w-full text-xs py-2 px-3 border border-slate-800 bg-slate-950 rounded-lg text-white"
                              />
                            </div>

                            {/* Approval buttons */}
                            <div className="pt-2 flex gap-3">
                              <button
                                type="button"
                                onClick={() => handleSaveAppVerification('Rejected', selectedApp.step)}
                                className="flex-1 py-3 px-4 text-xs font-black uppercase text-center rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/25 transition shadow shadow-red-500/5 cursor-pointer"
                              >
                                Trigger Rejection Flow
                              </button>

                              <button
                                type="button"
                                onClick={() => handleSaveAppVerification('Approved', 4)}
                                className="flex-1 py-3 px-4 text-xs font-black uppercase text-center rounded-xl bg-emerald-500 hover:bg-emerald-440 text-gray-950 transition shadow shadow-emerald-500/10 cursor-pointer"
                              >
                                Approve Underwriting Flow
                              </button>
                            </div>
                          </div>

                        </div>
                      ) : (
                        <div className="py-24 text-center border-2 border-dashed border-slate-805 rounded-2xl bg-slate-900/40 p-6 flex flex-col items-center justify-center">
                          <FileText className="w-10 h-10 text-slate-700 mb-2" />
                          <strong className="block text-white text-xs uppercase font-black">Inspection Console Standby</strong>
                          <p className="text-[11.5px] text-slate-455 max-w-xs leading-relaxed mt-1.5">Click "Inspect Credentials" on any driver queue file to retrieve live ID proofs, utility letters, selfie matches and trigger instant approval flows.</p>
                        </div>
                      )}
                    </div>

                  </div>

                </div>
              )}


              {/* ==========================================
                  TAB 4: MEMBER DRIVERS PROFILES & BLOCKED LIST
                  ========================================== */}
              {activeTab === 'users' && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 animate-fade-in" id="users-module">
                  <div>
                    <h3 className="font-sans font-black text-white text-base leading-none">Registered Heathrow Member Partners Database</h3>
                    <p className="text-xs text-slate-400">Review driver credentials details, suspend profile log access, or clear/delete accounts records permanently.</p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse font-sans">
                      <thead>
                        <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10.5px]">
                          <th className="py-3 px-4">Driver Name</th>
                          <th className="py-3 px-4">Email Coordinates</th>
                          <th className="py-3 px-4">Role Group</th>
                          <th className="py-3 px-4">Applications Logged</th>
                          <th className="py-3 px-4">Access Status</th>
                          <th className="py-3 px-4 text-right">Administrative Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-850">
                        {systemRecords.users?.map((usr) => {
                          const driverAppsCount = systemRecords.applications?.filter(a => a.userEmail?.toLowerCase() === usr.email?.toLowerCase()).length || 0;
                          return (
                            <tr key={usr.email} className="hover:bg-slate-900/60">
                              <td className="py-3.5 px-4 font-bold text-white text-sm">{usr.fullName || 'Driver Partner'}</td>
                              <td className="py-3.5 px-4 font-mono text-slate-300">{usr.email}</td>
                              <td className="py-3.5 px-4 uppercase font-mono text-[10px]">
                                <span className={`inline-block px-2.5 py-0.5 rounded text-[9.5px] font-black tracking-wider leading-none ${
                                  usr.role === 'admin' 
                                    ? 'bg-purple-500/15 text-purple-400 border border-purple-500/10' 
                                    : 'bg-slate-500/15 text-slate-400 border border-slate-500/10'
                                }`}>
                                  {usr.role || 'user'}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 font-semibold text-center text-amber-500 font-mono text-xs">{driverAppsCount} folder(s)</td>
                              <td className="py-3.5 px-4 uppercase">
                                <span className={`inline-block px-2.5 py-0.5 rounded text-[9.5px] font-black tracking-wider leading-none ${
                                  usr.blocked 
                                    ? 'bg-red-500/15 text-red-400 border border-red-500/10 animate-pulse' 
                                    : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/10'
                                }`}>
                                  {usr.blocked ? '✘ EXCLUDED' : '✔ ACTIVE'}
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-right space-x-2">
                                <button
                                  type="button"
                                  onClick={async () => {
                                    const nextRole = usr.role === 'admin' ? 'user' : 'admin';
                                    try {
                                      await api.admin.updateUserRole(usr.email, nextRole);
                                      setSysAlert({ type: 'success', text: `Role for ${usr.email} successfully updated to ${nextRole.toUpperCase()}!` });
                                      await fetchAllData();
                                    } catch (err) {
                                      setSysAlert({ type: 'error', text: err.message || "Failed to edit user role." });
                                    }
                                  }}
                                  className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20"
                                >
                                  Make {usr.role === 'admin' ? 'Driver' : 'Admin'}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleToggleBlockUser(usr.email, usr.blocked)}
                                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition ${
                                    usr.blocked 
                                      ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' 
                                      : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20'
                                  }`}
                                >
                                  {usr.blocked ? 'Unblock Partner' : 'Block Profile'}
                                </button>
 
                                <button
                                  type="button"
                                  onClick={() => handleDeleteUser(usr.email)}
                                  className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
                                >
                                  Purge
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}


              {/* ==========================================
                  TAB 5: PAYMENTS & DEPOSITS BOOKKEEPING
                  ========================================== */}
              {activeTab === 'payments' && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-5 animate-fade-in" id="payments-module">
                  <div className="flex justify-between items-center border-b border-slate-850 pb-3">
                    <div>
                      <h2 className="text-base font-black text-white uppercase tracking-wider">Heathrow Deposit & Lease Accounts ledger</h2>
                      <p className="text-xs text-slate-400">Log client deposit receipts or verify pending transactions files from Heathrow drivers.</p>
                    </div>
                    <span className="font-mono text-sm font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1 rounded-full">
                      Ledger: £{totalRevenue} Paid
                    </span>
                  </div>

                  {systemRecords.payments?.length === 0 ? (
                    <p className="text-xs text-slate-450 py-12 text-center">No transactions statements registered in DB ledgers.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse font-sans">
                        <thead>
                          <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase text-[10.5px]">
                            <th className="py-3 px-4">Transaction ID</th>
                            <th className="py-3 px-4">Driver Coordinates</th>
                            <th className="py-3 px-4">Target Rent Account</th>
                            <th className="py-3 px-4">Date Logged</th>
                            <th className="py-3 px-4">Method</th>
                            <th className="py-3 px-4">Dues Amount</th>
                            <th className="py-3 px-4 text-right">Verification Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-850 font-sans">
                          {systemRecords.payments.map((pay) => (
                            <tr key={pay.id} className="hover:bg-slate-900/40">
                              <td className="py-3.5 px-4 font-mono font-bold text-amber-501 text-[12.5px]">{pay.id}</td>
                              <td className="py-3.5 px-4 font-mono text-slate-350">{pay.userEmail}</td>
                              <td className="py-3.5 px-4 font-bold text-slate-100 text-sm truncate max-w-[150px]">{pay.carName}</td>
                              <td className="py-3.5 px-4 text-slate-400 font-mono">{pay.date}</td>
                              <td className="py-3.5 px-4 text-slate-300">{pay.method || 'Debit Card'}</td>
                              <td className="py-3.5 px-4 font-black text-emerald-400 text-sm font-mono">£{pay.amount}</td>
                              <td className="py-3.5 px-4 text-right">
                                {pay.status === 'Pending' ? (
                                  <button
                                    onClick={() => handleVerifyManualPayment(pay.id)}
                                    className="bg-emerald-500 text-gray-950 font-black px-2.5 py-1.5 rounded-lg text-[10px] uppercase shadow hover:bg-emerald-440 transition"
                                  >
                                    Verify Paid
                                  </button>
                                ) : (
                                  <span className="bg-emerald-500/10 text-emerald-400 font-bold px-2.5 py-1 rounded text-[10px] tracking-wide">
                                    ✓ Verified Payment
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}


              {/* ==========================================
                  TAB 6: EMAIL SYSTEM & INSURANCE FILES COMMISSION
                  ========================================== */}
              {activeTab === 'emails' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in" id="emails-module">
                  
                  {/* Left Column Email Dispatcher and Insurance Uploader */}
                  <div className="lg:col-span-6 space-y-6">
                    
                    {/* Send manual email trigger form */}
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
                      <h3 className="font-sans font-black text-sm text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Mail className="w-4 h-4 text-amber-500" /> Manual Driver Mail Dispatcher
                      </h3>
                      <p className="text-[11px] text-slate-400">Trigger custom approval/rejection notes, logistics coordinates or documents requests directly:</p>

                      <form onSubmit={handleSendManualEmail} className="space-y-4 text-xs">
                        <div>
                          <label className="block text-slate-400 font-bold mb-1">Target Recipient Address</label>
                          <select
                            required
                            value={emailTo}
                            onChange={(e) => setEmailTo(e.target.value)}
                            className="w-full text-xs py-2 bg-slate-900 border border-slate-800 text-white rounded-lg px-2"
                          >
                            <option value="">-- Choose Driver Email --</option>
                            {systemRecords.users?.map(u => (
                              <option key={u.email} value={u.email}>{u.fullName} ({u.email})</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-400 font-bold mb-1 col">Email Subject Topic</label>
                          <input
                            type="text"
                            required
                            value={emailSubject}
                            onChange={(e) => setEmailSubject(e.target.value)}
                            placeholder="e.g. Heathrow Airport Rent-to-Own Update"
                            className="w-full text-xs py-2 px-3 bg-slate-900 border border-slate-800 text-white rounded-lg focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 font-bold mb-1">Message Body text</label>
                          <textarea
                            required
                            rows={4}
                            value={emailContent}
                            onChange={(e) => setEmailContent(e.target.value)}
                            placeholder="Compose driver instructions, logistics schedules or credentials requests here..."
                            className="w-full text-xs py-2 px-3 bg-slate-900 border border-slate-800 text-white rounded-lg focus:outline-none"
                          />
                        </div>

                        <div className="pt-1.5">
                          <button
                            type="submit"
                            className="w-full py-2 px-3 text-xs font-black uppercase text-center rounded-lg bg-amber-500 hover:bg-amber-440 text-gray-950 transition flex items-center justify-center space-x-1.5 cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Dispatch system Email</span>
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Insurance Policy Upload form */}
                    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                        <h3 className="font-sans font-black text-sm text-white uppercase tracking-wider flex items-center gap-1.5">
                          <PlusCircle className="w-4.5 h-4.5 text-emerald-400" /> Upload Fleet Insurance Policy
                        </h3>
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono uppercase font-black">
                          Specific flow
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">Attach and send official comprehensive Heathrow motor fleet cover certificates directly to approved driver's account profiles:</p>

                      <form onSubmit={handleUploadInsuranceAction} className="space-y-4 text-xs">
                        <div>
                          <label className="block text-slate-400 font-bold mb-1">Target Approved Driver Partner</label>
                          <select
                            required
                            value={insuranceTargetEmail}
                            onChange={(e) => setInsuranceTargetEmail(e.target.value)}
                            className="w-full text-xs py-2 bg-slate-900 border border-slate-800 text-white rounded-lg px-2"
                          >
                            <option value="">-- Select Member --</option>
                            {systemRecords.users?.map(u => (
                              <option key={u.email} value={u.email}>{u.fullName} ({u.email})</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-400 font-bold mb-1">Certificate Image / Document File URL</label>
                          <input
                            type="url"
                            required
                            value={insurancePolicyUrl}
                            onChange={(e) => setInsurancePolicyUrl(e.target.value)}
                            placeholder="Paste certificate image reference link or PDF..."
                            className="w-full text-xs py-2 px-3 bg-slate-900 border border-slate-800 text-white rounded-lg font-mono"
                          />
                        </div>

                        <div className="pt-2">
                          <Button type="submit" variant="primary" size="sm" className="w-full font-black uppercase tracking-wider text-xs">
                            Attach Coverage Certificate & Notify Partner
                          </Button>
                        </div>
                      </form>
                    </div>

                  </div>

                  {/* Right Column Sent Communications ledgers log */}
                  <div className="lg:col-span-6 bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
                    <h3 className="font-sans font-black text-sm text-white uppercase tracking-wider flex items-center gap-1.5">
                      <MailOpen className="w-4 h-4 text-emerald-400" /> Outbox Sent Mail Communications Logs
                    </h3>
                    <p className="text-[11px] text-slate-400">Tracking archive of sent underwriting confirmations, rejection letters, invoices or motor coverage certs:</p>

                    {systemRecords.emails?.length === 0 ? (
                      <p className="text-xs text-slate-450 py-12 text-center">No outgoing emails queued in DB logs.</p>
                    ) : (
                      <div className="divide-y divide-slate-850 space-y-3.5 max-h-[600px] overflow-y-auto pr-1 text-xs">
                        {systemRecords.emails.map((m) => (
                          <div key={m.id} className="pt-3.5 space-y-2">
                            <div className="flex justify-between items-start text-[11px]">
                              <div>
                                <strong className="text-white block font-sans font-black leading-tight">{m.subject}</strong>
                                <span className="text-[10px] text-slate-400 font-mono block">Recipient: <span className="text-slate-200">{m.userEmail}</span></span>
                              </div>
                              <span className="text-[10px] text-slate-410 font-mono font-semibold shrink-0 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">{m.dateSent}</span>
                            </div>

                            <p className="p-3 bg-slate-900 rounded-lg text-slate-350 leading-relaxed italic text-[11.5px] border border-slate-850">
                              {m.content}
                            </p>

                            {m.attachmentUrl && (
                              <div className="flex items-center space-x-2 bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/10 text-[10.5px]">
                                <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span className="text-slate-200 truncate flex-1 font-mono">{m.attachmentUrl}</span>
                                <a href={m.attachmentUrl} target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline font-bold shrink-0">Open Policy File ↗</a>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              )}


              {/* ==========================================
                  TAB 7: CUSTOMERS INCOMING INBOX (CONTACT CONTEXT)
                  ========================================== */}
              {activeTab === 'settings' && (
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 animate-fade-in" id="settings-module">
                  <div>
                    <h3 className="font-sans font-black text-white text-base flex items-center gap-1.5 uppercase">
                      <MessageSquare className="w-5 h-5 text-emerald-400" /> Incoming customer Inquiries Inbox
                    </h3>
                    <p className="text-xs text-slate-400">Examine real-time messages submitted from web-guests inquiring on fleet vehicle options or underwriting criteria.</p>
                  </div>

                  {systemRecords.inquiries?.length === 0 ? (
                    <div className="py-24 text-center border border-dashed border-slate-800 rounded-xl bg-slate-900/20">
                      <MessageSquare className="w-10 h-10 text-slate-700 mx-auto mb-2" />
                      <span className="block text-slate-300 font-bold mb-1">Customers Inbox Empty</span>
                      <p className="text-xs text-slate-450 max-w-xs mx-auto">Messages generated from your public Contact Form screen automatically register thread lines here.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {systemRecords.inquiries.map((inq) => (
                        <div key={inq.id} className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-3.5 text-xs animate-fade-in">
                          <div className="flex justify-between items-start gap-2 border-b border-slate-850 pb-2.5">
                            <div>
                              <strong className="text-white block text-sm">{inq.name}</strong>
                              <span className="text-[10.5px] text-slate-400 font-mono block">Sender coordinates: {inq.email}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-slate-450 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">{inq.dateReceived}</span>
                              <span className="text-[10.5px] text-amber-500 font-black font-mono block mt-1">{inq.id}</span>
                            </div>
                          </div>

                          <p className="p-3 bg-slate-950/60 text-slate-200 rounded-xl text-xs italic leading-relaxed font-light border border-slate-850">
                            "{inq.msg}"
                          </p>

                          <div className="flex justify-between items-center text-[10.5px] pt-1">
                            <span className="text-emerald-400 font-mono font-bold uppercase tracking-wider">● Dispatch Ready</span>
                            <div className="space-x-2">
                              <a 
                                href={`mailto:${inq.email}?subject=Inquiry Reply: rent2buyfleet Heathrow`} 
                                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-440 text-gray-950 font-black rounded-lg transition"
                              >
                                Reply via Email Client ✉
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

        </div>
      </main>

    </div>
  );
}
