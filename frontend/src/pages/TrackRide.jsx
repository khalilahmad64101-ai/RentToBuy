import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ChevronLeft } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

// Modular Sections import
import { TrackingHero } from '../sections/track/TrackingHero';
import { TrackingTimeline } from '../sections/track/TrackingTimeline';

export function TrackRide() {
  useSEO({
    title: 'Track agreement progress | Rent-to-Buy Live Timeline',
    description: 'Track your rent-to-buy lease status in real-time. Check references, underwriting checkpoints, and pre-approval milestones.'
  });

  const navigate = useNavigate();
  const { user, driverData } = useAuth();

  const [appNumber, setAppNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState(user?.email || '');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  
  // Custom tracking result
  const [currentAppTrack, setCurrentAppTrack] = useState(null);

  // Load the user's latest application status as default
  useEffect(() => {
    const defaultApp = driverData?.applications?.[0];
    if (defaultApp) {
      setAppNumber(defaultApp.id);
      setCurrentAppTrack({
        id: defaultApp.id,
        vehicleName: defaultApp.carName,
        status: defaultApp.status || 'Under Review',
        step: Number(defaultApp.step) || 3
      });
    } else {
      // Clean fallback if no applications belong to the user
      setCurrentAppTrack({
        id: 'RTB-MOCK',
        vehicleName: 'TESLA MODEL 3',
        status: 'Under Review',
        step: 3
      });
    }
  }, [driverData]);

  const handleManualSearch = async (e) => {
    e.preventDefault();
    if (!appNumber.trim()) {
      setSearchError('Enter Application ID');
      return;
    }
    setSearchError('');
    setIsSearching(true);
    try {
      const data = await api.applications.track(appNumber.trim(), emailAddress.trim());
      setCurrentAppTrack({
        id: data.id,
        vehicleName: data.carName,
        status: data.status,
        step: Number(data.step) || 3
      });
    } catch (err) {
      setSearchError('No active application match found in registry.');
    } finally {
      setIsSearching(false);
    }
  };

  // 8 Compact timeline stages requested by user
  const timelineStages = [
    { stepNum: 1, label: 'Application Submitted' },
    { stepNum: 2, label: 'Documents Uploaded' },
    { stepNum: 3, label: 'Under Review' },
    { stepNum: 4, label: 'Approved' },
    { stepNum: 5, label: 'Deposit Paid' },
    { stepNum: 6, label: 'Insurance Uploaded' },
    { stepNum: 7, label: 'Vehicle Ready' },
    { stepNum: 8, label: 'Collection Scheduled' }
  ];

  const activeStepNum = currentAppTrack ? currentAppTrack.step : 3;
  const activeStatusText = currentAppTrack ? currentAppTrack.status : 'Application Under Review';

  return (
    <div className="w-full max-w-lg mx-auto bg-white min-h-screen px-4 pb-20 pt-4 font-sans antialiased text-slate-900" id="track-progress-app">
      
      {/* Back button */}
      <div className="py-2.5">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center text-xs font-black text-slate-500 hover:text-slate-900 focus:outline-none uppercase tracking-wider transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4 mr-0.5" />
          Back
        </button>
      </div>

      {/* Header Area */}
      <div className="text-left mt-2 pb-4 border-b border-slate-100">
        <h1 className="text-xl font-black text-[#1F3F7A] uppercase tracking-tight">
          Track Your Vehicle
        </h1>
        <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">Heathrow Processing Desk</p>
      </div>

      <TrackingHero
        appNumber={appNumber}
        setAppNumber={setAppNumber}
        handleManualSearch={handleManualSearch}
        isSearching={isSearching}
        searchError={searchError}
        activeStatusText={activeStatusText}
        currentAppTrack={currentAppTrack}
      />

      <TrackingTimeline
        timelineStages={timelineStages}
        activeStepNum={activeStepNum}
      />

    </div>
  );
}
