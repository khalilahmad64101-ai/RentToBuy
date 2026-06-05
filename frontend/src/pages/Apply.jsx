import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Loader } from '../components/ui/Loader';
import { 
  ShieldCheck, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  FileText, 
  ChevronRight, 
  Camera, 
  Image as ImageIcon, 
  MapPin, 
  Trash2, 
  Sparkles,
  RefreshCw 
} from 'lucide-react';

export function Apply() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, syncDriverData } = useAuth();

  const [carsList, setCarsList] = useState([]);
  const [carsLoading, setCarsLoading] = useState(true);

  // Form parameters
  const [selectedCarId, setSelectedCarId] = useState(searchParams.get('carId') || '');
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [emailAddress, setEmailAddress] = useState(user?.email || '');
  const [employment, setEmployment] = useState('Full Time Employee');
  const [weeklyIncome, setWeeklyIncome] = useState('');
  const [termMonths, setTermMonths] = useState('12');
  const [location, setLocation] = useState('');

  // Attachment files
  const [licenseFront, setLicenseFront] = useState(null);
  const [licenseBack, setLicenseBack] = useState(null);
  const [selfie, setSelfie] = useState(null);

  // Drag and drop states
  const [dragActiveFront, setDragActiveFront] = useState(false);
  const [dragActiveBack, setDragActiveBack] = useState(false);
  const [dragActiveSelfie, setDragActiveSelfie] = useState(false);

  // Upload progress & modal state
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadType, setUploadType] = useState(null); // 'front' | 'back' | 'selfie'
  const [gpsLoading, setGpsLoading] = useState(false);

  // Uploader URL stores
  const [uploadUrls, setUploadUrls] = useState({
    licenseFront: '',
    licenseBack: '',
    proofOfAddress: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [appError, setAppError] = useState(null);

  const [activeCameraStream, setActiveCameraStream] = useState(null);
  const [cameraActiveType, setCameraActiveType] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    return () => {
      if (activeCameraStream) {
        activeCameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [activeCameraStream]);

  // Fetch cars catalog for selection list
  useEffect(() => {
    api.cars.list()
      .then((data) => {
        setCarsList(data);
        if (!selectedCarId && data.length > 0) {
          setSelectedCarId(data[0].id);
        }
      })
      .catch((err) => console.error('Error fetching selection catalog:', err))
      .finally(() => setCarsLoading(false));
  }, [selectedCarId]);

  // Sync session details if changed
  useEffect(() => {
    if (user) {
      if (!fullName) setFullName(user.fullName || '');
      if (!emailAddress) setEmailAddress(user.email || '');
      if (!phone) setPhone(user.phone || '');
    }
  }, [user]);

  // File size & format validation helper
  const validateFile = (file) => {
    if (!file) return false;
    
    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      throw new Error(`File size for "${file.name}" exceeds the maximum 5MB restriction threshold.`);
    }

    // MIME type compliance checks (Image files and PDFs are standard)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Invalid format for "${file.name}". Please provide a JPEG, PNG, WEBP image or a PDF document.`);
    }
    return true;
  };

  // Drag & drop event generic processors
  const handleDrag = (e, setDragActive) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e, setDragActive, setFile) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      try {
        validateFile(file);
        setFile(file);
        setAppError(null);
        setUploadError(null);
      } catch (err) {
        setAppError(err.message);
      }
    }
  };

  // Modern browser-supported GPS Geolocation auto-detection
  const handleGPSDetect = () => {
    if (!navigator.geolocation) {
      setAppError('Your current browser client does not support auto GPS geolocation APIs.');
      return;
    }
    setGpsLoading(true);
    setAppError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation(`Greater Manchester (GPS: ${latitude.toFixed(5)}, ${longitude.toFixed(5)})`);
        setGpsLoading(false);
      },
      (error) => {
        console.warn('[GPS Geolocation Error] details:', error);
        setLocation('Manchester, United Kingdom');
        setGpsLoading(false);
        setAppError('Automatic GPS detection failsafe active. Manual location field initialized.');
      },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  };

  // Open real device camera using getUserMedia
  const openDeviceCamera = async (type) => {
    setAppError(null);
    setUploadError(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setAppError("Camera API not supported.");
      return;
    }

    try {
      if (navigator.mediaDevices.enumerateDevices) {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasCamera = devices.some((device) => device.kind === "videoinput");
        if (!hasCamera) {
          setAppError("Camera is not available on this device.");
          return;
        }
      }

      // Stop any active streams first
      if (activeCameraStream) {
        activeCameraStream.getTracks().forEach(track => track.stop());
      }

      const constraints = {
        video: {
          facingMode: type === 'selfie' ? 'user' : 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (err) {
        console.warn('Facing camera failed, trying generic constraints', err);
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }

      setActiveCameraStream(stream);
      setCameraActiveType(type);
    } catch (err) {
      console.error("[Camera Access Error]:", err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError' || err.message?.includes('Permission')) {
        setAppError("Camera permission denied.");
      } else {
        setAppError("Camera is not available on this device.");
      }
    }
  };

  const closeCamera = () => {
    if (activeCameraStream) {
      activeCameraStream.getTracks().forEach(track => track.stop());
    }
    setActiveCameraStream(null);
    setCameraActiveType(null);
  };

  const handleCapturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const fileName = `${cameraActiveType}_capture_${Date.now()}.jpg`;
          const file = new File([blob], fileName, { type: 'image/jpeg' });

          try {
            validateFile(file);
            if (cameraActiveType === 'front') setLicenseFront(file);
            else if (cameraActiveType === 'back') setLicenseBack(file);
            else if (cameraActiveType === 'selfie') setSelfie(file);

            setAppError(null);
            setUploadError(null);
          } catch (err) {
            setAppError(err.message);
          }
          closeCamera();
        }
      }, 'image/jpeg', 0.95);
    }
  };

  useEffect(() => {
    if (videoRef.current && activeCameraStream) {
      videoRef.current.srcObject = activeCameraStream;
    }
  }, [activeCameraStream, cameraActiveType]);

  // Handle files upload simulating progress
  const handleUploadDocs = async () => {
    setUploadError(null);
    if (!licenseFront || !licenseBack || !selfie) {
      throw new Error('Please select all required underwriting records: Licence Front, Licence Back, and Face Selfie first.');
    }

    // Initialize interactive simulated uploader meter
    setUploadProgress(15);
    const progressTicker = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressTicker);
          return prev;
        }
        return prev + 12;
      });
    }, 250);

    try {
      console.log("[CLIENT-APPLY-DEBUG] Initiating document upload with files:", {
        licenseFrontName: licenseFront ? licenseFront.name : null,
        licenseBackName: licenseBack ? licenseBack.name : null,
        selfieName: selfie ? selfie.name : null
      });

      const resp = await api.upload.documents(licenseFront, licenseBack, selfie);
      console.log("[CLIENT-APPLY-DEBUG] Received raw response from api.upload.documents:", resp);

      const files = resp.files || resp;
      console.log("[CLIENT-APPLY-DEBUG] Extracted files object:", files);

      clearInterval(progressTicker);
      setUploadProgress(100);
      
      // Keep completion banner visible briefly
      await new Promise(resolve => setTimeout(resolve, 400));

      if (files && (files.licenseFront || files.proofOfAddress)) {
        console.log("[CLIENT-APPLY-DEBUG] Files validation check PASSED. Saving upload URLs.");
        setUploadUrls({
          licenseFront: files.licenseFront || '',
          licenseBack: files.licenseBack || '',
          proofOfAddress: files.proofOfAddress || '',
        });
        return files;
      }
      console.error("[CLIENT-APPLY-DEBUG] Files validation check FAILED. files exists:", !!files, "licenseFront:", files?.licenseFront, "proofOfAddress:", files?.proofOfAddress);
      throw new Error('Our underwriting storage servers were unable to process completed image buffers.');
    } catch (err) {
      console.error("[CLIENT-APPLY-DEBUG] Caught error inside handleUploadDocs:", err);
      clearInterval(progressTicker);
      setUploadProgress(0);
      setUploadError(err.message || 'File upload failed');
      throw err;
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setAppError(null);

    if (!selectedCarId) {
      setAppError('Please select an active stock fleet vehicle choice.');
      return;
    }

    if (!fullName || !phone || !emailAddress || !weeklyIncome || !location.trim()) {
      setAppError('Please complete all personal, financial, and location fields.');
      return;
    }

    setSubmitting(true);

    try {
      // 1. Process files upload package & trigger progress bar
      const uploads = await handleUploadDocs();

      // 2. Build final compliance-ready underwriting JSON tree
      const payload = {
        carId: selectedCarId,
        email: emailAddress,
        profile: {
          fullName,
          phone,
        },
        applyDetails: {
          employment,
          weeklyIncome: Number(weeklyIncome),
          durationMonths: Number(termMonths),
          drivingLicence: uploads.licenseFront || '',
          addressProof: uploads.licenseBack || '', // back license mapped to addressProof for backwards compatibility
          selfieWithId: uploads.proofOfAddress || '', // selfie mapped to selfieWithId
          location: location.trim()
        },
      };

      // 3. Dispatch application
      await api.applications.create(payload);

      // 4. Force state sync and routing
      if (syncDriverData) {
        await syncDriverData(emailAddress);
      }
      navigate('/dashboard?applied=success');
    } catch (err) {
      setAppError(err.message || 'Application database routing error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  if (carsLoading) {
    return <Loader label="Retrieving current stock models..." />;
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6" id="underwrite-application-view">
      {/* Header Panel */}
      <div className="text-center">
        <h1 className="font-sans font-semibold text-2xl text-gray-900 tracking-tight">Rent2Buy Application Form</h1>
      </div>

      {!user && (
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 flex items-start space-x-3 text-xs text-amber-850" id="login-warn-banner">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="block text-amber-900 font-semibold">Account Recommended</strong>
            <span>
              Log in to save progress and view checks.{" "}
              <Link to="/login?redirect=apply" className="font-bold underline text-amber-950">
                Log In or Register →
              </Link>
            </span>
          </div>
        </div>
      )}

      {/* Main Form container */}
      <form onSubmit={handleApplySubmit} className="bg-white rounded-xl border border-gray-150 p-5 sm:p-6 shadow-xs space-y-5">
        
        {/* Error flags */}
        {(appError || uploadError) && (
          <div className="bg-red-50 text-red-700 text-xs p-4 rounded-lg border border-red-100 font-medium space-y-1 animate-pulse" id="form-error-panel">
            <h4 className="font-semibold">Action Needed:</h4>
            <p>{appError || uploadError}</p>
          </div>
        )}

        {/* Section 1: Fleet Choice */}
        <div className="space-y-3">
          <h3 className="font-sans font-semibold text-sm text-gray-900">
            Vehicle Selection
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-medium">Vehicle</label>
              <select
                value={selectedCarId}
                onChange={(e) => setSelectedCarId(e.target.value)}
                className="w-full text-xs py-2 px-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
              >
                {carsList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} - {c.model} (from £{c.weeklyRate || c.price || 50}/wk)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-medium">Lease Term</label>
              <select
                value={termMonths}
                onChange={(e) => setTermMonths(e.target.value)}
                className="w-full text-xs py-2 px-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
              >
                <option value="12">12 Months</option>
                <option value="18">18 Months</option>
                <option value="24">24 Months</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Driver Info */}
        <div className="space-y-3 pt-4 border-t border-gray-150">
          <h3 className="font-sans font-semibold text-sm text-gray-900">
            Personal Info
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-medium">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full text-xs py-2 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-medium">Phone Number</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 07700 900222"
                className="w-full text-xs py-2 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-medium">Email</label>
              <input
                type="email"
                required
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                placeholder="jane@example.com"
                className="w-full text-xs py-2 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-medium">Employment</label>
              <select
                value={employment}
                onChange={(e) => setEmployment(e.target.value)}
                className="w-full text-xs py-2 px-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800"
              >
                <option value="Full Time Employee">Full Time</option>
                <option value="Self Employed PCO Operator">Self Employed (PCO)</option>
                <option value="Self Employed Professional">Self Employed</option>
                <option value="Company Director">Company Director</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-medium">Weekly Income (£)</label>
              <input
                type="number"
                required
                min="100"
                value={weeklyIncome}
                onChange={(e) => setWeeklyIncome(e.target.value)}
                placeholder="e.g. 450"
                className="w-full text-xs py-2 px-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1 font-medium flex items-center justify-between">
                <span>Location</span>
                {gpsLoading && <span className="text-[10px] text-indigo-600 animate-pulse font-bold">Scanning...</span>}
              </label>
              <div className="relative flex rounded-lg">
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Manchester, UK"
                  className="w-full text-xs py-2 pl-3 pr-14 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleGPSDetect}
                  className="absolute right-1 top-1 bottom-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold rounded-md flex items-center gap-1 cursor-pointer transition-all"
                >
                  <MapPin className="w-3 h-3 text-indigo-600" />
                  <span>GPS</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Document Uploaders */}
        <div className="space-y-3 pt-4 border-t border-gray-150">
          <h3 className="font-sans font-semibold text-sm text-gray-900">
            Documents
          </h3>
          <p className="text-[11px] text-gray-500 pb-2">
            Select high-quality photographs. Maximum file size is limited to 5MB. Clear, legible files ensure fast verification!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Front License Card */}
            <div 
              onDragEnter={(e) => handleDrag(e, setDragActiveFront)}
              onDragOver={(e) => handleDrag(e, setDragActiveFront)}
              onDragLeave={(e) => handleDrag(e, setDragActiveFront)}
              onDrop={(e) => handleDrop(e, setDragActiveFront, setLicenseFront)}
              className={`border border-dashed p-3 rounded-lg flex flex-col justify-between text-center min-h-[180px] transition-all relative ${
                dragActiveFront ? "border-indigo-500 bg-indigo-50/20" : "border-gray-200 bg-gray-50/40 hover:bg-gray-50"
              }`}
            >
              <div className="space-y-1 flex flex-col items-center">
                <div className={`p-1.5 rounded-full ${licenseFront ? "bg-emerald-55 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-800">License Front</h4>
                  <p className="text-[10px] text-gray-400">Clear photo front</p>
                </div>
              </div>

              {licenseFront ? (
                <div className="mt-2 relative group rounded-md overflow-hidden border border-slate-205 h-20 w-full bg-white flex flex-col justify-center items-center">
                  {licenseFront.type === 'application/pdf' ? (
                    <div className="flex flex-col items-center space-y-1">
                      <FileText className="w-5 h-5 text-rose-500" />
                      <span className="text-[9px] font-mono text-slate-600 max-w-[120px] truncate px-2 font-bold">{licenseFront.name}</span>
                    </div>
                  ) : (
                    <img 
                      src={URL.createObjectURL(licenseFront)} 
                      alt="Licence Front Preview" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => setLicenseFront(null)}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold text-[9px] px-2 py-0.5 rounded flex items-center gap-1 active:scale-95 transition-all shadow cursor-pointer"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-2 space-y-1">
                  <button
                    type="button"
                    onClick={() => setUploadType('front')}
                    className="w-full py-1 px-2 bg-white hover:bg-indigo-50 border border-slate-200 text-indigo-700 text-[10px] font-medium rounded-md transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1"
                  >
                    <UploadCloud className="w-3 h-3 shrink-0" />
                    <span>Upload</span>
                  </button>
                </div>
              )}

              {licenseFront && (
                <div className="absolute top-1.5 right-1.5 bg-emerald-500 text-white p-0.5 rounded-full shadow-sm">
                  <CheckCircle2 className="w-3 h-3" />
                </div>
              )}
            </div>

            {/* Back License Card */}
            <div 
              onDragEnter={(e) => handleDrag(e, setDragActiveBack)}
              onDragOver={(e) => handleDrag(e, setDragActiveBack)}
              onDragLeave={(e) => handleDrag(e, setDragActiveBack)}
              onDrop={(e) => handleDrop(e, setDragActiveBack, setLicenseBack)}
              className={`border border-dashed p-3 rounded-lg flex flex-col justify-between text-center min-h-[180px] transition-all relative ${
                dragActiveBack ? "border-indigo-500 bg-indigo-50/20" : "border-gray-200 bg-gray-50/40 hover:bg-gray-50"
              }`}
            >
              <div className="space-y-1 flex flex-col items-center">
                <div className={`p-1.5 rounded-full ${licenseBack ? "bg-emerald-55 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-800">License Back</h4>
                  <p className="text-[10px] text-gray-400">Clear photo back</p>
                </div>
              </div>

              {licenseBack ? (
                <div className="mt-2 relative group rounded-md overflow-hidden border border-slate-205 h-20 w-full bg-white flex flex-col justify-center items-center">
                  {licenseBack.type === 'application/pdf' ? (
                    <div className="flex flex-col items-center space-y-1">
                      <FileText className="w-5 h-5 text-rose-500" />
                      <span className="text-[9px] font-mono text-slate-600 max-w-[120px] truncate px-2 font-bold">{licenseBack.name}</span>
                    </div>
                  ) : (
                    <img 
                      src={URL.createObjectURL(licenseBack)} 
                      alt="Licence Back Preview" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => setLicenseBack(null)}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold text-[9px] px-2 py-0.5 rounded flex items-center gap-1 active:scale-95 transition-all shadow cursor-pointer"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-2 space-y-1">
                  <button
                    type="button"
                    onClick={() => setUploadType('back')}
                    className="w-full py-1 px-2 bg-white hover:bg-indigo-50 border border-slate-200 text-indigo-700 text-[10px] font-medium rounded-md transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1"
                  >
                    <UploadCloud className="w-3 h-3 shrink-0" />
                    <span>Upload</span>
                  </button>
                </div>
              )}

              {licenseBack && (
                <div className="absolute top-1.5 right-1.5 bg-emerald-500 text-white p-0.5 rounded-full shadow-sm">
                  <CheckCircle2 className="w-3 h-3" />
                </div>
              )}
            </div>

            {/* Selfie Verification Card */}
            <div 
              onDragEnter={(e) => handleDrag(e, setDragActiveSelfie)}
              onDragOver={(e) => handleDrag(e, setDragActiveSelfie)}
              onDragLeave={(e) => handleDrag(e, setDragActiveSelfie)}
              onDrop={(e) => handleDrop(e, setDragActiveSelfie, setSelfie)}
              className={`border border-dashed p-3 rounded-lg flex flex-col justify-between text-center min-h-[180px] transition-all relative ${
                dragActiveSelfie ? "border-indigo-500 bg-indigo-50/20" : "border-gray-200 bg-gray-50/40 hover:bg-gray-50"
              }`}
            >
              <div className="space-y-1 flex flex-col items-center">
                <div className={`p-1.5 rounded-full ${selfie ? "bg-emerald-55 text-emerald-600" : "bg-slate-100 text-slate-500"}`}>
                  <Camera className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-800">Selfie</h4>
                  <p className="text-[10px] text-gray-400">Direct portrait photo</p>
                </div>
              </div>

              {selfie ? (
                <div className="mt-2 relative group rounded-md overflow-hidden border border-slate-205 h-20 w-full bg-white flex flex-col justify-center items-center">
                  {selfie.type === 'application/pdf' ? (
                    <div className="flex flex-col items-center space-y-1">
                      <FileText className="w-5 h-5 text-rose-500" />
                      <span className="text-[9px] font-mono text-slate-600 max-w-[120px] truncate px-2 font-bold">{selfie.name}</span>
                    </div>
                  ) : (
                    <img 
                      src={URL.createObjectURL(selfie)} 
                      alt="Selfie Check Preview" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => setSelfie(null)}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold text-[9px] px-2 py-0.5 rounded flex items-center gap-1 active:scale-95 transition-all shadow cursor-pointer"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-2 space-y-1">
                  <button
                    type="button"
                    onClick={() => setUploadType('selfie')}
                    className="w-full py-1 px-2 bg-white hover:bg-indigo-50 border border-slate-200 text-indigo-700 text-[10px] font-medium rounded-md transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1"
                  >
                    <UploadCloud className="w-3 h-3 shrink-0" />
                    <span>Upload</span>
                  </button>
                </div>
              )}

              {selfie && (
                <div className="absolute top-1.5 right-1.5 bg-emerald-500 text-white p-0.5 rounded-full shadow-sm">
                  <CheckCircle2 className="w-3 h-3" />
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Upload Progress Loader panel */}
        {submitting && uploadProgress > 0 && (
          <div className="p-3 bg-slate-55 border border-slate-150 rounded-xl space-y-1.5 animate-pulse" id="progress-meter-container">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5 text-indigo-600">
                <RefreshCw className="w-3 h-3 animate-spin" />
                Uploading documents...
              </span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-slate-205 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300 ease-out" 
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Button Dispatches */}
        <div className="pt-4 border-t border-gray-100 flex justify-center">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={submitting}
            className="w-full sm:w-64 font-bold py-2 shadow"
          >
            {submitting ? 'Submitting...' : 'Apply'}
          </Button>
        </div>

      </form>

      {/* Hidden File Inputs for Targeted Camera/Gallery Access */}
      <input
        type="file"
        id="front-camera"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            try {
              validateFile(file);
              setLicenseFront(file);
              setAppError(null);
              setUploadError(null);
            } catch (err) {
              setAppError(err.message);
            }
          }
        }}
      />
      <input
        type="file"
        id="front-gallery"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            try {
              validateFile(file);
              setLicenseFront(file);
              setAppError(null);
              setUploadError(null);
            } catch (err) {
              setAppError(err.message);
            }
          }
        }}
      />

      <input
        type="file"
        id="back-camera"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            try {
              validateFile(file);
              setLicenseBack(file);
              setAppError(null);
              setUploadError(null);
            } catch (err) {
              setAppError(err.message);
            }
          }
        }}
      />
      <input
        type="file"
        id="back-gallery"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            try {
              validateFile(file);
              setLicenseBack(file);
              setAppError(null);
              setUploadError(null);
            } catch (err) {
              setAppError(err.message);
            }
          }
        }}
      />

      <input
        type="file"
        id="selfie-camera"
        accept="image/*"
        capture="user"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            try {
              validateFile(file);
              setSelfie(file);
              setAppError(null);
              setUploadError(null);
            } catch (err) {
              setAppError(err.message);
            }
          }
        }}
      />
      <input
        type="file"
        id="selfie-gallery"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            try {
              validateFile(file);
              setSelfie(file);
              setAppError(null);
              setUploadError(null);
            } catch (err) {
              setAppError(err.message);
            }
          }
        }}
      />

      {/* Choice Modal: Camera or Gallery Selection popup */}
      {uploadType && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex justify-center items-center z-50 animate-fade-in" id="upload-type-modal">
          <div className="bg-white p-6 rounded-2xl max-w-sm w-full mx-4 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h4 className="font-sans font-bold text-gray-900 text-xs uppercase tracking-wider">
                Select {uploadType === 'front' ? 'License Front' : uploadType === 'back' ? 'License Back' : 'Selfie Image'} Source
              </h4>
              <button 
                type="button" 
                onClick={() => setUploadType(null)} 
                className="text-gray-400 hover:text-gray-600 text-sm font-bold w-6 h-6 flex items-center justify-center rounded-full hover:bg-slate-150 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Choose whether you want to capture a clear document photograph using your device camera or select an existing package from your system storage.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              {/* Option A: Device Camera */}
              <button
                type="button"
                onClick={async () => {
                  await openDeviceCamera(uploadType);
                  setUploadType(null);
                }}
                className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-indigo-50/40 border border-slate-100 hover:border-indigo-150 rounded-xl cursor-pointer dynamic-choice-card transition-all text-center space-y-1.5 shadow-xs group w-full"
              >
                <div className="p-2.5 bg-indigo-50 rounded-full text-indigo-600 group-hover:scale-105 transition-all">
                  <Camera className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800">Use Camera</span>
                <span className="text-[9px] text-gray-400">Capture Instantly</span>
              </button>

              {/* Option B: Local Gallery */}
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById(`${uploadType}-gallery`);
                  if (el) el.click();
                  setUploadType(null);
                }}
                className="flex flex-col items-center justify-center p-4 bg-slate-50 hover:bg-indigo-50/40 border border-slate-100 hover:border-indigo-150 rounded-xl cursor-pointer dynamic-choice-card transition-all text-center space-y-1.5 shadow-xs group border-dashed w-full"
              >
                <div className="p-2.5 bg-indigo-50 rounded-full text-indigo-600 group-hover:scale-105 transition-all">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800">Photo Gallery</span>
                <span className="text-[9px] text-gray-400">Choose from Folder</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Camera Stream Interface Modal */}
      {cameraActiveType && activeCameraStream && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col justify-center items-center z-50 animate-fade-in text-center" id="live-camera-modal">
          <div className="max-w-md w-full mx-4 flex flex-col justify-between items-center text-center space-y-6 relative h-[85vh] max-h-[640px] p-6 bg-slate-900 border border-slate-850 rounded-3xl shadow-2xl">
            
            {/* Camera Modal Header */}
            <div className="w-full flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="text-left">
                <h4 className="font-sans font-black text-white text-xs uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  Live Camera Preview
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Align your {cameraActiveType === 'selfie' ? 'face' : 'documents'} inside the view frame
                </p>
              </div>
              <button 
                type="button" 
                onClick={closeCamera} 
                className="text-slate-400 hover:text-white text-xs font-bold w-7 h-7 flex items-center justify-center rounded-full bg-slate-850 hover:bg-slate-750 cursor-pointer shadow transition-all"
              >
                ✕
              </button>
            </div>

            {/* Video Feed Window */}
            <div className="relative w-full flex-1 bg-black rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted
                className="w-full h-full object-cover transform"
                style={{ transform: cameraActiveType === 'selfie' ? 'scaleX(-1)' : 'none' }}
              />
              {/* Highlight Target Guide Frame Overlay */}
              <div className="absolute inset-4 border border-indigo-500/30 rounded-xl pointer-events-none flex flex-col justify-between p-4">
                <div className="flex justify-between">
                  <div className="w-6 h-6 border-t-2 border-l-2 border-indigo-500" />
                  <div className="w-6 h-6 border-t-2 border-r-2 border-indigo-500" />
                </div>
                <div className="flex justify-between">
                  <div className="w-6 h-6 border-b-2 border-l-2 border-indigo-500" />
                  <div className="w-6 h-6 border-b-2 border-r-2 border-indigo-500" />
                </div>
              </div>
            </div>

            {/* Captured Actions Area */}
            <div className="w-full flex justify-center items-center gap-4 border-t border-slate-800 pt-4">
              <button
                type="button"
                onClick={closeCamera}
                className="px-5 py-2.5 bg-slate-850 hover:bg-slate-750 text-slate-300 hover:text-white font-bold text-xs rounded-xl cursor-pointer transition-all border border-slate-800"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleCapturePhoto}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-extrabold text-xs rounded-xl cursor-pointer transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/30"
              >
                <Camera className="w-4 h-4" />
                <span>Take Photo</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
