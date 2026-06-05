import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Send, Phone, MapPin, Mail, ShieldAlert } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800" id="main-footer-layout">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand block */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-white">
              <Car className="h-6 w-6 stroke-[2.5]" />
              <span className="font-sans font-bold text-lg tracking-tight">
                R2buy<span className="text-[#CDA275]">.com</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              We specialize in providing high-quality, reliable, Rent-to-Buy and leased vehicle arrangements. Serving nationwide across the UK with dedicated target focus in Manchester and the Northwest region. Simple weekly payments and seamless route to vehicle ownership.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Lease Options</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/cars" className="hover:text-white transition-colors">Vehicle Catalog</Link>
              </li>
              <li>
                <Link to="/apply" className="hover:text-white transition-colors">Start Underwriting Application</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">Rental & Buying Process</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Contact Our Agents</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Contact Info</h3>
            <ul className="space-y-2 text-xs text-gray-400">
              <li className="flex items-start space-x-2">
                <Phone className="h-4 w-4 text-[#CDA275] shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span>Landline: 0161 368 9635</span>
                  <span>Mobile: 07758313276</span>
                </div>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-[#CDA275] shrink-0" />
                <span>support@r2buy.com</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-[#CDA275] shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Piccadilly Business Centre,<br />
                  Aldow Enterprise Park,<br />
                  Manchester, M12 6AE,<br />
                  United Kingdom
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter / Underwriting check banner */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Nationwide PCO Fleet</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              All vehicles come complete with ready-to-work insurance cover, Clean Air Zone clearances, and immediate local licensing. Main vehicle center located in Manchester.
            </p>
            <div className="flex items-center space-x-2 text-amber-400 text-xs bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Verified underwriter criteria applies.</span>
            </div>
          </div>
        </div>

        {/* Copy and legal links */}
        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {currentYear} R2buy.com. All Rights Reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#terms" className="hover:text-gray-300 transition-colors">Terms of Underwriting</a>
            <a href="#privacy" className="hover:text-gray-300 transition-colors">GDPR & Privacy Policy</a>
            <a href="#insurance" className="hover:text-gray-300 transition-colors">Comprehensive Insurance Statement</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
