import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#050C16] text-gray-300 py-12 md:py-16 select-none border-t border-slate-900" id="main-footer-layout">
      <div className="max-w-[100%px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Column 1 */}
          <div className="flex flex-col items-start md:items-center">
            <ul className="space-y-1 text-[18px] font-semibold text-gray-300 text-left">
              <li className="flex items-center gap-2">
                <span className="text-gray-400 select-none">•</span>
                <Link to="/profile" className="hover:text-white transition-colors">Make a payment</Link>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-400 select-none">•</span>
                <Link to="/register" className="hover:text-white transition-colors">Set up your account</Link>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-400 select-none">•</span>
                <Link to="/contact" className="hover:text-white transition-colors">Make a claim</Link>
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col items-start md:items-center">
            <ul className="space-y-1 text-[18px] font-semibold text-gray-300 text-left">
              <li className="flex items-center gap-2">
                <span className="text-gray-400 select-none">•</span>
                <a href="#cookies" className="hover:text-white transition-colors">Cookies Policy</a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-400 select-none">•</span>
                <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-400 select-none">•</span>
                <a href="#terms" className="hover:text-white transition-colors">Terms & Conditions</a>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col items-start md:items-center">
            <ul className="space-y-1 text-[18px] font-semibold text-gray-300 text-left">
              <li className="flex items-center gap-2">
                <span className="text-gray-400 select-none">•</span>
                <Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-400 select-none">•</span>
                <Link to="/faq" className="hover:text-white transition-colors">Help Centre</Link>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-400 select-none">•</span>
                <a href="#complaints" className="hover:text-white transition-colors">Complaints Procedure</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-900 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center text-[11px] text-gray-500 gap-4">
          <p>&copy; {currentYear} R2buy.com. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

