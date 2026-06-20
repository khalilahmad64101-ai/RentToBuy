import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  // Do NOT show the Back button on the Home page or Dashboard.
  if (location.pathname === '/' || location.pathname.startsWith('/dashboard')) {
    return null;
  }

  const handleBack = (e) => {
    e.preventDefault();
    // When clicked, navigate to the previous page. If no previous page is present, redirect to Home.
    if (window.history.length <= 1) {
      navigate('/');
    } else {
      navigate(-1);
    }
  };

  // Determine if the page is a dark/colorful hero page for proper contrast with the transparent background.
  const isDarkHeroPage = ['/faq', '/cars', '/how-it-works', '/contact'].some(path => 
    location.pathname.startsWith(path)
  );

  return (
    <div className="relative w-full h-0 z-40" id="global-back-navigation-container">
      <div className="absolute left-0 top-3 sm:top-5 md:top-6 pt-[env(safe-area-inset-top,0px)] pointer-events-none select-none w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex justify-start items-center">
          <button
            onClick={handleBack}
            type="button"
            id="global-back-nav-button"
            className={`pointer-events-auto inline-flex items-center gap-1.5 transition-all duration-200 cursor-pointer active:scale-90 focus:outline-none group rounded px-1.5 py-1 ${
              isDarkHeroPage 
                ? 'text-white hover:text-white/85 hover:-translate-x-0.5' 
                : 'text-slate-800 hover:text-[#7CC242] hover:-translate-x-0.5'
            }`}
            style={{
              textShadow: isDarkHeroPage ? '0 1px 2px rgba(0,0,0,0.4)' : 'none',
            }}
            title="Go back"
          >
            <ArrowLeft 
              className={`w-5 h-5 sm:w-6 sm:h-6 stroke-[3] transition-colors ${
                isDarkHeroPage ? 'text-white' : 'text-slate-800 group-hover:text-[#7CC242]'
              }`} 
            />
            <span className="hidden sm:inline-block text-[11px] font-black uppercase tracking-widest font-sans">
              Back
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

