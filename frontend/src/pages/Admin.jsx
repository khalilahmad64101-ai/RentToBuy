import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Button } from '../components/ui/Button';
import { Loader } from '../components/ui/Loader';
import { useSEO } from '../hooks/useSEO';
import { useNavigate, Link } from 'react-router-dom';

// Import modular layouts
import AdminSidebar from '../components/AdminSidebar';
import { DocumentViewerModal, FullApplicationModal } from '../components/AdminModals';
import AdminCarForm from '../components/AdminCarForm';

import { 
  Menu, 
  Plus, 
  Search, 
  Trash2, 
  Edit2, 
  AlertCircle,
  Eye,
  FileText,
  DollarSign,
  TrendingUp,
  Layers,
  Clock,
  Send,
  PlusCircle,
  MailOpen,
  Users,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Gauge,
  HelpCircle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return url.startsWith('/') ? url : `/${url}`;
};

export function Admin() {
  useSEO({
    title: 'Backoffice Heathrow Control Center',
    description: 'Rent-to-Buy motor fleet management console.'
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  // Page Views layout states
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, cars, applications, users, payments, emails, settings
  const [carViewMode, setCarViewMode] = useState('list'); // list, add, edit
  const [selectedCar, setSelectedCar] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Pagination & details states
  const [appCurrentPage, setAppCurrentPage] = useState(1);
  const [userCurrentPage, setUserCurrentPage] = useState(1);
  const [paymentCurrentPage, setPaymentCurrentPage] = useState(1);
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);

  // States for searchable user dropdowns in Notifications Hub
  const [emailToSearch, setEmailToSearch] = useState('');
  const [emailToIsOpen, setEmailToIsOpen] = useState(false);
  const [insuranceSearch, setInsuranceSearch] = useState('');
  const [insuranceIsOpen, setInsuranceIsOpen] = useState(false);

  // Data registers from db API
  const [systemRecords, setSystemRecords] = useState({
    cars: [],
    applications: [],
    users: [],
    payments: [],
    emails: [],
    inquiries: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [alertBanner, setAlertBanner] = useState(null); // { type: 'success' | 'error', text: '' }

  // Action specific spinner
  const [actionLoading, setActionLoading] = useState(false);

  // Search, filter state parameters
  const [carSearch, setCarSearch] = useState('');
  const [carStatusFilter, setCarStatusFilter] = useState('All');
  
  const [appSearch, setAppSearch] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState('All');

  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');

  const [paymentSearch, setPaymentSearch] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('All');

  // Multi choice modals states
  const [inspectedAppForDocs, setInspectedAppForDocs] = useState(null);
  const [inspectedAppForFullView, setInspectedAppForFullView] = useState(null);

  // Emails form state variables
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailContent, setEmailContent] = useState('');
  
  const [insuranceTargetEmail, setInsuranceTargetEmail] = useState('');
  const [insurancePolicyUrl, setInsurancePolicyUrl] = useState('');

  // Primary data synchronized initializer
  const fetchAllData = async () => {
    setIsSyncing(true);
    try {
      const resp = await api.admin.getAllRecords();
      if (resp) {
        setSystemRecords({
          cars: resp.cars || [],
          applications: resp.applications || [],
          users: resp.users || [],
          payments: resp.payments || [],
          emails: resp.emails || [],
          inquiries: resp.inquiries || []
        });
        setAlertBanner({ type: 'success', text: 'Database synchronized and accounts verified.' });
      }
    } catch (err) {
      console.error("[ALL-RECORDS-FETCH-ERROR]:", err);
      setAlertBanner({ type: 'error', text: 'Credentials validation failure. Could not download portfolio archives.' });
    } finally {
      setIsSyncing(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const clearAlertWithTimeout = () => {
    setTimeout(() => setAlertBanner(null), 4000);
  };

  useEffect(() => {
    if (alertBanner) {
      clearAlertWithTimeout();
    }
  }, [alertBanner]);

  // Car operations
  const handleToggleCarStatus = async (carId, currentStatus) => {
    const nextStatus = currentStatus === 'Available' ? 'Reserved' : 'Available';
    try {
      await api.admin.editCar(carId, { status: nextStatus });
      setAlertBanner({ type: 'success', text: `Status for vehicle index ${carId} configured to ${nextStatus}.` });
      fetchAllData();
    } catch (err) {
      setAlertBanner({ type: 'error', text: err.message || 'Error updating status.' });
    }
  };

  const handleDeleteCarAction = async (carId) => {
    if (window.confirm('Delete Vehicle Catalog Item: Are you sure you want to permanently delete this stock record? This cannot be undone.')) {
      try {
        await api.admin.deleteCar(carId);
        setAlertBanner({ type: 'success', text: 'Vehicle stock clearance executed successfully.' });
        fetchAllData();
      } catch (err) {
        setAlertBanner({ type: 'error', text: err.message || 'Clearance error' });
      }
    }
  };

  const handleCarFormSubmit = async (payload) => {
    setActionLoading(true);
    try {
      if (carViewMode === 'add') {
        const resp = await api.admin.addCar(payload);
        setAlertBanner({ type: 'success', text: 'Portfolio vehicle mapped. Standard rates and specifications published.' });
      } else {
        await api.admin.editCar(selectedCar.id, payload);
        setAlertBanner({ type: 'success', text: 'Vehicle specifications updated.' });
      }
      setCarViewMode('list');
      setSelectedCar(null);
      fetchAllData();
    } catch (err) {
      setAlertBanner({ type: 'error', text: err.message || 'Operation failed.' });
    } finally {
      setActionLoading(false);
    }
  };

  // Underwrite application action saves
  const handleUnderwritingAction = async (appId, decision, notes, checklistsObj) => {
    setActionLoading(true);
    try {
      await api.admin.updateApplicationStatus(appId, {
        status: decision,
        step: decision === 'Approved' ? 4 : 2, // 4 for cleared/paid driver, 2 for pending review decisions
        underwritingNotes: notes,
        validationChecklists: checklistsObj
      });

      // Dispatch automated notification body for audit confirmation
      const app = systemRecords.applications.find(a => a.id === appId);
      if (app) {
        await api.admin.sendEmail({
          userId: app.userId,
          userEmail: app.userEmail,
          subject: `Underwriting Decision: Vehicle licensing application status - ${decision.toUpperCase()}`,
          content: decision === 'Approved' 
            ? `Congratulations! Your underwriting check has been cleared. The status is now APPROVED. Log in to reserve your Heathrow vehicle collection date. Notes: ${notes}`
            : `Dear Driver, your Rent-to-Buy dossier has been updated with review requirements. Present Status: REJECTED. Underwriter Notes: ${notes}`
        });
      }

      setAlertBanner({ type: 'success', text: `Underwriting file #${appId} updated to ${decision.toUpperCase()}.` });
      setInspectedAppForFullView(null);
      setInspectedAppForDocs(null);
      fetchAllData();
    } catch (err) {
      setAlertBanner({ type: 'error', text: err.message || 'Failed to file credentials decisions.' });
    } finally {
      setActionLoading(false);
    }
  };

  // User Management block toggle & roles
  const handleToggleBlockUser = async (email, blockedCurrently) => {
    try {
      await api.admin.updateUserStatus(email, !blockedCurrently);
      setAlertBanner({ 
        type: 'success', 
        text: `Driver ${email} has been ${!blockedCurrently ? 'Suspended' : 'Unblocked'}` 
      });
      fetchAllData();
    } catch (err) {
      setAlertBanner({ type: 'error', text: err.message || 'Driver update failed.' });
    }
  };

  const handleDeleteUser = async (email) => {
    if (window.confirm(`Purge profile credentials for driver: ${email}? This clears historical application references.`)) {
      try {
        await api.admin.deleteUser(email);
        setAlertBanner({ type: 'success', text: 'Driver credentials and file registries deleted.' });
        fetchAllData();
      } catch (err) {
        setAlertBanner({ type: 'error', text: err.message || 'Driver deletion failed.' });
      }
    }
  };

  // Manual payment verification ledger logs
  const handleVerifyManualPayment = async (payId) => {
    if (window.confirm('Confirm and Audit Receipt: Verify that the weekly deposit amount has cleared the bank accounts?')) {
      try {
        await api.admin.updatePaymentStatus(payId, 'Verified');
        setAlertBanner({ type: 'success', text: 'Deposits receipts verified. License account credited.' });
        fetchAllData();
      } catch (err) {
        setAlertBanner({ type: 'error', text: err.message || 'Verification error' });
      }
    }
  };

  // Send Manual text email
  const handleSendManualEmail = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const userObj = systemRecords.users.find(u => u.email === emailTo);
      await api.admin.sendEmail({
        userId: userObj?.id || 1,
        userEmail: emailTo,
        subject: emailSubject,
        content: emailContent
      });
      setAlertBanner({ type: 'success', text: `System dispatch complete. Registered target successfully notified.` });
      setEmailSubject('');
      setEmailContent('');
      setEmailTo('');
      fetchAllData();
    } catch (err) {
      setAlertBanner({ type: 'error', text: err.message || 'Email courier failed.' });
    } finally {
      setActionLoading(false);
    }
  };

  // Insurance attachments policy dispatch
  const handleUploadInsuranceAction = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await api.admin.uploadInsurance({
        email: insuranceTargetEmail,
        policyUrl: insurancePolicyUrl
      });
      setAlertBanner({ type: 'success', text: 'Official Comprehensive Fleet coverage certificates attached. Driver alert generated.' });
      setInsuranceTargetEmail('');
      setInsurancePolicyUrl('');
      fetchAllData();
    } catch (err) {
      setAlertBanner({ type: 'error', text: err.message || 'Insurance cover attachment failed.' });
    } finally {
      setActionLoading(false);
    }
  };

  // Calculated aggregations for Dashboard Cards
  const totalCarsCount = systemRecords.cars?.length || 0;
  const totalAppsCount = systemRecords.applications?.length || 0;
  
  const pendingAppsCount = systemRecords.applications?.filter(
    a => a.status !== 'Approved' && a.status !== 'Rejected'
  )?.length || 0;

  const approvedAppsCount = systemRecords.applications?.filter(a => a.status === 'Approved')?.length || 0;
  const rejectedAppsCount = systemRecords.applications?.filter(a => a.status === 'Rejected')?.length || 0;

  const verifiedPaymentsCount = systemRecords.payments?.filter(p => p.status === 'Verified')?.length || 0;
  const totalRevenue = systemRecords.payments?.reduce((total, p) => total + (Number(p.amount) || 0), 0) || 0;

  // Filter lists (Search selectors)
  const filteredCars = systemRecords.cars?.filter(car => {
    const matchesSearch = car.name?.toLowerCase().includes(carSearch.toLowerCase()) || 
                          car.brand?.toLowerCase().includes(carSearch.toLowerCase()) ||
                          car.model?.toLowerCase().includes(carSearch.toLowerCase());
    const matchesFilter = carStatusFilter === 'All' || car.status === carStatusFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredApplications = systemRecords.applications?.filter(app => {
    const term = appSearch.toLowerCase();
    const nameStr = app.fullName || app.applyDetails?.fullName || '';
    const carNameStr = app.carName || '';
    const emailStr = app.userEmail || '';
    const matchesSearch = nameStr.toLowerCase().includes(term) || carNameStr.toLowerCase().includes(term) || emailStr.toLowerCase().includes(term);
    
    let matchesStatus = true;
    if (appStatusFilter !== 'All') {
      if (appStatusFilter === 'Pending') {
        matchesStatus = app.status !== 'Approved' && app.status !== 'Rejected';
      } else {
        matchesStatus = app.status === appStatusFilter;
      }
    }
    return matchesSearch && matchesStatus;
  });

  const filteredUsers = systemRecords.users?.filter(u => {
    const matchesSearch = u.fullName?.toLowerCase().includes(userSearch.toLowerCase()) || 
                          u.email?.toLowerCase().includes(userSearch.toLowerCase());
    const matchesFilter = userRoleFilter === 'All' || u.role === userRoleFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredPayments = systemRecords.payments?.filter(p => {
    const matchesSearch = p.userEmail?.toLowerCase().includes(paymentSearch.toLowerCase()) || 
                          p.carName?.toLowerCase().includes(paymentSearch.toLowerCase());
    const matchesFilter = paymentStatusFilter === 'All' || p.status === paymentStatusFilter;
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return <Loader label="Booting Backoffice Heathrow Console..." />;
  }

  return (
    <div className="md:h-screen md:overflow-hidden h-auto flex flex-col md:flex-row font-sans text-gray-800 bg-gray-50" id="super-admin-root">
      
      {/* Sidebar navigation */}
      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        systemRecords={systemRecords}
        onSync={fetchAllData}
        isSyncing={isSyncing}
      />

      {/* Main Administrative viewport */}
      <main className="flex-1 flex flex-col min-w-0 bg-gray-50 md:h-screen md:overflow-y-auto overflow-x-hidden">
        
        {/* Top Navbar Header */}
        <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 text-gray-500 hover:text-gray-700 bg-gray-50 border border-gray-200 rounded-lg"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-sm font-black text-[#1F3F7A] uppercase tracking-wide">
                Heathrow Hub Portals
              </h2>
              <p className="text-[10.5px] text-gray-400 capitalize hidden sm:block">
                Operations / {activeTab.replace('-', ' ')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 font-sans">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#1F3F7A]/8 flex items-center justify-center text-xs font-bold text-[#1F3F7A]">
                HQ
              </div>
              <span className="text-xs font-bold text-gray-700 hidden md:inline">
                {user?.fullName || 'Heathrow Admin'}
              </span>
            </div>
          </div>
        </header>

        {/* Content canvas container */}
        <div className="flex-grow p-6 space-y-6">
          
          {/* Global Alert Notification Banner */}
          {alertBanner && (
            <div 
              className={`p-4 rounded-xl border flex items-center gap-3 animate-fade-in ${
                alertBanner.type === 'success' 
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
                  : 'bg-rose-50 border-rose-100 text-rose-800'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${alertBanner.type === 'success' ? 'text-emerald-500' : 'text-rose-500'}`} />
              <span className="text-xs font-semibold">{alertBanner.text}</span>
            </div>
          )}

          {/* ==========================================
              TAB 1: DASHBOARD HOMEPAGE OVERVIEW
              ========================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fade-in" id="dashboard-overview-module">
              {/* Intro Title */}
              <div>
                <h1 className="text-xl font-black text-[#1F3F7A] uppercase">Dashboard Overview</h1>
                <p className="text-xs text-gray-400 mt-1">Real-time status indexes, weekly cashflow counts, and fleet portfolio indices.</p>
              </div>

              {/* Bento-grid of numerical indices */}
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                
                {/* 1. Vehicles */}
                <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-[#1F3F7A]/30 transition">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Fleet Portfolio</span>
                  <div className="mt-2.5">
                    <span className="text-2xl font-black text-[#1F3F7A] font-mono leading-none block">{totalCarsCount}</span>
                    <span className="text-[10px] text-gray-450 mt-1 block">Vehicles in system</span>
                  </div>
                </div>

                {/* 2. Total Applications */}
                <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-[#1F3F7A]/30 transition">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Total Dossiers</span>
                  <div className="mt-2.5">
                    <span className="text-2xl font-black text-[#1F3F7A] font-mono leading-none block">{totalAppsCount}</span>
                    <span className="text-[10px] text-gray-450 mt-1 block">Submitted requests</span>
                  </div>
                </div>

                {/* 3. Pending Underwriting */}
                <div className="bg-white border border-[#1F3F7A]/10 rounded-2xl p-5 bg-amber-50/10 flex flex-col justify-between hover:border-amber-500/20 transition">
                  <span className="text-[10px] text-amber-600 font-black uppercase tracking-wider block">Pending Review</span>
                  <div className="mt-2.5">
                    <span className="text-2xl font-black text-amber-500 font-mono leading-none block">{pendingAppsCount}</span>
                    <span className="text-[10px] text-amber-700/75 mt-1 block">Awaiting decision</span>
                  </div>
                </div>

                {/* 4. Approved Underwriting */}
                <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-emerald-500/20 transition">
                  <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider block">Approved Clearing</span>
                  <div className="mt-2.5">
                    <span className="text-2xl font-black text-emerald-500 font-mono leading-none block">{approvedAppsCount}</span>
                    <span className="text-[10px] text-emerald-600 mt-1 block">Driver cards approved</span>
                  </div>
                </div>

                {/* 5. Reject Ratio */}
                <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-red-500/20 transition">
                  <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider block">Rejected Dossiers</span>
                  <div className="mt-2.5">
                    <span className="text-2xl font-black text-red-505 font-mono leading-none block">{rejectedAppsCount}</span>
                    <span className="text-[10px] text-red-500 mt-1 block">Disqualified folders</span>
                  </div>
                </div>

                {/* 6. Total Cash Receipts */}
                <div className="bg-white border border-[#7CC242]/20 rounded-2xl p-5 bg-[#7CC242]/5 flex flex-col justify-between hover:border-[#7CC242]/40 transition">
                  <span className="text-[10px] text-emerald-700 font-black uppercase tracking-wider block">Receipted Ledger</span>
                  <div className="mt-2.5">
                    <span className="text-xl font-black text-emerald-600 font-mono leading-none block">£{totalRevenue}</span>
                    <span className="text-[10px] text-[#7CC242] font-black mt-1 block">Deposits Receipted</span>
                  </div>
                </div>
              </div>

              {/* Split tables showing recent activities */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-2">
                
                {/* Left pane: Selected recent applications */}
                <div className="lg:col-span-12 bg-white border border-gray-150 p-6 rounded-2xl shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-2 gap-3">
                    <h3 className="text-xs font-black uppercase text-[#1F3F7A]">Recent Application Submissions</h3>
                    <button
                      onClick={() => {
                        setActiveTab('all-applications');
                        setAppCurrentPage(1);
                      }}
                      className="px-4 py-1.5 bg-[#1F3F7A] hover:bg-opacity-95 text-white font-bold text-[11px] uppercase tracking-wider rounded-xl transition shadow-xs cursor-pointer"
                    >
                      View All Applications
                    </button>
                  </div>
                  {systemRecords.applications?.length === 0 ? (
                    <p className="text-xs text-gray-500 py-6 text-center">No driver underwriting folders registered.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-[10px] border-b border-gray-100">
                            <th className="py-2.5 px-3">Applicant Name</th>
                            <th className="py-2.5 px-3">Vehicle Class</th>
                            <th className="py-2.5 px-3">Dues</th>
                            <th className="py-2.5 px-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-medium">
                          {systemRecords.applications.slice(0, 5).map(app => (
                            <tr key={app.id} className="hover:bg-gray-50 transition">
                              <td className="py-3 px-3">
                                <span className="font-bold text-[#1F3F7A] block">{app.fullName || app.applyDetails?.fullName || "Not Specified"}</span>
                                <span className="text-[10px] text-gray-400 font-mono block mt-0.5">{app.userEmail}</span>
                              </td>
                              <td className="py-3 px-3 text-gray-700 text-xs">
                                {app.carName}
                              </td>
                              <td className="py-3 px-3 font-mono font-bold text-gray-800 text-xs">
                                {app.applyDetails?.weeklyIncome ? `£${app.applyDetails.weeklyIncome}/wk` : 'N/A'}
                              </td>
                              <td className="py-3 px-3">
                                <span className={`inline-block px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider leading-none ${
                                  app.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                  app.status === 'Rejected' ? 'bg-red-50 text-red-750 border border-red-100' : 
                                  'bg-amber-50 text-amber-700 border border-amber-100'
                                }`}>
                                  {app.status || 'Pending'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* ==========================================
              TAB 2: VEHICLES MANAGEMENT
              ========================================== */}
          {activeTab === 'cars' && (
            <div className="space-y-6 animate-fade-in" id="cars-module">
              {carViewMode === 'list' ? (
                <>
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <div>
                      <h1 className="text-xl font-black text-[#1F3F7A] uppercase">Vehicles Catalog Management</h1>
                      <p className="text-xs text-gray-400 mt-1">Configure weekly portfolio models, update rates lists, and upload multiple high-res product photos.</p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCar(null);
                        setCarViewMode('add');
                      }}
                      className="px-4 py-2 bg-[#1F3F7A] hover:bg-opacity-90 text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center gap-2 self-start sm:self-auto transition shadow-sm cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Insert New Portfolio</span>
                    </button>
                  </div>

                  {/* Filter Search controls bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-white p-3.5 rounded-2xl border border-gray-200">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search stock models..."
                        value={carSearch}
                        onChange={(e) => setCarSearch(e.target.value)}
                        className="w-full text-xs py-2.5 pl-8 pr-3 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl placeholder-gray-400 outline-none focus:bg-white focus:border-[#1F3F7A] transition"
                      />
                      <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-3" />
                    </div>
                    <div>
                      <select
                        value={carStatusFilter}
                        onChange={(e) => setCarStatusFilter(e.target.value)}
                        className="w-full text-xs py-2.5 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl outline-none focus:bg-white focus:border-[#1F3F7A] px-2 transition"
                      >
                        <option value="All">All Availabilities</option>
                        <option value="Available">Available Status</option>
                        <option value="Reserved">Reserved Hold</option>
                        <option value="Out of Stock">Out of Stock</option>
                      </select>
                    </div>
                  </div>

                  {filteredCars.length === 0 ? (
                    <div className="bg-white border border-gray-150 p-12 text-center rounded-2xl">
                      <HelpCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <span className="block text-gray-700 font-bold mb-1 col">Catalog item not found</span>
                      <p className="text-xs text-gray-500">No vehicle matches your current filter selectors.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="vehicles-catalog-listing">
                      {filteredCars.map((car) => {
                        const imagesArray = Array.isArray(car.images) ? car.images : (car.image ? [car.image] : []);
                        
                        return (
                          <div key={car.id} className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition duration-300 flex flex-col justify-between">
                            <div>
                              {/* Main image with badge */}
                              <div className="relative aspect-video bg-gray-100">
                                <img 
                                  src={getImageUrl(car.image)} 
                                  alt={car.name} 
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                                {car.badge && (
                                  <span className="absolute top-3 left-3 bg-[#1F3F7A] text-white text-[9px] font-black uppercase tracking-wider py-1 px-2.5 rounded-md leading-none">
                                    {car.badge}
                                  </span>
                                )}
                                <span className={`absolute top-3 right-3 py-1 px-2.5 rounded-md text-[9px] font-black uppercase tracking-wider leading-none ${
                                  car.status === 'Available' ? 'bg-[#7CC242] text-white' : 'bg-amber-500 text-white'
                                }`}>
                                  {car.status}
                                </span>
                              </div>

                              <div className="p-5 space-y-3">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-sans font-black text-base text-[#1F3F7A] tracking-tight">{car.brand} {car.name}</h4>
                                    <span className="text-[10px] text-gray-400 uppercase tracking-widest font-mono block mt-0.5">{car.model}</span>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-sm font-black text-emerald-600 block">£{car.weeklyRate || car.price} <span className="text-[10px] text-gray-400 font-bold col">/ wk</span></span>
                                    <span className="text-[10px] text-gray-400 block font-mono mt-0.5">£{car.monthlyRate || (Number(car.weeklyRate || car.price) * 4)}/mo</span>
                                  </div>
                                </div>

                                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed h-8">
                                  {car.description || 'No public model details available.'}
                                </p>

                                {/* Specs ticker summary */}
                                <div className="grid grid-cols-2 gap-2 text-[10px] text-gray-550 border-t border-gray-100 pt-3 font-mono">
                                  <span>Engine: {Array.isArray(car.specifications) ? car.specifications.find(s => s.toLowerCase().startsWith('engine:'))?.replace(/Engine:/i, '').trim() || '1.8L Hybrid' : '1.8L Hybrid'}</span>
                                  <span>Fuel: {car.fuel || 'Hybrid'}</span>
                                  <span>Trans: {car.transmission || 'Auto'}</span>
                                  <span>Odom: {car.mileage || '15k miles'}</span>
                                </div>

                                {/* Images gallery count preview */}
                                <div className="text-[9.5px] text-[#1F3F7A]/75 font-bold uppercase tracking-wider bg-gray-50 p-2 rounded-lg border border-gray-100 flex items-center justify-between">
                                  <span>Catalog Gallery Media</span>
                                  <span className="bg-white px-1.5 py-0.5 rounded shadow-2xs text-[#1F3F7A] font-bold font-mono text-[9px]">{imagesArray.length} photos</span>
                                </div>
                              </div>
                            </div>

                            {/* Options action drawer */}
                            <div className="p-5 border-t border-gray-100 bg-gray-50 flex items-center gap-2">
                              <button
                                onClick={() => handleToggleCarStatus(car.id, car.status)}
                                className="flex-1 py-2 border border-gray-200 hover:bg-gray-100 text-[#1F3F7A] text-[10px] font-black uppercase tracking-wider rounded-xl transition cursor-pointer"
                              >
                                {car.status === 'Available' ? 'Hold / Reserve' : 'Set Available'}
                              </button>
                              
                              <button
                                onClick={() => {
                                  setSelectedCar(car);
                                  setCarViewMode('edit');
                                }}
                                className="px-3 py-2 bg-[#1F3F7A] hover:bg-opacity-90 text-white rounded-xl transition cursor-pointer"
                                title="Edit specs"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleDeleteCarAction(car.id)}
                                className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-650 border border-rose-200 rounded-xl transition cursor-pointer"
                                title="Clear stock"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                <AdminCarForm 
                  car={selectedCar} 
                  onCancel={() => {
                    setCarViewMode('list');
                    setSelectedCar(null);
                  }}
                  onSubmit={handleCarFormSubmit}
                  isLoading={actionLoading}
                  api={api}
                />
              )}
            </div>
          )}

          {/* ==========================================
              TAB 3: UNDERWRITING APPLICATIONS
              ========================================== */}
          {activeTab === 'applications' && (
            <div className="space-y-6 animate-fade-in" id="applications-module">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <h1 className="text-xl font-black text-[#1F3F7A] uppercase">Underwriting Verification Queue</h1>
                  <p className="text-xs text-gray-400 mt-1">Audit complete driver applications dossiers. Review uploaded driving license letters and selfie credentials matching checklists.</p>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('all-applications');
                    setAppCurrentPage(1);
                  }}
                  className="px-4 py-2 bg-[#1F3F7A] hover:bg-opacity-95 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow cursor-pointer shrink-0"
                >
                  View All Applications
                </button>
              </div>

              {/* Filters selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-white p-3.5 rounded-2xl border border-gray-200">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search applicant or vehicle..."
                    value={appSearch}
                    onChange={(e) => setAppSearch(e.target.value)}
                    className="w-full text-xs py-2.5 pl-8 pr-3 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl outline-none focus:bg-white focus:border-[#1F3F7A] transition"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-3" />
                </div>
                <div>
                  <select
                    value={appStatusFilter}
                    onChange={(e) => setAppStatusFilter(e.target.value)}
                    className="w-full text-xs py-2.5 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl outline-none focus:bg-white px-2 transition"
                  >
                    <option value="All">All statuses</option>
                    <option value="Pending">Pending / review required</option>
                    <option value="Approved">Approved cleared</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {filteredApplications.length === 0 ? (
                <div className="bg-white border border-gray-255 p-12 text-center rounded-2xl">
                  <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <span className="block text-gray-700 font-bold mb-1">Queue empty</span>
                  <p className="text-xs text-gray-500">No applicant dossiers matched filtering parameters.</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-150 overflow-hidden shadow-2xs">
                  {/* Desktop View Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse font-sans">
                      <thead>
                        <tr className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-[10px] border-b border-gray-100">
                          <th className="py-4 px-5">Applicant Name</th>
                          <th className="py-4 px-5">Email Coordinates</th>
                          <th className="py-4 px-5">Selected Vehicle</th>
                          <th className="py-4 px-5">Income Summary</th>
                          <th className="py-4 px-5">Date Logged</th>
                          <th className="py-4 px-5">Status</th>
                          <th className="py-4 px-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-medium">
                        {filteredApplications.map((app) => (
                          <tr key={app.id} className="hover:bg-gray-50 transition border-b border-gray-50">
                            <td className="py-4 px-5">
                              <span className="font-sans font-black text-[#1F3F7A] text-sm block">
                                {app.fullName || app.applyDetails?.fullName || "Not Specified"}
                              </span>
                              {app.phone && <span className="text-[10px] text-gray-400 block font-mono mt-0.5">Ph: {app.phone}</span>}
                            </td>
                            <td className="py-4 px-5 font-mono text-gray-600">
                              {app.userEmail}
                            </td>
                            <td className="py-4 px-5 text-[#1F3F7A] font-semibold text-xs text-indigo-900">
                              {app.carName}
                            </td>
                            <td className="py-4 px-5">
                              <span className="font-mono text-emerald-600 font-bold text-xs">{app.applyDetails?.weeklyIncome ? `£${app.applyDetails.weeklyIncome}/wk` : 'N/A'}</span>
                              <span className="text-[10px] text-gray-400 block mt-0.5">{app.applyDetails?.employment || 'Unknown'}</span>
                            </td>
                            <td className="py-4 px-5 text-gray-400 font-mono text-[11px]">
                              {app.dateApplied || 'N/A'}
                            </td>
                            <td className="py-4 px-5">
                              <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] uppercase font-black tracking-wider leading-none ${
                                app.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                app.status === 'Rejected' ? 'bg-red-50 text-red-750 border border-red-100' :
                                'bg-amber-50 text-amber-700 border border-amber-100'
                              }`}>
                                {app.status || 'Pending'}
                              </span>
                            </td>
                            <td className="py-4 px-5 text-right space-x-2">
                              {/* View Documents Option Button */}
                              <button
                                onClick={() => setInspectedAppForDocs(app)}
                                className="px-3 py-1.5 border border-indigo-200 text-indigo-700 hover:bg-[#1F3F7A]/5 font-bold text-[10px] uppercase tracking-wider rounded-lg transition"
                                title="Load identity documents gallery"
                              >
                                View Papers
                              </button>

                              {/* View Full Application Detail modal */}
                              <button
                                onClick={() => setInspectedAppForFullView(app)}
                                className="px-3 py-1.5 bg-[#1F3F7A] hover:bg-opacity-90 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition"
                                title="Inspect underwriting decision checks"
                              >
                                Audit Folder
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards Queue (Highly responsive layout) */}
                  <div className="md:hidden space-y-4 p-4 text-xs font-sans">
                    {filteredApplications.map((app) => (
                      <div key={app.id} className="border border-gray-150 rounded-xl p-4 bg-gray-50 space-y-3 shadow-3xs hover:border-[#1F3F7A]/30 transition">
                        <div className="flex justify-between items-start select-none">
                          <div>
                            <strong className="text-sm font-sans font-black text-[#1F3F7A] block leading-none">{app.fullName || app.applyDetails?.fullName || 'Applicant'}</strong>
                            <span className="text-[10px] text-gray-400 block mt-1">{app.userEmail}</span>
                          </div>
                          <span className={`inline-block px-2 py-0.5 rounded text-[9.5px] uppercase font-bold leading-none ${
                            app.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                            app.status === 'Rejected' ? 'bg-red-50 text-red-750 border border-red-100' :
                            'bg-amber-50 text-amber-750 border border-amber-100'
                          }`}>
                            {app.status || 'Pending'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px] border-y border-gray-200/50 py-2.5 my-1 tracking-wide font-sans text-gray-600">
                          <div>
                            Target: <strong className="text-[#1F3F7A] block font-semibold text-xs mt-0.5 truncate">{app.carName}</strong>
                          </div>
                          <div>
                            Date: <span className="text-gray-500 font-mono block text-xs mt-0.5">{app.dateApplied}</span>
                          </div>
                        </div>

                        {/* Controls drawers info */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => setInspectedAppForDocs(app)}
                            className="flex-1 py-2 text-center border border-gray-200 text-[#1F3F7A] text-[10px] font-black uppercase tracking-wider rounded-xl transition bg-white cursor-pointer"
                          >
                            Read ID Files
                          </button>
                          
                          <button
                            onClick={() => setInspectedAppForFullView(app)}
                            className="flex-1 py-2 text-center bg-[#1F3F7A] hover:bg-opacity-90 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition cursor-pointer"
                          >
                            Audit Status
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}
            </div>
          )}

          {/* ==========================================
              TAB 4: DRIVERS DATABASE INDEX
              ========================================== */}
          {activeTab === 'users' && (
            <div className="space-y-6 animate-fade-in" id="driver-partners-module">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <h1 className="text-xl font-black text-[#1F3F7A] uppercase">Driver Members Database</h1>
                  <p className="text-xs text-gray-400 mt-1">Review authenticated profiles, manage role groups, or suspend active system login licenses.</p>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('all-users');
                    setUserCurrentPage(1);
                    setSelectedUserDetail(null);
                  }}
                  className="px-4 py-2 bg-[#1F3F7A] hover:bg-opacity-95 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow cursor-pointer shrink-0"
                >
                  View All Users
                </button>
              </div>

              {/* Filters selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3.5 rounded-2xl border border-gray-200">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by driver name or email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full text-xs py-2.5 pl-8 pr-3 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl placeholder-gray-400 outline-none focus:bg-white focus:border-[#1F3F7A] transition"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-3.5" />
                </div>
                <div>
                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="w-full text-xs py-2.5 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl outline-none focus:bg-white px-2 transition"
                  >
                    <option value="All">All User Roles</option>
                    <option value="admin">Administrators Only</option>
                    <option value="user">Driver Partners Only</option>
                  </select>
                </div>
              </div>

              {filteredUsers.length === 0 ? (
                <p className="text-xs text-gray-500 py-12 bg-white rounded-2xl border text-center">No driver profiles matched search filters.</p>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-150 overflow-hidden shadow-2xs">
                  {/* Table view */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse font-sans">
                      <thead>
                        <tr className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-[10px] border-b border-gray-100">
                          <th className="py-3.5 px-5">Driver Name</th>
                          <th className="py-3.5 px-5">Email Address</th>
                          <th className="py-3.5 px-5">Role Group</th>
                          <th className="py-3.5 px-5">Logged Files</th>
                          <th className="py-3.5 px-5">System status</th>
                          <th className="py-3.5 px-5 text-right">Administrative Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-medium">
                        {filteredUsers.map((usr) => {
                          const userAppsCount = systemRecords.applications?.filter(a => a.userEmail?.toLowerCase() === usr.email?.toLowerCase()).length || 0;
                          return (
                            <tr key={usr.email} className="hover:bg-gray-50 transition border-b border-gray-50">
                              <td className="py-3.5 px-5 text-[#1F3F7A] font-black text-sm">
                                {usr.fullName || 'Driver Partner'}
                              </td>
                              <td className="py-3.5 px-5 font-mono text-gray-600">
                                {usr.email}
                              </td>
                              <td className="py-3.5 px-5">
                                <span className={`inline-block px-2 py-0.5 rounded text-[9.5px] font-black tracking-wider leading-none ${
                                  usr.role === 'admin' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-gray-100 text-gray-700'
                                }`}>
                                  {usr.role || 'user'}
                                </span>
                              </td>
                              <td className="py-3.5 px-5 font-mono text-gray-500">
                                {userAppsCount} folder(s)
                              </td>
                              <td className="py-3.5 px-5">
                                <span className={`inline-block px-2 py-0.5 rounded text-[9.5px] font-bold leading-none ${
                                  usr.blocked ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                }`}>
                                  {usr.blocked ? '✘ SUSPENDED' : '✔ ACTIVE'}
                                </span>
                              </td>
                              <td className="py-3.5 px-5 text-right space-x-2">
                                <button
                                  type="button"
                                  onClick={async () => {
                                    const nextRole = usr.role === 'admin' ? 'user' : 'admin';
                                    try {
                                      await api.admin.updateUserRole(usr.email, nextRole);
                                      setAlertBanner({ type: 'success', text: `Role for ${usr.email} set to ${nextRole.toUpperCase()}.` });
                                      fetchAllData();
                                    } catch (err) {
                                      setAlertBanner({ type: 'error', text: err.message || 'Validation error' });
                                    }
                                  }}
                                  className="px-3 py-1.5 border border-gray-255 text-gray-750 text-[10px] font-bold uppercase rounded-xl hover:bg-gray-100 transition"
                                >
                                  Make {usr.role === 'admin' ? 'Driver' : 'Admin'}
                                </button>
                                
                                <button
                                  type="button"
                                  onClick={() => handleToggleBlockUser(usr.email, usr.blocked)}
                                  className={`px-3 py-1.5 border text-[10px] font-black uppercase rounded-xl transition ${
                                    usr.blocked 
                                      ? 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100' 
                                      : 'border-red-200 text-red-700 bg-red-50 hover:bg-red-100'
                                  }`}
                                >
                                  {usr.blocked ? 'Activate' : 'Suspend'}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteUser(usr.email)}
                                  className="px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-650 text-[10px] font-bold uppercase rounded-xl hover:bg-rose-100 transition"
                                >
                                  Clear Profile
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile responsive logs user grid list */}
                  <div className="md:hidden divide-y divide-gray-100 p-4 space-y-4">
                    {filteredUsers.map((usr) => {
                      const userAppsCount = systemRecords.applications?.filter(a => a.userEmail?.toLowerCase() === usr.email?.toLowerCase()).length || 0;
                      return (
                        <div key={usr.email} className="border border-gray-150 rounded-xl p-4 bg-gray-50 space-y-3.5">
                          <div className="flex justify-between items-start select-none">
                            <div>
                              <strong className="text-sm font-sans font-black text-[#1F3F7A] block leading-none">{usr.fullName || 'Driver Partner'}</strong>
                              <span className="text-[10.5px] text-gray-450 font-mono block mt-1">{usr.email}</span>
                            </div>
                            <span className="text-[9.5px] bg-[#1F3F7A]/10 text-[#1F3F7A] font-bold px-2 py-0.5 rounded uppercase">
                              {usr.role || 'user'}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-[10px] border-y border-gray-200/50 py-2.5 my-1 text-gray-550">
                            <div>
                              Folders: <strong className="text-[#1F3F7A] font-mono leading-none font-bold block mt-0.5">{userAppsCount}</strong>
                            </div>
                            <div>
                              System Status: <span className={`block font-bold leading-none mt-0.5 ${usr.blocked ? 'text-red-700' : 'text-emerald-700'}`}>{usr.blocked ? 'SUSPENDED' : '✔ ACTIVE'}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleToggleBlockUser(usr.email, usr.blocked)}
                              className={`flex-1 py-2 text-center text-[9px] font-black uppercase rounded-lg border transition cursor-pointer ${
                                usr.blocked ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'
                              }`}
                            >
                              {usr.blocked ? 'Activate Profile' : 'Suspend login'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(usr.email)}
                              className="px-3 py-2 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-650 text-[9px] font-black uppercase rounded-lg transition"
                            >
                              Purge
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==========================================
              TAB 5: PAYMENTS JOURNAL LEDGER
              ========================================== */}
          {activeTab === 'payments' && (
            <div className="space-y-6 animate-fade-in" id="payments-module">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-gray-100 pb-4 col flex-wrap">
                <div>
                  <h1 className="text-xl font-black text-[#1F3F7A] uppercase">Receivables Payments Ledger</h1>
                  <p className="text-xs text-gray-400 mt-1">Audit submitted deposits payments receipts, debit indices, and driver accounts logs.</p>
                </div>
                <div className="flex gap-2 items-center flex-wrap">
                  <button
                    onClick={() => {
                      setActiveTab('all-payments');
                      setPaymentCurrentPage(1);
                    }}
                    className="px-4 py-2 bg-[#1F3F7A] hover:bg-opacity-95 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow cursor-pointer"
                  >
                    View All Payments
                  </button>
                  <div className="p-3 bg-[#7CC242]/5 border border-[#7CC242]/20 rounded-xl flex items-center gap-1.5 self-start sm:self-auto select-none">
                    <span className="text-xs font-bold text-emerald-700 uppercase">Grand Receipts total:</span>
                    <span className="text-sm font-black text-emerald-600 font-mono">£{totalRevenue} Paid</span>
                  </div>
                </div>
              </div>

              {/* Selector filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3.5 rounded-2xl border border-gray-200">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by driver email or target EV..."
                    value={paymentSearch}
                    onChange={(e) => setPaymentSearch(e.target.value)}
                    className="w-full text-xs py-2.5 pl-8 pr-3 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl outline-none focus:bg-white focus:border-[#1F3F7A] transition"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-3.5" />
                </div>
                <div>
                  <select
                    value={paymentStatusFilter}
                    onChange={(e) => setPaymentStatusFilter(e.target.value)}
                    className="w-full text-xs py-2.5 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl outline-none focus:bg-white px-2 transition"
                  >
                    <option value="All">All Transactions</option>
                    <option value="Pending">Pending Audit check</option>
                    <option value="Verified">Verified Approved</option>
                  </select>
                </div>
              </div>

              {filteredPayments.length === 0 ? (
                <p className="text-xs text-gray-400 py-12 text-center bg-white border rounded-2xl">No transaction records match filters.</p>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-150 overflow-hidden shadow-2xs">
                  {/* Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse font-sans">
                      <thead>
                        <tr className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-[10px] border-b border-gray-100">
                          <th className="py-3 px-5">Receipt ID</th>
                          <th className="py-3 px-5">Driver Account</th>
                          <th className="py-3 px-5">License Model Target</th>
                          <th className="py-3 px-5">Date Verified</th>
                          <th className="py-3 px-5">Clearing Method</th>
                          <th className="py-3 px-5">Clearing Amount</th>
                          <th className="py-3 px-5 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-medium">
                        {filteredPayments.map((pay) => (
                          <tr key={pay.id} className="hover:bg-gray-50 transition border-b border-gray-50">
                            <td className="py-3.5 px-5 font-mono font-bold text-gray-650 text-xs">
                              {pay.id}
                            </td>
                            <td className="py-3.5 px-5 font-mono text-gray-600">
                              {pay.userEmail}
                            </td>
                            <td className="py-3.5 px-5 text-[#1F3F7A] font-bold">
                              {pay.carName}
                            </td>
                            <td className="py-3.5 px-5 font-mono text-gray-400">
                              {pay.date || 'N/A'}
                            </td>
                            <td className="py-3.5 px-5 text-gray-500">
                              {pay.method || 'Card Authorization'}
                            </td>
                            <td className="py-3.5 px-5 font-mono text-emerald-600 font-bold font-sans text-sm">
                              £{pay.amount}
                            </td>
                            <td className="py-3.5 px-5 text-right font-sans">
                              {pay.status === 'Pending' ? (
                                <button
                                  onClick={() => handleVerifyManualPayment(pay.id)}
                                  className="px-3 py-1.5 bg-[#7CC242] hover:bg-emerald-500 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition"
                                >
                                  Verify Paid
                                </button>
                              ) : (
                                <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded text-[9.5px] font-black uppercase tracking-wider leading-none">
                                  ✓ Cleared Receipt
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile responsive lists */}
                  <div className="md:hidden divide-y divide-gray-100 p-4 space-y-4">
                    {filteredPayments.map((pay) => (
                      <div key={pay.id} className="border border-gray-150 rounded-xl p-4 bg-gray-50 space-y-3 shadow-3xs">
                        <div className="flex justify-between items-start select-none">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-gray-400">Ref ID: {pay.id}</span>
                            <strong className="text-xs font-sans font-black text-[#1F3F7A] block leading-none mt-1 truncate max-w-[200px]">{pay.carName}</strong>
                          </div>
                          <span className={`inline-block px-2 py-0.5 rounded text-[9px] uppercase font-bold leading-none ${
                            pay.status === 'Verified' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {pay.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[10px] border-y border-gray-200/50 py-2.5 my-1 text-gray-550">
                          <div>
                            Driver: <span className="text-gray-500 font-mono block text-xs mt-0.5 break-all">{pay.userEmail}</span>
                          </div>
                          <div className="text-right">
                            Total: <strong className="text-emerald-600 block text-xs font-bold font-sans mt-0.5">£{pay.amount}</strong>
                          </div>
                        </div>

                        {pay.status === 'Pending' && (
                          <div className="pt-1">
                            <button
                              onClick={() => handleVerifyManualPayment(pay.id)}
                              className="w-full py-2 text-center bg-[#7CC242] text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition cursor-pointer"
                            >
                              Verify Clearing Receipt
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                </div>
              )}
            </div>
          )}

          {/* ==========================================
              TAB 6: NOTIFICATIONS Couriers
              ========================================== */}
          {activeTab === 'emails' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in" id="emails-module">
              
              {/* Left Column Manual couplers */}
              <div className="lg:col-span-6 space-y-6">
                
                {/* Send manual email trigger form */}
                <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-sm space-y-4">
                  <h3 className="font-sans font-black text-xs text-[#1F3F7A] uppercase tracking-wider border-b border-gray-100 pb-2">Manual courier Dispatcher</h3>
                  
                  <form onSubmit={handleSendManualEmail} className="space-y-4 text-xs font-sans">
                    <div className="relative font-sans text-xs">
                      {emailToIsOpen && (
                        <div className="fixed inset-0 z-10" onClick={() => setEmailToIsOpen(false)} />
                      )}
                      <label className="block text-[#1F3F7A]/80 font-bold mb-1.5 uppercase">Target Recipient Address</label>
                      <div className="relative z-20">
                        <input
                          type="text"
                          placeholder="Type to search by name or email..."
                          value={emailToSearch}
                          onChange={(e) => {
                            setEmailToSearch(e.target.value);
                            setEmailToIsOpen(true);
                            const matched = systemRecords.users?.find(u => `${u.fullName || ''} (${u.email})` === e.target.value || u.email === e.target.value);
                            if (matched) {
                              setEmailTo(matched.email);
                            } else {
                              setEmailTo('');
                            }
                          }}
                          onFocus={() => setEmailToIsOpen(true)}
                          className="w-full text-xs p-3 bg-gray-50 border border-gray-200 text-gray-800 outline-none rounded-xl focus:bg-white focus:border-[#1F3F7A] transition"
                          required
                        />
                        {emailTo && (
                          <button
                            type="button"
                            onClick={() => {
                              setEmailTo('');
                              setEmailToSearch('');
                            }}
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 font-bold"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                      {emailToIsOpen && (
                        <div className="absolute z-30 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto divide-y divide-gray-50">
                          {systemRecords.users?.filter(u => {
                            const term = emailToSearch.toLowerCase();
                            return (u.fullName || '').toLowerCase().includes(term) || (u.email || '').toLowerCase().includes(term);
                          }).map(u => (
                            <button
                              key={u.email}
                              type="button"
                              onClick={() => {
                                setEmailTo(u.email);
                                setEmailToSearch(`${u.fullName || u.email} (${u.email})`);
                                setEmailToIsOpen(false);
                              }}
                              className="w-full text-left p-3 hover:bg-gray-50 text-xs transition flex justify-between gap-2"
                            >
                              <span className="font-bold text-[#1F3F7A]">{u.fullName || 'No Name'}</span>
                              <span className="text-gray-400 font-mono truncate">{u.email}</span>
                            </button>
                          ))}
                          {systemRecords.users?.filter(u => {
                            const term = emailToSearch.toLowerCase();
                            return (u.fullName || '').toLowerCase().includes(term) || (u.email || '').toLowerCase().includes(term);
                          }).length === 0 && (
                            <div className="p-3 text-center text-gray-400 italic">No matches found</div>
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-[#1F3F7A]/80 font-bold mb-1.5 uppercase col">Alert Subject Line</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Schedule Heathrow Vehicle Collection Delivery Date"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        className="w-full text-xs p-3 bg-gray-50 border border-gray-200 text-gray-800 outline-none rounded-xl focus:bg-white focus:border-[#1F3F7A] transition"
                      />
                    </div>

                    <div>
                      <label className="block text-[#1F3F7A]/80 font-bold mb-1.5 uppercase col">Mail Body Content</label>
                      <textarea
                        required
                        rows={5}
                        placeholder="Describe collection steps, comprehensive insurance checks required, and logistics notes..."
                        value={emailContent}
                        onChange={(e) => setEmailContent(e.target.value)}
                        className="w-full text-xs p-3.5 bg-gray-50 border border-gray-200 text-gray-800 outline-none rounded-xl focus:bg-white focus:border-[#1F3F7A] transition animate-fade-in"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={actionLoading}
                        className="w-full py-3 bg-[#1F3F7A] hover:bg-opacity-90 text-white text-xs font-black uppercase tracking-wider rounded-xl transition shadow flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5 text-white/80" />
                        <span>Dispatch Courier Notification</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Insurance Policy dispatch */}
                <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-sm space-y-4">
                  <h3 className="font-sans font-black text-xs text-[#1F3F7A] uppercase border-b border-gray-100 pb-2">Attach comprehensive motor cover policy</h3>
                  
                  <form onSubmit={handleUploadInsuranceAction} className="space-y-4 text-xs font-sans">
                    <div className="relative font-sans text-xs">
                      {insuranceIsOpen && (
                        <div className="fixed inset-0 z-10" onClick={() => setInsuranceIsOpen(false)} />
                      )}
                      <label className="block text-[#1F3F7A]/80 font-bold mb-1.5 uppercase">Select Target driver</label>
                      <div className="relative z-20">
                        <input
                          type="text"
                          placeholder="Type to search by name or email..."
                          value={insuranceSearch}
                          onChange={(e) => {
                            setInsuranceSearch(e.target.value);
                            setInsuranceIsOpen(true);
                            const matched = systemRecords.users?.find(u => `${u.fullName || ''} (${u.email})` === e.target.value || u.email === e.target.value);
                            if (matched) {
                              setInsuranceTargetEmail(matched.email);
                            } else {
                              setInsuranceTargetEmail('');
                            }
                          }}
                          onFocus={() => setInsuranceIsOpen(true)}
                          className="w-full text-xs p-3 bg-gray-50 border border-gray-200 text-gray-800 outline-none rounded-xl focus:bg-white focus:border-[#1F3F7A] transition"
                          required
                        />
                        {insuranceTargetEmail && (
                          <button
                            type="button"
                            onClick={() => {
                              setInsuranceTargetEmail('');
                              setInsuranceSearch('');
                            }}
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 font-bold"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                      {insuranceIsOpen && (
                        <div className="absolute z-30 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto divide-y divide-gray-50">
                          {systemRecords.users?.filter(u => {
                            const term = insuranceSearch.toLowerCase();
                            return (u.fullName || '').toLowerCase().includes(term) || (u.email || '').toLowerCase().includes(term);
                          }).map(u => (
                            <button
                              key={u.email}
                              type="button"
                              onClick={() => {
                                setInsuranceTargetEmail(u.email);
                                setInsuranceSearch(`${u.fullName || u.email} (${u.email})`);
                                setInsuranceIsOpen(false);
                              }}
                              className="w-full text-left p-3 hover:bg-gray-50 text-xs transition flex justify-between gap-2"
                            >
                              <span className="font-bold text-[#1F3F7A]">{u.fullName || 'No Name'}</span>
                              <span className="text-gray-400 font-mono truncate">{u.email}</span>
                            </button>
                          ))}
                          {systemRecords.users?.filter(u => {
                            const term = insuranceSearch.toLowerCase();
                            return (u.fullName || '').toLowerCase().includes(term) || (u.email || '').toLowerCase().includes(term);
                          }).length === 0 && (
                            <div className="p-3 text-center text-gray-400 italic">No matches found</div>
                          )}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-[#1F3F7A]/80 font-bold mb-1.5 uppercase">Motor cover PDF or image URL</label>
                      <input
                        type="url"
                        required
                        placeholder="Paste comprehensive cover URL or certificate reference..."
                        value={insurancePolicyUrl}
                        onChange={(e) => setInsurancePolicyUrl(e.target.value)}
                        className="w-full text-xs p-3 bg-gray-50 border border-gray-200 text-gray-800 outline-none rounded-xl font-mono"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={actionLoading}
                        className="w-full py-3 bg-[#7CC242] hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition shadow cursor-pointer"
                      >
                        Publish Coverage and Alert Partner
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Right Column Sentinel Outbox logs */}
              <div className="lg:col-span-6 bg-white border border-gray-150 p-6 rounded-2xl shadow-sm space-y-4">
                <h3 className="font-sans font-black text-xs text-[#1F3F7A] uppercase tracking-wider border-b border-gray-100 pb-2">Courier Dispatch Log Ledger</h3>
                {systemRecords.emails?.length === 0 ? (
                  <p className="text-xs text-gray-400 py-12 text-center font-sans">Sent archives folder empty.</p>
                ) : (
                  <div className="divide-y divide-gray-100 space-y-4 max-h-[60vh] overflow-y-auto pr-1 text-xs">
                    {systemRecords.emails.map(email => (
                      <div key={email.id} className="pt-3.5 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <strong className="text-gray-900 block font-sans font-black leading-tight">{email.subject}</strong>
                            <span className="text-[10.5px] text-gray-400 font-mono block mt-0.5">To: {email.userEmail}</span>
                          </div>
                          <span className="text-[9.5px] text-gray-400 font-mono bg-gray-50 border px-1.5 py-0.5 rounded leading-none shrink-0">{email.dateSent || 'Just now'}</span>
                        </div>
                        <p className="p-3 bg-gray-50 rounded-xl text-gray-650 italic text-[11px] leading-relaxed border border-gray-100">
                          {email.content}
                        </p>
                        {email.attachmentUrl && (
                          <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100 flex justify-between items-center text-[10px] text-emerald-800">
                            <span className="truncate font-mono font-medium flex-1">Attached PDF: {email.attachmentUrl}</span>
                            <a href={email.attachmentUrl} target="_blank" rel="noreferrer" className="text-emerald-700 hover:underline font-bold shrink-0 block ml-2">Open File ↗</a>
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
              TAB 7: CUSTOMERS INQUIRIES INBOX
              ========================================== */}
          {activeTab === 'settings' && (
            <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-sm space-y-4 animate-fade-in" id="settings-module">
              <div>
                <h1 className="text-xl font-black text-[#1F3F7A] uppercase">Income Inquiries Inbox</h1>
                <p className="text-xs text-gray-400 mt-1">Examine and reply to driver requests and sales inquiries submitted from standard guest contact forms.</p>
              </div>

              {systemRecords.inquiries?.length === 0 ? (
                <div className="py-16 text-center border-2 border-dashed border-gray-200 rounded-xl">
                  <span className="block text-gray-400 text-xs uppercase font-bold">Mailbox threads empty</span>
                  <p className="text-[11px] text-gray-400 mt-1">Guest submissions from the frontend contact screen automatically index here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {systemRecords.inquiries.map(inq => (
                    <div key={inq.id} className="border border-gray-150 rounded-2xl p-5 space-y-3.5 text-xs bg-gray-50">
                      <div className="flex justify-between items-start border-b border-gray-200/50 pb-2.5">
                        <div>
                          <strong className="text-[#1F3F7A] text-sm block font-sans font-black">{inq.name}</strong>
                          <span className="text-[10px] text-gray-450 font-mono block mt-0.5">Email address: {inq.email}</span>
                        </div>
                        <span className="text-[9.5px] text-gray-400 font-mono bg-white border px-2 py-0.5 rounded shadow-2xs leading-none">{inq.dateReceived}</span>
                      </div>

                      <p className="p-3 bg-white text-gray-700 rounded-xl leading-relaxed border border-gray-100 font-light">
                        "{inq.msg}"
                      </p>

                      <div className="flex justify-between items-center pt-1 font-sans">
                        <span className="text-[#7CC242] font-black uppercase tracking-wider text-[9.5px]">● Dispatch couriers standby</span>
                        <a 
                          href={`mailto:${inq.email}?subject=Heathrow Fleet Inquiry Response`}
                          className="px-4 py-2 bg-[#1F3F7A] hover:bg-opacity-90 text-white font-bold text-[10px] uppercase rounded-xl transition cursor-pointer"
                        >
                          Reply via email client ✉
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ==========================================
              TAB: ALL APPLICATIONS (PAGINATED)
              ========================================== */}
          {activeTab === 'all-applications' && (
            <div className="space-y-6 animate-fade-in" id="all-applications-module">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <h1 className="text-xl font-black text-[#1F3F7A] uppercase">All Applications Ledger</h1>
                  <p className="text-xs text-gray-400 mt-1">Full database registry of submitted applicant files, with pagination and search.</p>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('applications');
                  }}
                  className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-bold uppercase rounded-xl transition cursor-pointer"
                >
                  Back to Queue
                </button>
              </div>

              {/* Filters selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3.5 rounded-2xl border border-gray-200">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search applicant, vehicle or email..."
                    value={appSearch}
                    onChange={(e) => {
                      setAppSearch(e.target.value);
                      setAppCurrentPage(1);
                    }}
                    className="w-full text-xs py-2.5 pl-8 pr-3 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl outline-none focus:bg-white focus:border-[#1F3F7A] transition"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-3" />
                </div>
                <div>
                  <select
                    value={appStatusFilter}
                    onChange={(e) => {
                      setAppStatusFilter(e.target.value);
                      setAppCurrentPage(1);
                    }}
                    className="w-full text-xs py-2.5 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl outline-none focus:bg-white px-2 transition"
                  >
                    <option value="All">All statuses</option>
                    <option value="Pending">Pending / review required</option>
                    <option value="Approved">Approved cleared</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Application Table/Cards */}
              {filteredApplications.length === 0 ? (
                <div className="bg-white border border-gray-200 p-12 text-center rounded-2xl">
                  <FileText className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <span className="block text-gray-700 font-bold mb-1">No Applications Found</span>
                  <p className="text-xs text-gray-500">Could not find any applications matching the filters.</p>
                </div>
              ) : (() => {
                const itemsPerPage = 30;
                const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
                const startIndex = (appCurrentPage - 1) * itemsPerPage;
                const paginatedApps = filteredApplications.slice(startIndex, startIndex + itemsPerPage);

                return (
                  <div className="space-y-4">
                    <div className="bg-white rounded-2xl border border-gray-150 overflow-hidden shadow-2xs">
                      {/* Desktop */}
                      <div className="hidden md:block overflow-x-auto font-sans">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-[10px] border-b border-gray-100 font-sans">
                              <th className="py-4 px-5">Applicant</th>
                              <th className="py-4 px-5">Email</th>
                              <th className="py-4 px-5">Selected Vehicle</th>
                              <th className="py-4 px-5">Income Summary</th>
                              <th className="py-4 px-5">Date Logged</th>
                              <th className="py-4 px-5">Status</th>
                              <th className="py-4 px-5 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 font-medium">
                            {paginatedApps.map((app) => (
                              <tr key={app.id} className="hover:bg-gray-50 transition">
                                <td className="py-4 px-5">
                                  <span className="font-sans font-black text-[#1F3F7A] text-sm block">
                                    {app.fullName || app.applyDetails?.fullName || "Not Specified"}
                                  </span>
                                  {app.phone && <span className="text-[10px] text-gray-400 block font-mono mt-0.5">Ph: {app.phone}</span>}
                                </td>
                                <td className="py-4 px-5 font-mono text-gray-650">{app.userEmail}</td>
                                <td className="py-4 px-5 text-gray-855 text-xs font-semibold">{app.carName}</td>
                                <td className="py-4 px-5 font-sans">
                                  <span className="font-mono text-emerald-600 font-bold text-xs">{app.applyDetails?.weeklyIncome ? `£${app.applyDetails.weeklyIncome}/wk` : 'N/A'}</span>
                                  <span className="text-[10px] text-gray-450 block mt-0.5">{app.applyDetails?.employment || 'Unknown'}</span>
                                </td>
                                <td className="py-4 px-5 text-gray-400 font-mono text-[11px]">{app.dateApplied || 'N/A'}</td>
                                <td className="py-4 px-5 font-sans">
                                  <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] uppercase font-black tracking-wider leading-none ${
                                    app.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                    app.status === 'Rejected' ? 'bg-red-50 text-red-750 border border-red-100' :
                                    'bg-amber-50 text-amber-700 border border-amber-100'
                                  }`}>
                                    {app.status || 'Pending'}
                                  </span>
                                </td>
                                <td className="py-4 px-5 text-right space-x-2">
                                  <button
                                    onClick={() => setInspectedAppForDocs(app)}
                                    className="px-3 py-1.5 border border-[#1F3F7A]/20 text-[#1F3F7A] hover:bg-[#1F3F7A]/5 font-bold text-[10px] uppercase tracking-wider rounded-lg transition"
                                  >
                                    View Papers
                                  </button>
                                  <button
                                    onClick={() => setInspectedAppForFullView(app)}
                                    className="px-3 py-1.5 bg-[#1F3F7A] hover:bg-opacity-90 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition"
                                  >
                                    Audit Folder
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Mobile */}
                      <div className="md:hidden space-y-4 p-4 text-xs font-sans">
                        {paginatedApps.map((app) => (
                          <div key={app.id} className="border border-gray-150 rounded-xl p-4 bg-gray-50 space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <strong className="text-sm font-black text-[#1F3F7A] block leading-none">{app.fullName || app.applyDetails?.fullName || 'Applicant'}</strong>
                                <span className="text-[10px] text-gray-400 block mt-1">{app.userEmail}</span>
                              </div>
                              <span className={`inline-block px-2 py-0.5 rounded text-[9.5px] uppercase font-bold leading-none ${
                                app.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                app.status === 'Rejected' ? 'bg-red-50 text-red-750 border border-red-100' :
                                'bg-amber-50 text-amber-755 border border-amber-100'
                              }`}>
                                {app.status || 'Pending'}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-[11px] border-y border-gray-200/50 py-2.5 my-1 text-gray-600">
                              <div>Vehicle: <span className="font-semibold text-gray-905 block mt-0.5">{app.carName}</span></div>
                              <div>Income: <span className="text-emerald-600 font-mono font-bold block mt-0.5">£{app.applyDetails?.weeklyIncome || 0}/wk</span></div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setInspectedAppForDocs(app)}
                                className="flex-1 py-1.5 text-center border border-gray-200 text-[#1F3F7A] text-[10px] uppercase font-bold rounded-lg bg-white"
                              >
                                ID Files
                              </button>
                              <button
                                onClick={() => setInspectedAppForFullView(app)}
                                className="flex-1 py-1.5 text-center bg-[#1F3F7A] text-white text-[10px] uppercase font-bold rounded-lg"
                              >
                                Audit
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pagination Indicators */}
                    {totalPages > 1 && (
                      <div className="flex justify-center items-center gap-1.5 pt-2">
                        {Array.from({ length: totalPages }).map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                              setAppCurrentPage(i + 1);
                              document.getElementById('super-admin-root')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              appCurrentPage === i + 1
                                ? 'bg-[#1F3F7A] text-white'
                                : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* ==========================================
              TAB: ALL USERS (PAGINATED WITH DETAILS)
              ========================================== */}
          {activeTab === 'all-users' && (
            <div className="space-y-6 animate-fade-in" id="all-users-module">
              {selectedUserDetail ? (
                // USER DETAIL SUBPAGE
                <div className="space-y-6 font-sans">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4 flex-wrap gap-3">
                    <div>
                      <h1 className="text-xl font-black text-[#1F3F7A] uppercase">Driver Profile Details</h1>
                      <p className="text-xs text-gray-400 mt-1">Detailed history, receivables, ledger logs and status checks for {selectedUserDetail.fullName || selectedUserDetail.email}.</p>
                    </div>
                    <button
                      onClick={() => setSelectedUserDetail(null)}
                      className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-bold uppercase rounded-xl transition cursor-pointer font-sans"
                    >
                      Back to Drivers
                    </button>
                  </div>

                  {(() => {
                    const u = selectedUserDetail;
                    const uApps = systemRecords.applications?.filter(a => a.userEmail === u.email) || [];
                    const uPayments = systemRecords.payments?.filter(p => p.userEmail === u.email) || [];
                    const approvedApps = uApps.filter(a => a.status === 'Approved');
                    const rejectedApps = uApps.filter(a => a.status === 'Rejected');
                    const totalPaymentsSum = uPayments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
                    const currentVehicle = approvedApps[0]?.carName || uApps[0]?.carName || 'No active vehicle';

                    return (
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-sans">
                        {/* Summary Column */}
                        <div className="lg:col-span-4 space-y-6">
                          <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-sm space-y-4">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 rounded-full bg-[#1F3F7A]/8 text-lg font-bold text-[#1F3F7A] flex items-center justify-center uppercase shadow-3xs">
                                {u.fullName ? u.fullName.substring(0, 2) : 'DR'}
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="text-base font-black text-[#1F3F7A] leading-tight truncate">{u.fullName || 'Heathrow Driver'}</h3>
                                <p className="text-xs text-gray-405 mt-1 truncate">{u.email}</p>
                              </div>
                            </div>

                            <div className="border-t border-gray-100 pt-4 space-y-3 text-xs font-sans">
                              <div className="flex justify-between">
                                <span className="text-gray-450 font-medium">Phone Support:</span>
                                <span className="font-bold text-gray-800">{u.phone || 'Not provided'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-455 font-medium">Registered On:</span>
                                <span className="font-bold text-gray-800 font-mono">{u.dateCreated || u.createdAt?.substring(0, 10) || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-455 font-medium">Account Status:</span>
                                <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold leading-none ${
                                  u.blocked ? 'bg-rose-50 border border-rose-105 text-rose-700 font-sans font-semibold' : 'bg-emerald-50 border border-emerald-105 text-emerald-750 font-semibold'
                                }`}>
                                  {u.blocked ? 'Suspended' : 'Active'}
                                </span>
                              </div>
                              <div className="flex justify-between gap-2">
                                <span className="text-gray-455 font-medium shrink-0">Current Stock:</span>
                                <span className="font-bold text-[#1F3F7A] truncate max-w-[150px]">{currentVehicle}</span>
                              </div>
                            </div>

                            <div className="pt-2">
                              <button
                                onClick={() => handleToggleBlockUser(u.email, u.blocked)}
                                className={`w-full py-2.5 text-center text-xs font-black uppercase tracking-wider rounded-xl transition cursor-pointer ${
                                  u.blocked 
                                    ? 'bg-[#7CC242] hover:bg-emerald-550 text-white' 
                                    : 'bg-rose-600 hover:bg-rose-700 text-white'
                                }`}
                              >
                                {u.blocked ? 'Unblock Driver' : 'Suspend Driver'}
                              </button>
                            </div>
                          </div>

                          {/* Quick Stats Widget */}
                          <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-sm text-xs space-y-4">
                            <h4 className="font-black text-[#1F3F7A] uppercase tracking-wider border-b border-gray-50 pb-1.5">Metrics Ledger</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-gray-50 p-3 rounded-xl font-sans">
                                <span className="text-[10px] text-gray-400 font-bold uppercase block leading-none">Submitted</span>
                                <span className="text-lg font-black text-[#1F3F7A] font-mono mt-1 block">{uApps.length} files</span>
                              </div>
                              <div className="bg-gray-50 p-3 rounded-xl">
                                <span className="text-[10px] text-gray-400 font-bold uppercase block leading-none">Approved</span>
                                <span className="text-lg font-black text-emerald-505 font-mono mt-1 block">{approvedApps.length} clears</span>
                              </div>
                              <div className="bg-gray-50 p-3 rounded-xl font-sans">
                                <span className="text-[10px] text-gray-400 font-bold uppercase block leading-none">Rejected</span>
                                <span className="text-lg font-black text-rose-505 font-mono mt-1 block">{rejectedApps.length} logs</span>
                              </div>
                              <div className="bg-gray-50 p-3 rounded-xl font-sans">
                                <span className="text-[10px] text-gray-400 font-bold uppercase block leading-none">Cleared Fees</span>
                                <span className="text-lg font-black text-[#7CC242] font-mono mt-1 block">£{totalPaymentsSum}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* History Tabs Column */}
                        <div className="lg:col-span-8 space-y-6">
                          {/* Applications list */}
                          <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-sm space-y-4">
                            <h3 className="font-black text-xs text-[#1F3F7A] uppercase tracking-wider border-b border-gray-100 pb-2">Rent-to-Buy Archives</h3>
                            {uApps.length === 0 ? (
                              <p className="text-xs text-gray-400 py-6 text-center">No dossiers associated with this driver profile.</p>
                            ) : (
                              <div className="space-y-3">
                                {uApps.map((a) => (
                                  <div key={a.id} className="p-4 bg-gray-50 border border-gray-100 rounded-xl flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-xs font-sans">
                                    <div>
                                      <strong className="text-gray-900 block font-bold text-sm">{a.carName}</strong>
                                      <span className="text-[10px] text-gray-400 font-mono block mt-1">Submitted: {a.dateApplied || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 font-sans">
                                      <span className="font-mono text-emerald-600 font-bold">£{a.applyDetails?.weeklyIncome || 0}/wk</span>
                                      <span className={`inline-block px-2 py-0.5 rounded text-[9px] uppercase font-bold leading-none ${
                                        a.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                        a.status === 'Rejected' ? 'bg-red-50 text-red-750 border border-red-100' :
                                        'bg-amber-50 text-amber-700 border border-amber-100'
                                      }`}>
                                        {a.status || 'Pending'}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Payments Table */}
                          <div className="bg-white border border-gray-150 p-6 rounded-2xl shadow-sm space-y-4 font-sans">
                            <h3 className="font-black text-xs text-[#1F3F7A] uppercase tracking-wider border-b border-gray-100 pb-2">Cleared Deposits History</h3>
                            {uPayments.length === 0 ? (
                              <p className="text-xs text-gray-400 py-6 text-center">No payment registers tracked for this driver account.</p>
                            ) : (
                              <div className="overflow-x-auto text-xs">
                                <table className="w-full text-left">
                                  <thead>
                                    <tr className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-[10px] border-b border-gray-100">
                                      <th className="py-2.5 px-3">Transaction ID</th>
                                      <th className="py-2.5 px-3">Vehicle Class</th>
                                      <th className="py-2.5 px-3">Payment Date</th>
                                      <th className="py-2.5 px-3">Amount</th>
                                      <th className="py-2.5 px-3">Status</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100 font-medium text-gray-750">
                                    {uPayments.map((p) => (
                                      <tr key={p.id} className="border-b border-gray-50">
                                        <td className="py-2.5 px-3 font-mono text-[10.5px] text-gray-500">#{p.id || 'N/A'}</td>
                                        <td className="py-2.5 px-3">{p.carName || 'General Account'}</td>
                                        <td className="py-2.5 px-3 font-mono text-[11px] text-gray-400">{p.datePaid || 'N/A'}</td>
                                        <td className="py-2.5 px-3 font-mono text-emerald-600 font-bold">£{p.amount}</td>
                                        <td className="py-2.5 px-3">
                                          <span className={`inline-block px-1.5 py-0.5 rounded text-[8.5px] uppercase font-bold leading-none ${
                                            p.status === 'Verified' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                                          }`}>
                                            {p.status || 'Pending'}
                                          </span>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                // USERS LIST PAGE
                <>
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 font-sans">
                    <div>
                      <h1 className="text-xl font-black text-[#1F3F7A] uppercase">All Driver Profiles</h1>
                      <p className="text-xs text-gray-400 mt-1">Full database directory of drivers registered on Heathrow Hub, with stats detail auditing.</p>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab('users');
                      }}
                      className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-bold uppercase rounded-xl transition cursor-pointer"
                    >
                      Back to Directory
                    </button>
                  </div>

                  {/* Search Bar */}
                  <div className="bg-white p-3.5 rounded-2xl border border-gray-200">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search full name or email address..."
                        value={userSearch}
                        onChange={(e) => {
                          setUserSearch(e.target.value);
                          setUserCurrentPage(1);
                        }}
                        className="w-full text-xs py-2.5 pl-8 pr-3 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl outline-none focus:bg-white focus:border-[#1F3F7A] transition font-sans"
                      />
                      <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-3" />
                    </div>
                  </div>

                  {/* Filter Results */}
                  {filteredUsers.length === 0 ? (
                    <div className="bg-white border border-gray-200 p-12 text-center rounded-2xl">
                      <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <span className="block text-gray-700 font-bold mb-1">No Drivers Registered</span>
                      <p className="text-xs text-gray-500">No profiles matched your search terms parameters.</p>
                    </div>
                  ) : (() => {
                    const itemsPerPage = 30;
                    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
                    const startIndex = (userCurrentPage - 1) * itemsPerPage;
                    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

                    return (
                      <div className="space-y-4 font-sans text-xs">
                        <div className="bg-white rounded-2xl border border-gray-150 overflow-hidden shadow-2xs">
                          {/* Desktop Tables View */}
                          <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left">
                              <thead>
                                <tr className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-[10px] border-b border-gray-100 font-sans font-black">
                                  <th className="py-4 px-5">Driver Name</th>
                                  <th className="py-4 px-5">Email Address</th>
                                  <th className="py-4 px-5">Phone Contact</th>
                                  <th className="py-4 px-5">Role</th>
                                  <th className="py-4 px-5">Dossiers Handled</th>
                                  <th className="py-4 px-5">Status</th>
                                  <th className="py-4 px-5 text-right">Actions</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                                {paginatedUsers.map((u) => {
                                  const appCount = systemRecords.applications?.filter(a => a.userEmail === u.email)?.length || 0;
                                  return (
                                    <tr key={u.email} className="hover:bg-gray-50 transition">
                                      <td className="py-4 px-5 font-bold text-[#1F3F7A] text-sm">{u.fullName || 'No Name'}</td>
                                      <td className="py-4 px-5 font-mono text-gray-500 truncate max-w-[200px]">{u.email}</td>
                                      <td className="py-4 px-5">{u.phone || 'N/A'}</td>
                                      <td className="py-4 px-5 text-[10px] font-bold uppercase tracking-wide">{u.role || 'Driver'}</td>
                                      <td className="py-4 px-5 font-mono font-bold text-gray-500">{appCount} apps</td>
                                      <td className="py-4 px-5">
                                        <span className={`inline-block px-2 py-0.5 rounded text-[9px] uppercase font-bold leading-none ${
                                          u.blocked ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                        }`}>
                                          {u.blocked ? 'Blocked' : 'Active'}
                                        </span>
                                      </td>
                                      <td className="py-4 px-5 text-right space-x-2 font-sans">
                                        <button
                                          onClick={() => setSelectedUserDetail(u)}
                                          className="px-3 py-1.5 border border-[#1F3F7A]/20 text-[#1F3F7A] hover:bg-[#1F3F7A]/5 font-bold text-[10px] uppercase tracking-wider rounded-lg transition cursor-pointer"
                                        >
                                          View User Details
                                        </button>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>

                          {/* Mobile Cards View */}
                          <div className="md:hidden space-y-4 p-4 font-sans">
                            {paginatedUsers.map((u) => {
                              const appCount = systemRecords.applications?.filter(a => a.userEmail === u.email)?.length || 0;
                              return (
                                <div key={u.email} className="border border-gray-150 rounded-xl p-4 bg-gray-50 flex flex-col gap-3">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <strong className="text-sm font-black text-[#1F3F7A] block leading-none">{u.fullName || 'Driver'}</strong>
                                      <span className="text-[10px] text-gray-400 block mt-1">{u.email}</span>
                                    </div>
                                    <span className={`inline-block px-1.5 py-0.5 rounded text-[8.5px] uppercase font-bold leading-none ${
                                      u.blocked ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                    }`}>
                                      {u.blocked ? 'Blocked' : 'Active'}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-[11px] text-gray-600 border-t border-gray-200/50 pt-2 font-sans">
                                    <span>Phone: <span className="font-semibold text-gray-905">{u.phone || 'N/A'}</span></span>
                                    <span>Dossiers: <span className="font-semibold text-gray-905 font-mono">{appCount}</span></span>
                                  </div>
                                  <button
                                    onClick={() => setSelectedUserDetail(u)}
                                    className="w-full py-2 bg-[#1F3F7A] text-white text-[10px] uppercase font-bold rounded-lg hover:bg-opacity-95 text-center mt-1 cursor-pointer"
                                  >
                                    View User Details
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                          <div className="flex justify-center items-center gap-1.5 pt-2">
                            {Array.from({ length: totalPages }).map((_, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => {
                                  setUserCurrentPage(i + 1);
                                  document.getElementById('super-admin-root')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                  userCurrentPage === i + 1
                                    ? 'bg-[#1F3F7A] text-white'
                                    : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
                                }`}
                              >
                                {i + 1}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </>
              )}
            </div>
          )}

          {/* ==========================================
              TAB: ALL PAYMENTS (PAGINATED WITH FILTERS)
              ========================================== */}
          {activeTab === 'all-payments' && (
            <div className="space-y-6 animate-fade-in" id="all-payments-module">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 font-sans">
                <div>
                  <h1 className="text-xl font-black text-[#1F3F7A] uppercase">All Cleared Receivables</h1>
                  <p className="text-xs text-gray-400 mt-1">Receipted deposits, weekly balances payment ledger registry logs catalog, with pagination.</p>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('payments');
                  }}
                  className="px-4 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-bold uppercase rounded-xl transition cursor-pointer"
                >
                  Back to Ledger
                </button>
              </div>

              {/* Filters search */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3.5 rounded-2xl border border-gray-200">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by user email, vehicle name..."
                    value={paymentSearch}
                    onChange={(e) => {
                      setPaymentSearch(e.target.value);
                      setPaymentCurrentPage(1);
                    }}
                    className="w-full text-xs py-2.5 pl-8 pr-3 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl outline-none focus:bg-white focus:border-[#1F3F7A] transition font-sans"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-2.5 top-3" />
                </div>
                <div>
                  <select
                    value={paymentStatusFilter}
                    onChange={(e) => {
                      setPaymentStatusFilter(e.target.value);
                      setPaymentCurrentPage(1);
                    }}
                    className="w-full text-xs py-2.5 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl outline-none focus:bg-white px-2 transition font-sans"
                  >
                    <option value="All">All payments statuses</option>
                    <option value="Verified">Verified receipt</option>
                    <option value="Pending">Awaiting verification</option>
                  </select>
                </div>
              </div>

              {filteredPayments.length === 0 ? (
                <div className="bg-white border border-gray-200 p-12 text-center rounded-2xl">
                  <DollarSign className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <span className="block text-gray-700 font-bold mb-1">No Receivables Found</span>
                  <p className="text-xs text-gray-500">No payment transaction entries matching filtering parameters.</p>
                </div>
              ) : (() => {
                const itemsPerPage = 30;
                const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
                const startIndex = (paymentCurrentPage - 1) * itemsPerPage;
                const paginatedPayments = filteredPayments.slice(startIndex, startIndex + itemsPerPage);

                return (
                  <div className="space-y-4 font-sans text-xs">
                    <div className="bg-white rounded-2xl border border-gray-150 overflow-hidden shadow-2xs">
                      {/* Desktop */}
                      <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-[10px] border-b border-gray-100 font-sans font-black">
                              <th className="py-4 px-5">Driver Account</th>
                              <th className="py-4 px-5">Target Vehicle</th>
                              <th className="py-4 px-5">Transaction ID</th>
                              <th className="py-4 px-5">Payment Date</th>
                              <th className="py-4 px-5">Amount Dues</th>
                              <th className="py-4 px-5">Status</th>
                              <th className="py-4 px-5 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 font-medium text-gray-700 font-sans">
                            {paginatedPayments.map((p) => {
                              const driverObj = systemRecords.users?.find(u => u.email === p.userEmail);
                              return (
                                <tr key={p.id} className="hover:bg-gray-50 transition border-b border-gray-50">
                                  <td className="py-4 px-5">
                                    <strong className="text-gray-905 block font-bold text-sm">{driverObj?.fullName || 'Heathrow Account'}</strong>
                                    <span className="text-[10.5px] text-gray-400 font-mono block mt-0.5">{p.userEmail}</span>
                                  </td>
                                  <td className="py-4 px-5 font-semibold text-indigo-900">{p.carName || 'Account Credit'}</td>
                                  <td className="py-4 px-5 font-mono text-gray-500">#{p.id || p.stripeSessionId?.substring(0, 10) || 'N/A'}</td>
                                  <td className="py-4 px-5 font-mono text-[11px] text-gray-400">{p.datePaid || 'N/A'}</td>
                                  <td className="py-4 px-5 font-mono text-emerald-600 font-bold text-sm">£{p.amount}</td>
                                  <td className="py-4 px-5">
                                    <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] uppercase font-black tracking-wider leading-none ${
                                      p.status === 'Verified' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                                    }`}>
                                      {p.status || 'Pending'}
                                    </span>
                                  </td>
                                  <td className="py-4 px-5 text-right font-sans">
                                    {p.status !== 'Verified' && (
                                      <button
                                        onClick={() => handleVerifyManualPayment(p.id)}
                                        className="px-3 py-1.5 bg-[#7CC242] hover:bg-emerald-500 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition shadow-xs cursor-pointer font-sans"
                                      >
                                        Verify Receipt
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Mobile */}
                      <div className="md:hidden space-y-4 p-4 font-sans text-xs">
                        {paginatedPayments.map((p) => {
                          const driverObj = systemRecords.users?.find(u => u.email === p.userEmail);
                          return (
                            <div key={p.id} className="border border-gray-150 rounded-xl p-4 bg-gray-50 space-y-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <strong className="text-sm font-black text-[#1F3F7A] block leading-none">{driverObj?.fullName || 'Driver'}</strong>
                                  <span className="text-[10px] text-gray-400 block mt-1">{p.userEmail}</span>
                                </div>
                                <span className={`inline-block px-1.5 py-0.5 rounded text-[8.5px] uppercase font-bold leading-none ${
                                  p.status === 'Verified' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                                }`}>
                                  {p.status || 'Pending'}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 text-[11px] border-y border-gray-200/50 py-2 pt-2 text-gray-650 font-sans">
                                <div>Dues: <strong className="text-emerald-600 font-mono block text-xs mt-0.5">£{p.amount}</strong></div>
                                <div>Target: <span className="text-indigo-950 font-semibold block text-xs mt-0.5">{p.carName || 'General'}</span></div>
                              </div>
                              <div className="flex justify-between items-center text-[10px] text-gray-400 font-mono">
                                <span>Ref: #{p.id}</span>
                                <span>Date: {p.datePaid}</span>
                              </div>
                              {p.status !== 'Verified' && (
                                <button
                                  onClick={() => handleVerifyManualPayment(p.id)}
                                  className="w-full py-2 bg-[#7CC242] hover:bg-emerald-505 text-white text-[10px] uppercase font-black rounded-lg transition cursor-pointer"
                                >
                                  Verify Clearing Receipt
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center items-center gap-1.5 pt-2">
                        {Array.from({ length: totalPages }).map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => {
                              setPaymentCurrentPage(i + 1);
                              document.getElementById('super-admin-root')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              paymentCurrentPage === i + 1
                                ? 'bg-[#1F3F7A] text-white'
                                : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

        </div>
      </main>

      {/* RENDER MODAL LAYOUT OVERLAYS */}
      {inspectedAppForDocs && (
        <DocumentViewerModal 
          app={inspectedAppForDocs} 
          onClose={() => setInspectedAppForDocs(null)} 
        />
      )}

      {inspectedAppForFullView && (
        <FullApplicationModal 
          app={inspectedAppForFullView} 
          onClose={() => setInspectedAppForFullView(null)} 
          onAction={handleUnderwritingAction}
          actionLoading={actionLoading}
        />
      )}

    </div>
  );
}
