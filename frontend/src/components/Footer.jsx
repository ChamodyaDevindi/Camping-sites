import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-slate-900 to-slate-950 text-gray-300 pt-16 pb-8 border-t border-slate-800">
      {/* Decorative top border gradient line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-nature-green)] via-[var(--color-nature-sand)] to-[var(--color-nature-light-green)]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-5 space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <svg className="h-8 w-8 text-[var(--color-nature-green)] group-hover:text-[var(--color-nature-sand)] transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-bold text-2xl text-[var(--color-nature-sand)] tracking-wider">CampNest</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Discover and book the most breathtaking campsites across the country. Host your own spots, share the wilderness, and make unforgettable memories under the stars.
            </p>
            
            {/* Social Icons with Micro-animations */}
            <div className="flex gap-4 pt-2">
              <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-[var(--color-nature-green)] flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:scale-110">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8H7v3h2v9h4v-9h3.61L17 8h-3V6.21C14 5.37 14.5 5 15.22 5H17V1H14.46C11.5 1 10 2.5 10 5.5V8z"/></svg>
              </a>
              <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-[var(--color-nature-sand)] flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:scale-110">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01"/></svg>
              </a>
              <a href="#" aria-label="WhatsApp" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-green-600 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:scale-110">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.005 5.322 5.4 0 12.028 0c3.208.001 6.223 1.249 8.49 3.52C22.787 5.79 24.032 8.8 24.03 12.008c-.004 6.685-5.399 12.007-12.03 12.007-2.002-.001-3.97-.502-5.713-1.458L0 24zM6.602 20.59a10.354 10.354 0 005.429 1.52c5.529 0 10.029-4.478 10.032-9.986.002-2.67-1.032-5.18-2.909-7.054C17.278 3.197 14.779 2.164 12.11 2.16c-5.526 0-10.024 4.479-10.027 9.986-.001 1.956.516 3.864 1.5 5.567l-.986 3.6 3.69-.96c1.614.88 3.424 1.34 5.315 1.341z"/></svg>
              </a>
              <a href="#" aria-label="Twitter" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-sky-500 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:scale-110">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="col-span-1 md:col-span-3 space-y-4">
            <h3 className="font-semibold text-base uppercase tracking-wider text-slate-100">Explore</h3>
            <ul className="space-y-2.5">
              <li><Link to="/campsites" className="text-gray-400 hover:text-[var(--color-nature-sand)] text-sm transition-colors duration-200">All Campsites</Link></li>
              <li><Link to="/campsites?search=tent" className="text-gray-400 hover:text-[var(--color-nature-sand)] text-sm transition-colors duration-200">Tent Campsites</Link></li>
              <li><Link to="/campsites?search=cabin" className="text-gray-400 hover:text-[var(--color-nature-sand)] text-sm transition-colors duration-200">Cabin & Glamping</Link></li>
              <li><Link to="/campsites?search=rv" className="text-gray-400 hover:text-[var(--color-nature-sand)] text-sm transition-colors duration-200">RV Parks</Link></li>
            </ul>
          </div>
          
          {/* Portal Area */}
          <div className="col-span-1 md:col-span-4 space-y-4">
            <h3 className="font-semibold text-base uppercase tracking-wider text-slate-100">My Account</h3>
            <div className="grid grid-cols-1 gap-2.5">
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest">For Campers</h4>
                <ul className="mt-1 space-y-2">
                  <li><Link to="/customer-dashboard" className="text-gray-400 hover:text-[var(--color-nature-green)] text-sm transition-colors duration-200">Camper Dashboard</Link></li>
                  <li><Link to="/login" className="text-gray-400 hover:text-[var(--color-nature-green)] text-sm transition-colors duration-200">Sign In</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-2">For Owners</h4>
                <ul className="mt-1 space-y-2">
                  <li><Link to="/dashboard" className="text-gray-400 hover:text-[var(--color-nature-green)] text-sm transition-colors duration-200">Owner Dashboard</Link></li>
                  <li><Link to="/add-campsite" className="text-gray-400 hover:text-[var(--color-nature-green)] text-sm transition-colors duration-200">List a Campsite</Link></li>
                  <li><Link to="/admin" className="text-gray-400 hover:text-[var(--color-nature-green)] text-sm transition-colors duration-200">Admin Portal</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs">
          <p className="text-slate-500">
            &copy; {new Date().getFullYear()} CampNest. All rights reserved. Designed for nature enthusiasts.
          </p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <a href="#" className="text-slate-500 hover:text-[var(--color-nature-sand)] transition-colors duration-200">Terms of Service</a>
            <a href="#" className="text-slate-500 hover:text-[var(--color-nature-sand)] transition-colors duration-200">Privacy Policy</a>
            <a href="mailto:info@campnest.com" className="text-slate-500 hover:text-[var(--color-nature-sand)] transition-colors duration-200">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
