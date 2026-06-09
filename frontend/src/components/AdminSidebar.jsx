import React from 'react';
import { 
  BarChart2, 
  Car, 
  FileCheck, 
  Users, 
  CreditCard, 
  Mail, 
  MessageSquare, 
  Menu, 
  X,
  LogOut,
  RefreshCw,
  Gauge
} from 'lucide-react';

export default function AdminSidebar({ 
  activeTab, 
  setActiveTab, 
  isOpen, 
  onClose, 
  systemRecords,
  onSync,
  isSyncing
}) {
  const pendingApps = systemRecords.applications?.filter(a => a.status !== 'Approved' && a.status !== 'Rejected')?.length || 0;
  const pendingPayments = systemRecords.payments?.filter(p => p.status === 'Pending')?.length || 0;
  const newInquiries = systemRecords.inquiries?.length || 0;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: Gauge },
    { id: 'cars', label: 'Vehicles Catalog', icon: Car },
    { 
      id: 'applications', 
      label: 'Underwriting Queue', 
      icon: FileCheck,
      badge: pendingApps > 0 ? pendingApps : null,
      badgeColor: 'bg-amber-500 text-white'
    },
    { id: 'users', label: 'Driver Profiles', icon: Users },
    { 
      id: 'payments', 
      label: 'Payments Ledger', 
      icon: CreditCard,
      badge: pendingPayments > 0 ? pendingPayments : null,
      badgeColor: 'bg-indigo-600 text-white'
    },
    { id: 'emails', label: 'Notifications Hub', icon: Mail },
    { 
      id: 'settings', 
      label: 'Customer Inbox', 
      icon: MessageSquare,
      badge: newInquiries > 0 ? newInquiries : null,
      badgeColor: 'bg-[#7CC242] text-white'
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#1F3F7A] text-white">
      {/* Brand Header */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <div>
          <h1 className="font-sans font-black text-lg tracking-tight uppercase text-white flex items-center gap-2">
            Heathrow <span className="text-[#7CC242]">HQ</span>
          </h1>
          <p className="text-[10px] text-white/60 uppercase tracking-widest font-mono mt-0.5">Rent-to-Buy Controller</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="md:hidden text-white/80 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (onClose) onClose();
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                isActive 
                  ? 'bg-white text-[#1F3F7A] shadow-sm font-bold' 
                  : 'text-white/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#1F3F7A]' : 'text-white/60'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black leading-none ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sync Status Button */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <button
          onClick={onSync}
          disabled={isSyncing}
          className="w-full py-2.5 px-4 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 active:bg-white/15 text-white/95 text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Syncing...' : 'Sync Database'}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar: Permanent Position */}
      <aside className="hidden md:block w-64 h-screen sticky top-0 bg-[#1F3F7A] shrink-0 border-r border-[#1F3F7A]/20">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Mobile Sidebar: Drawer Transition */}
      <aside 
        className={`md:hidden fixed top-0 bottom-0 left-0 w-64 bg-[#1F3F7A] z-50 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
