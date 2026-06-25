import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <span className="font-bold text-2xl text-[var(--color-nature-sand)] tracking-wider mb-4 block">CampNest</span>
            <p className="text-gray-400 text-sm leading-relaxed">
              Discover the perfect camping spot, book your adventure, and reconnect with nature.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4 text-gray-200">Explore</h3>
            <ul className="space-y-2">
              <li><Link to="/campsites" className="text-gray-400 hover:text-white text-sm transition-colors">All Campsites</Link></li>
              <li><Link to="/activities" className="text-gray-400 hover:text-white text-sm transition-colors">Adventures</Link></li>
              <li><Link to="/rentals" className="text-gray-400 hover:text-white text-sm transition-colors">Equipment Rental</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4 text-gray-200">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Safety Rules</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Contact Us</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4 text-gray-200">For Owners</h3>
            <ul className="space-y-2">
              <li><Link to="/register" className="text-gray-400 hover:text-white text-sm transition-colors">List Your Camp</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Owner Dashboard</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} CampNest. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-[var(--color-nature-sand)] transition-colors">Terms</a>
            <a href="#" className="text-gray-500 hover:text-[var(--color-nature-sand)] transition-colors">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
