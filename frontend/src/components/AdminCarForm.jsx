import React, { useState, useEffect } from 'react';
import { Upload, X, Camera, AlertCircle, PlusCircle, Trash } from 'lucide-react';

const STANDARD_FEATURES = [
  'Air Conditioning',
  'Parking Sensors',
  'Bluetooth Connection',
  'Adaptive Cruise Control',
  'Heated Seats',
  'GPS Sat Nav',
  'Lane Departure Warning',
  'Active Backup Camera',
  'Apple CarPlay',
  'Android Auto'
];

export default function AdminCarForm({ car, onCancel, onSubmit, isLoading, api }) {
  // Every field has its own separate state variable
  const [carName, setCarName] = useState(car?.name || '');
  const [carModel, setCarModel] = useState(car?.model || '');
  const [carBrand, setCarBrand] = useState(car?.brand || '');
  const [carYear, setCarYear] = useState(car?.year || '2024');
  const [carPrice, setCarPrice] = useState(car ? String(car.weeklyRate || car.price || '45') : '45');
  const [carMonthlyRate, setCarMonthlyRate] = useState(car ? String(car.monthlyRate || '') : '180');
  const [carDeposit, setCarDeposit] = useState(car ? String(car.deposit || '150') : '150');
  const [carFuel, setCarFuel] = useState(car?.fuel || 'Hybrid');
  const [carTransmission, setCarTransmission] = useState(car?.transmission || 'Automatic');
  const [carEconomy, setCarEconomy] = useState(car?.economy || '65 mpg');
  const [carMileage, setCarMileage] = useState(car?.mileage || '15,000 miles');
  const [carColor, setCarColor] = useState(car?.color || '');
  const [carCategory, setCarCategory] = useState(car?.category || 'Standard Hatchback');
  const [carStatus, setCarStatus] = useState(car?.status || 'Available');
  const [carDescription, setCarDescription] = useState(car?.description || '');
  
  // Apply Button Text & Vehicle Badge
  const [carApplyButtonText, setCarApplyButtonText] = useState(car?.applyButtonText || 'Apply for this vehicle');
  const [carBadge, setCarBadge] = useState(car?.badge || '');

  // Features - individual checkbox list and a custom input
  const initialFeatures = Array.isArray(car?.features) ? car.features : [];
  const [selectedFeatures, setSelectedFeatures] = useState(
    STANDARD_FEATURES.filter(f => initialFeatures.some(elem => elem.toLowerCase() === f.toLowerCase()))
  );
  const [customFeatures, setCustomFeatures] = useState(
    initialFeatures.filter(f => !STANDARD_FEATURES.some(elem => elem.toLowerCase() === f.toLowerCase()))
  );
  const [newFeatureText, setNewFeatureText] = useState('');

  // Specifications state - separate text fields
  const specsArr = Array.isArray(car?.specifications) ? car.specifications : [];
  const getSpecValue = (prefix) => {
    const found = specsArr.find(v => v.toLowerCase().startsWith(prefix.toLowerCase()));
    if (!found) return '';
    return found.substring(prefix.length).trim();
  };

  const [specEngine, setSpecEngine] = useState(getSpecValue('Engine: ') || '1.8L Electric Hybrid');
  const [specCO2, setSpecCO2] = useState(getSpecValue('CO2: ') || '94 g/km');
  const [specSeats, setSpecSeats] = useState(getSpecValue('Seats: ') || '5');
  const [specDoors, setSpecDoors] = useState(getSpecValue('Doors: ') || '5');
  const [specRoadTax, setSpecRoadTax] = useState(getSpecValue('Road Tax: ') || 'Included');

  // Multi-image gallery state (Max 10 slots)
  // Let's seed 10 slots with whatever image list is currently on the car
  const initialImages = Array.isArray(car?.images) ? car.images : (car?.image ? [car?.image] : []);
  const [imageGallery, setImageGallery] = useState(() => {
    const list = Array(10).fill('');
    initialImages.forEach((img, idx) => {
      if (idx < 10) list[idx] = img;
    });
    return list;
  });

  const [uploadProgress, setUploadProgress] = useState(Array(10).fill(null));

  // Custom Feature append helper
  const handleAddCustomFeature = () => {
    if (newFeatureText.trim()) {
      setCustomFeatures(prev => [...prev, newFeatureText.trim()]);
      setNewFeatureText('');
    }
  };

  const handleFeatureToggle = (feature) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature) 
        : [...prev, feature]
    );
  };

  // Image Upload handler matching requirement:
  // Upload from device, drag & drop upload, preview, replace, remove, max 10 slots
  const processImageFile = async (file, index) => {
    // Show local thumbnail preview immediately for optimal UI
    const localReader = new FileReader();
    localReader.onload = () => {
      const b64 = localReader.result;
      setImageGallery(prev => {
        const next = [...prev];
        next[index] = b64;
        return next;
      });
    };
    localReader.readAsDataURL(file);

    // Trigger api upload in the background
    setUploadProgress(prev => {
      const next = [...prev];
      next[index] = 'uploading';
      return next;
    });

    try {
      const res = await api.upload.carImage(file);
      if (res && res.url) {
        setImageGallery(prev => {
          const next = [...prev];
          next[index] = res.url;
          return next;
        });
      }
    } catch (err) {
      console.error("[ADD-CAR-IMAGE] upload fail details:", err);
      alert("Device image stream could not sync to Heathrow media server. Check network connection.");
    } finally {
      setUploadProgress(prev => {
        const next = [...prev];
        next[index] = null;
        return next;
      });
    }
  };

  const handleFileDrop = (e, index) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0], index);
    }
  };

  const handleFileChange = (e, index) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0], index);
    }
  };

  const removeGalleryImage = (index) => {
    setImageGallery(prev => {
      const next = [...prev];
      next[index] = '';
      return next;
    });
  };

  const handleFormSubmitInternal = (e) => {
    e.preventDefault();

    // Map features
    const allFeatures = [...selectedFeatures, ...customFeatures];

    // Map specifications lists
    const specsList = [];
    if (specEngine) specsList.push(`Engine: ${specEngine}`);
    if (specCO2) specsList.push(`CO2: ${specCO2}`);
    if (specSeats) specsList.push(`Seats: ${specSeats}`);
    if (specDoors) specsList.push(`Doors: ${specDoors}`);
    if (specRoadTax) specsList.push(`Road Tax: ${specRoadTax}`);

    // Map images list
    const filteredImages = imageGallery.filter(img => img && img.trim() !== '');

    const payload = {
      name: carName.trim(),
      model: carModel.trim(),
      brand: carBrand.trim(),
      year: carYear,
      price: Number(carPrice),
      weeklyRate: Number(carPrice),
      monthlyRate: Number(carMonthlyRate) || (Number(carPrice) * 4),
      deposit: Number(carDeposit),
      fuel: carFuel,
      transmission: carTransmission,
      economy: carEconomy,
      mileage: carMileage,
      color: carColor,
      category: carCategory,
      status: carStatus,
      description: carDescription.trim(),
      features: allFeatures,
      specifications: specsList,
      applyButtonText: carApplyButtonText.trim(),
      badge: carBadge.trim(),
      image: filteredImages[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
      images: filteredImages
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleFormSubmitInternal} className="space-y-8 max-w-5xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 gap-4">
        <div>
          <h2 className="text-xl font-black text-[#1F3F7A] uppercase">{car ? 'Edit Vehicle Profile' : 'Add New Portfolio Vehicle'}</h2>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-bold uppercase border border-gray-200 hover:bg-gray-50 text-gray-500 rounded-xl transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !carName || !carModel}
            className="px-5 py-2 bg-[#7CC242] hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition shadow disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? 'Saving...' : car ? 'Save Portfolio Updates' : 'Publish Model Live'}
          </button>
        </div>
      </div>

      {/* Grid wrapper */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left column: Parameters Grid */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main profile settings */}
          <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase text-[#1F3F7A] border-b border-gray-100 pb-2">Vehicle Core Identifiers</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-[#1F3F7A]/80 uppercase tracking-wider mb-1.5">Vehicle Stock Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Corolla Space Wagon"
                  value={carName}
                  onChange={(e) => setCarName(e.target.value)}
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 outline-none rounded-xl focus:bg-white focus:border-[#1F3F7A] transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#1F3F7A]/80 uppercase tracking-wider mb-1.5">Vehicle Model Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. hybrid Synergy Drive"
                  value={carModel}
                  onChange={(e) => setCarModel(e.target.value)}
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 outline-none rounded-xl focus:bg-white focus:border-[#1F3F7A] transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#1F3F7A]/80 uppercase tracking-wider mb-1.5">Vehicle Brand Maker *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Toyota"
                  value={carBrand}
                  onChange={(e) => setCarBrand(e.target.value)}
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 outline-none rounded-xl focus:bg-white focus:border-[#1F3F7A] transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-[#1F3F7A]/80 uppercase tracking-wider mb-1.5">Weekly Rate Price (£) *</label>
                <input
                  type="number"
                  required
                  value={carPrice}
                  onChange={(e) => {
                    setCarPrice(e.target.value);
                    setCarMonthlyRate(String(Number(e.target.value) * 4));
                  }}
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 outline-none rounded-xl focus:bg-white focus:border-[#1F3F7A] transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#1F3F7A]/80 uppercase tracking-wider mb-1.5">Monthly Rate Calculator (£) *</label>
                <input
                  type="number"
                  required
                  value={carMonthlyRate}
                  onChange={(e) => setCarMonthlyRate(e.target.value)}
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 outline-none rounded-xl focus:bg-white focus:border-[#1F3F7A] transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#1F3F7A]/80 uppercase tracking-wider mb-1.5">Starting Deposit Dues (£)</label>
                <input
                  type="number"
                  value={carDeposit}
                  onChange={(e) => setCarDeposit(e.target.value)}
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 outline-none rounded-xl focus:bg-white focus:border-[#1F3F7A] transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#1F3F7A]/80 uppercase tracking-wider mb-1.5">Vehicle Category Class</label>
                <select
                  value={carCategory}
                  onChange={(e) => setCarCategory(e.target.value)}
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 outline-none rounded-xl focus:bg-white focus:border-[#1F3F7A] transition"
                >
                  <option value="Hatchback Selection">Hatchback Selection</option>
                  <option value="Comfortable Sedan">Comfortable Sedan</option>
                  <option value="Executive Estate">Executive Estate</option>
                  <option value="Standard Hatchback">Standard Hatchback</option>
                  <option value="Compact EV Mini">Compact EV Mini</option>
                  <option value="Family SUV 4x4">Family SUV 4x4</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-[#1F3F7A]/80 uppercase tracking-wider mb-1.5">Model Year *</label>
                <input
                  type="text"
                  placeholder="2024"
                  value={carYear}
                  onChange={(e) => setCarYear(e.target.value)}
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 outline-none rounded-xl focus:bg-white focus:border-[#1F3F7A] transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#1F3F7A]/80 uppercase tracking-wider mb-1.5">Fuel / Battery Type</label>
                <select
                  value={carFuel}
                  onChange={(e) => setCarFuel(e.target.value)}
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 outline-none rounded-xl focus:bg-white focus:border-[#1F3F7A] transition"
                >
                  <option value="Hybrid (Petrol/Electric)">Hybrid (Petrol/Electric)</option>
                  <option value="Full Electric EV">Full Electric EV</option>
                  <option value="Eco Petrol">Eco Petrol</option>
                  <option value="Plug-in Hybrid PHEV">Plug-in Hybrid PHEV</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#1F3F7A]/80 uppercase tracking-wider mb-1.5">Transmission Type</label>
                <select
                  value={carTransmission}
                  onChange={(e) => setCarTransmission(e.target.value)}
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 outline-none rounded-xl focus:bg-white focus:border-[#1F3F7A] transition"
                >
                  <option value="Automatic">Automatic Transmission</option>
                  <option value="Manual">Manual Stick-Shift</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#1F3F7A]/80 uppercase tracking-wider mb-1.5">Fuel Economy</label>
                <input
                  type="text"
                  placeholder="e.g. 68.2 mpg"
                  value={carEconomy}
                  onChange={(e) => setCarEconomy(e.target.value)}
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 outline-none rounded-xl focus:bg-white focus:border-[#1F3F7A] transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-[#1F3F7A]/80 uppercase tracking-wider mb-1.5 font-sans">Odometer Mileage</label>
                <input
                  type="text"
                  placeholder="e.g. 12,000 miles"
                  value={carMileage}
                  onChange={(e) => setCarMileage(e.target.value)}
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 outline-none rounded-xl focus:bg-white focus:border-[#1F3F7A] transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#1F3F7A]/80 uppercase tracking-wider mb-1.5">Exterior Color Painting</label>
                <input
                  type="text"
                  placeholder="e.g. Metallic Silver"
                  value={carColor}
                  onChange={(e) => setCarColor(e.target.value)}
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 outline-none rounded-xl focus:bg-white focus:border-[#1F3F7A] transition"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#1F3F7A]/80 uppercase tracking-wider mb-1.5">Availability Status</label>
                <select
                  value={carStatus}
                  onChange={(e) => setCarStatus(e.target.value)}
                  className="w-full text-xs p-3 bg-gray-50 border border-gray-200 outline-none rounded-xl focus:bg-white focus:border-[#1F3F7A] transition"
                >
                  <option value="Available">Available for Delivery</option>
                  <option value="Reserved">Reserved Hold</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-[#1F3F7A]/80 uppercase tracking-wider">Public Description Details</label>
              <textarea
                rows={4}
                required
                placeholder="Give descriptive particulars of this model. Mention the battery state, compliance ratings, and standard inclusions under weekly licensing models..."
                value={carDescription}
                onChange={(e) => setCarDescription(e.target.value)}
                className="w-full text-xs p-4 bg-gray-50 border border-gray-200 outline-none rounded-xl focus:bg-white focus:border-[#1F3F7A] transition"
              />
            </div>
          </div>

          {/* DRAG-AND-DROP IMAGE GALLERY OF 10 IMAGES */}
          <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-xs font-black uppercase text-[#1F3F7A] flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-[#7CC242]" /> Catalog Media Gallery (Up to 10 Images)
              </h3>
              <p className="text-[10px] text-gray-400 mt-0.5">Slots support standard click file selection or drag-and-drop. Thumbnails instantly index upon Heathrow file uploading.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5" id="admin-gallery-dropzone-grid">
              {imageGallery.map((url, index) => {
                const isUploading = uploadProgress[index] === 'uploading';
                const hasUrl = url && url.startsWith('http');
                
                return (
                  <div
                    key={index}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleFileDrop(e, index)}
                    className={`relative border-2 border-dashed rounded-xl aspect-square flex flex-col items-center justify-center text-center transition ${
                      hasUrl 
                        ? 'border-gray-200 bg-white' 
                        : 'border-gray-200 hover:border-[#1F3F7A]/30 bg-gray-50 hover:bg-gray-100/50'
                    }`}
                  >
                    {isUploading ? (
                      <div className="space-y-1.5">
                        <div className="w-5 h-5 border-2 border-[#1F3F7A] border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <span className="text-[9px] text-[#1F3F7A]/60 font-mono font-bold uppercase block">Loading</span>
                      </div>
                    ) : hasUrl ? (
                      <div className="relative w-full h-full group rounded-xl overflow-hidden">
                        <img 
                          src={url} 
                          alt={`Slot ${index + 1}`} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-[#1F3F7A]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-1.5">
                          <label className="px-2 py-1 bg-white hover:bg-gray-100 text-[9px] font-black uppercase tracking-wider rounded-md text-[#1F3F7A] cursor-pointer shadow-sm">
                            Replace
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={(e) => handleFileChange(e, index)}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(index)}
                            className="px-2 py-1 bg-red-550 hover:bg-red-600 text-white text-[9px] font-black uppercase tracking-wider rounded-md shadow-sm transition"
                          >
                            Remove
                          </button>
                        </div>
                        <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] font-bold px-1 py-0.5 rounded leading-none shrink-0 font-mono">
                          {index === 0 ? 'Main' : `#${index + 1}`}
                        </span>
                      </div>
                    ) : (
                      <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-4 select-none">
                        <Upload className="w-5 h-5 text-gray-400 mb-1" />
                        <span className="text-[9px] text-[#1F3F7A] font-bold uppercase tracking-wider">
                          Slot #{index + 1}
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, index)}
                        />
                      </label>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column: Specs and Feature lists */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Specifications Panel */}
          <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase text-[#1F3F7A] border-b border-gray-100 pb-2">Technical Specifications</h3>
            
            <div className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-bold text-[#1F3F7A]/85 uppercase tracking-wider mb-1">Engine Engine Configuration</label>
                <input
                  type="text"
                  value={specEngine}
                  onChange={(e) => setSpecEngine(e.target.value)}
                  placeholder="e.g. 1.8L Hybrid"
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 outline-none rounded-xl focus:bg-white focus:border-[#1F3F7A] transition"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#1F3F7A]/85 uppercase tracking-wider mb-1">CO2 Exhaust Emissions</label>
                <input
                  type="text"
                  value={specCO2}
                  onChange={(e) => setSpecCO2(e.target.value)}
                  placeholder="e.g. 96 g/km"
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 outline-none rounded-xl focus:bg-white focus:border-[#1F3F7A] transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-[#1F3F7A]/85 uppercase tracking-wider mb-1">Seats Count</label>
                  <input
                    type="text"
                    value={specSeats}
                    onChange={(e) => setSpecSeats(e.target.value)}
                    placeholder="5"
                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 outline-none rounded-xl focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#1F3F7A]/85 uppercase tracking-wider mb-1">Doors Count</label>
                  <input
                    type="text"
                    value={specDoors}
                    onChange={(e) => setSpecDoors(e.target.value)}
                    placeholder="5"
                    className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 outline-none rounded-xl focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#1F3F7A]/85 uppercase tracking-wider mb-1">Road Tax Level</label>
                <input
                  type="text"
                  value={specRoadTax}
                  onChange={(e) => setSpecRoadTax(e.target.value)}
                  placeholder="e.g. £0 First Year (Included)"
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-200 outline-none rounded-xl focus:bg-white focus:border-[#1F3F7A] transition"
                />
              </div>
            </div>
          </div>

          {/* Features Checkboxes with custom inline adds */}
          <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase text-[#1F3F7A] border-b border-gray-100 pb-2 flex justify-between items-center">
              <span>Installed Comfort Techs</span>
              <span className="text-[10px] text-[#7CC242] font-black">{selectedFeatures.length + customFeatures.length} tags</span>
            </h3>

            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {STANDARD_FEATURES.map((feat) => {
                const isChecked = selectedFeatures.includes(feat);
                return (
                  <label key={feat} className="flex items-center space-x-2.5 cursor-pointer py-1 block select-none">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleFeatureToggle(feat)}
                      className="w-4 h-4 text-[#1F3F7A] border-gray-300 rounded focus:ring-[#1F3F7A]"
                    />
                    <span className="text-xs text-[#1F3F7A]/80 font-medium">{feat}</span>
                  </label>
                );
              })}

              {/* Custom specs/features */}
              {customFeatures.map((feat) => (
                <div key={feat} className="flex items-center justify-between bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                  <span className="text-xs text-gray-700 font-medium">{feat}</span>
                  <button
                    type="button"
                    onClick={() => setCustomFeatures(prev => prev.filter(f => f !== feat))}
                    className="text-red-500 hover:text-red-600 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Custom add text input */}
            <div className="pt-2 border-t border-gray-100 space-y-1.5">
              <label className="block text-[9.5px] font-black text-gray-550 uppercase tracking-widest col">Insert Specific Extra</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Premium Sound System"
                  value={newFeatureText}
                  onChange={(e) => setNewFeatureText(e.target.value)}
                  className="flex-1 text-xs p-2 bg-gray-50 border border-gray-200 outline-none rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleAddCustomFeature}
                  className="bg-[#1F3F7A] text-white py-1 px-3 text-xs font-bold rounded-lg hover:bg-opacity-90 shrink-0 transition"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Branding specifics */}
          <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase text-[#1F3F7A] border-b border-gray-100 pb-2">Branding details</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-[#1F3F7A]/85 uppercase tracking-wider mb-1">Apply Button Text Label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apply for this vehicle"
                  value={carApplyButtonText}
                  onChange={(e) => setCarApplyButtonText(e.target.value)}
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-250 outline-none rounded-xl focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#1F3F7A]/85 uppercase tracking-wider mb-1">Promo Badge (e.g. Popular, EV, Sale)</label>
                <input
                  type="text"
                  placeholder="e.g. Best Air Quality"
                  value={carBadge}
                  onChange={(e) => setCarBadge(e.target.value)}
                  className="w-full text-xs p-2.5 bg-gray-50 border border-gray-250 outline-none rounded-xl focus:bg-white font-semibold"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </form>
  );
}
