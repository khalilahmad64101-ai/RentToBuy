import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#F9FAFB] pb-12 -mt-24 sm:mt-0 sm:pt-12 sm:pb-16 select-none" id="main-footer-layout">
      <div className="w-full max-w-6xl mx-auto px-4">
        
        {/* Dark Footer Capsule Card - Matches the screenshot exactly */}
        <div className="bg-[#0B1320] text-gray-200 rounded-[1.5rem] p-6 sm:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.15)] border border-slate-800 max-w-md md:max-w-4xl mx-auto">
          
          {/* Responsive Layout: Vertical stack on mobile, 3-column grid on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-12">
            
            {/* Group 1 */}
            <div className="flex flex-col items-start">
              <ul className="space-y-2.5 sm:space-y-3 text-[14px] sm:text-base font-semibold text-gray-200 text-left">
                <li className="flex items-center gap-2.5">
                  <span className="text-white text-xs select-none">•</span>
                  <Link to="/profile" className="hover:text-[#7CC242] transition-colors duration-150">Make a payment</Link>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-white text-xs select-none">•</span>
                  <Link to="/register" className="hover:text-[#7CC242] transition-colors duration-150">Set up your account</Link>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-white text-xs select-none">•</span>
                  <Link to="/contact" className="hover:text-[#7CC242] transition-colors duration-150">Make a claim</Link>
                </li>
              </ul>
            </div>

            {/* Separator/Gap for mobile between groups to mimic screenshot style spacing */}
            <div className="h-2 md:hidden" />

            {/* Group 2 */}
            <div className="flex flex-col items-start">
              <ul className="space-y-2.5 sm:space-y-3 text-[14px] sm:text-base font-semibold text-gray-200 text-left">
                <li className="flex items-center gap-2.5">
                  <span className="text-white text-xs select-none">•</span>
                  <a href="#cookies" className="hover:text-[#7CC242] transition-colors duration-150">Cookies Policy</a>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-white text-xs select-none">•</span>
                  <a href="#privacy" className="hover:text-[#7CC242] transition-colors duration-150">Privacy Policy</a>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-white text-xs select-none">•</span>
                  <a href="#terms" className="hover:text-[#7CC242] transition-colors duration-150">Terms & Conditions</a>
                </li>
              </ul>
            </div>

            {/* Separator/Gap for mobile between groups */}
            <div className="h-2 md:hidden" />

            {/* Group 3 */}
            <div className="flex flex-col items-start">
              <ul className="space-y-2.5 sm:space-y-3 text-[14px] sm:text-base font-semibold text-gray-200 text-left">
                <li className="flex items-center gap-2.5">
                  <span className="text-white text-xs select-none">•</span>
                  <Link to="/contact" className="hover:text-[#7CC242] transition-colors duration-150">Contact Us</Link>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-white text-xs select-none">•</span>
                  <Link to="/faq" className="hover:text-[#7CC242] transition-colors duration-150">Help Centre</Link>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="text-white text-xs select-none">•</span>
                  <a href="#complaints" className="hover:text-[#7CC242] transition-colors duration-150">Complaints Procedure</a>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* Copyright Text below the card */}
        <div className="text-center mt-8 text-xs text-gray-400 font-medium">
          <p>&copy; {currentYear} R2buy.com. All Rights Reserved.</p>
        </div>

      </div>
    </footer>
  );
}


