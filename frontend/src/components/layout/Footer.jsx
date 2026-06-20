import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Send, Phone, MapPin, Mail, ShieldAlert } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0B1320] text-gray-400 border-t border-slate-850" id="main-footer-layout">
      <div className="max-w-[1100px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Brand block */}
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full bg-[#8ED34A] flex items-center justify-center mr-2 shadow-sm">
                <Car className="h-3 w-3 text-white" strokeWidth={3} />
              </div>
              <span className="font-extrabold text-white text-base tracking-tight">
                R2
              </span>
              <span className="font-extrabold text-[#8ED34A] text-base tracking-tight ml-0.5">
                BuyCar
              </span>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              We specialize in providing high-quality, reliable, Rent-to-Buy and leased vehicle arrangements. Sourcing nationwide across the UK with dedicated target focus in Manchester and the Northwest.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xs font-bold text-white tracking-wider uppercase mb-2">Lease Options</h3>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link to="/cars" className="hover:text-[#8ED34A] transition-colors">Vehicle Catalog</Link>
              </li>
              <li>
                <Link to="/apply" className="hover:text-[#8ED34A] transition-colors">Start Underwriting Application</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#8ED34A] transition-colors">Rental & Buying Process</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#8ED34A] transition-colors">Contact Our Agents</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs font-bold text-white tracking-wider uppercase mb-2">Contact Info</h3>
            <ul className="space-y-1.5 text-[11px] text-gray-400">
              <li className="flex items-start space-x-2">
                <Phone className="h-3.5 w-3.5 text-[#8ED34A] shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span>Landline: 0161 368 9635</span>
                  <span>Mobile: 07758313276</span>
                </div>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-3.5 w-3.5 text-[#8ED34A] shrink-0" />
                <span>support@r2buy.com</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-3.5 w-3.5 text-[#8ED34A] shrink-0 mt-0.5" />
                <span className="leading-snug">
                  Piccadilly Business Centre, Aldow Enterprise Park, Manchester, M12 6AE
                </span>
              </li>
            </ul>
          </div>

          {/* Nationwide info */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-white tracking-wider uppercase">Nationwide PCO Fleet</h3>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              All vehicles come complete with ready-to-work insurance cover, Clean Air Zone clearances, and immediate licensing. Main vehicle center located in Manchester.
            </p>
          </div>
        </div>

        {/* Copy and legal links */}
        <div className="border-t border-slate-800 mt-6 pt-4 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-500">
          <p>&copy; {currentYear} R2buy.com. All Rights Reserved.</p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            <a href="#terms" className="hover:text-gray-300 transition-colors">Terms of Underwriting</a>
            <a href="#privacy" className="hover:text-gray-300 transition-colors">GDPR & Privacy Policy</a>
            <a href="#insurance" className="hover:text-gray-300 transition-colors">Comprehensive Insurance Statement</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
