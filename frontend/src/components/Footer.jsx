import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="relative bg-trail-bg text-trail-moss font-trail-sans pt-16 pb-8 border-t border-emerald-950/40 overflow-hidden">
      
      {/* Top Border Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-trail-moss/20 via-trail-ember to-trail-moss/20"></div>

      {/* Topographic Contour Lines Background */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none overflow-hidden mix-blend-overlay">
        <svg className="w-full h-full text-trail-moss" xmlns="http://www.w3.org/2000/svg">
          {/* Contour Group 1 */}
          <path d="M-100,150 C100,50 300,250 500,100 C700,-50 900,150 1100,80 C1300,10 1500,180 1700,100" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M-100,180 C110,80 290,270 510,120 C690,-20 910,170 1090,100 C1310,30 1490,200 1700,130" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M-100,210 C120,110 280,290 520,140 C680,10 920,190 1080,120 C1320,50 1480,220 1700,160" fill="none" stroke="currentColor" strokeWidth="1.5" />
          
          {/* Contour Group 2 */}
          <path d="M100,450 C300,350 500,550 700,400 C900,250 1100,450 1300,370 C1500,300 1700,480 1900,400" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M100,480 C310,380 490,570 710,420 C890,270 1110,470 1300,400 C1500,330 1690,500 1900,430" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M100,510 C320,410 480,590 720,440 C880,290 1120,490 1300,430 C1500,360 1680,520 1900,460" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-4 space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <svg className="h-8 w-8 text-trail-ember group-hover:text-trail-parchment transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-trail-serif font-bold text-3xl text-trail-parchment tracking-wide group-hover:text-trail-ember transition-colors duration-300">CampNest</span>
            </Link>
            <p className="text-trail-moss/80 text-sm leading-relaxed max-w-sm">
              Discover and book the most breathtaking campsites across the country. Host your own spots, share the wilderness, and make unforgettable memories under the stars.
            </p>
            
            {/* Social Icons with Micro-animations */}
            <div className="flex gap-4 pt-2">
              <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-emerald-950/40 hover:bg-trail-ember border border-emerald-900/30 flex items-center justify-center text-trail-moss hover:text-trail-bg transition-all duration-300 hover:scale-110">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8H7v3h2v9h4v-9h3.61L17 8h-3V6.21C14 5.37 14.5 5 15.22 5H17V1H14.46C11.5 1 10 2.5 10 5.5V8z"/></svg>
              </a>
              <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-emerald-950/40 hover:bg-trail-ember border border-emerald-900/30 flex items-center justify-center text-trail-moss hover:text-trail-bg transition-all duration-300 hover:scale-110">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01"/></svg>
              </a>
              <a href="#" aria-label="WhatsApp" className="w-10 h-10 rounded-full bg-emerald-950/40 hover:bg-emerald-600 border border-emerald-900/30 flex items-center justify-center text-trail-moss hover:text-white transition-all duration-300 hover:scale-110">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.005 5.322 5.4 0 12.028 0c3.208.001 6.223 1.249 8.49 3.52C22.787 5.79 24.032 8.8 24.03 12.008c-.004 6.685-5.399 12.007-12.03 12.007-2.002-.001-3.97-.502-5.713-1.458L0 24zM6.602 20.59a10.354 10.354 0 005.429 1.52c5.529 0 10.029-4.478 10.032-9.986.002-2.67-1.032-5.18-2.909-7.054C17.278 3.197 14.779 2.164 12.11 2.16c-5.526 0-10.024 4.479-10.027 9.986-.001 1.956.516 3.864 1.5 5.567l-.986 3.6 3.69-.96c1.614.88 3.424 1.34 5.315 1.341z"/></svg>
              </a>
            </div>
          </div>
          
          {/* Quick Links - Trailhead */}
          <div className="col-span-1 md:col-span-3 space-y-4">
            <div>
              <span className="font-trail-mono text-xs text-trail-ember tracking-widest block uppercase">[01 // EXPLORE]</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-trail-ember"></span>
                <h3 className="font-trail-serif text-xl font-bold text-trail-parchment tracking-wide">Trailhead</h3>
              </div>
            </div>
            <ul className="space-y-2.5">
              <li><Link to="/campsites" className="text-trail-moss hover:text-trail-parchment text-sm transition-colors duration-200 font-trail-sans">All Campsites</Link></li>
              <li><Link to="/campsites?search=tent" className="text-trail-moss hover:text-trail-parchment text-sm transition-colors duration-200 font-trail-sans">Tent Campsites</Link></li>
              <li><Link to="/campsites?search=cabin" className="text-trail-moss hover:text-trail-parchment text-sm transition-colors duration-200 font-trail-sans">Cabin & Glamping</Link></li>
              <li><Link to="/campsites?search=rv" className="text-trail-moss hover:text-trail-parchment text-sm transition-colors duration-200 font-trail-sans">RV Parks</Link></li>
            </ul>
          </div>
          
          {/* Portal Area - Basecamp */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div>
              <span className="font-trail-mono text-xs text-trail-ember tracking-widest block uppercase">[02 // CAMPERS]</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-trail-ember"></span>
                <h3 className="font-trail-serif text-xl font-bold text-trail-parchment tracking-wide">Basecamp</h3>
              </div>
            </div>
            <ul className="space-y-2.5">
              <li><Link to="/customer-dashboard" className="text-trail-moss hover:text-trail-parchment text-sm transition-colors duration-200 font-trail-sans">My Dashboard</Link></li>
              <li><Link to="/login" className="text-trail-moss hover:text-trail-parchment text-sm transition-colors duration-200 font-trail-sans">Sign In</Link></li>
              <li><Link to="/register" className="text-trail-moss hover:text-trail-parchment text-sm transition-colors duration-200 font-trail-sans">Create Account</Link></li>
            </ul>
          </div>

          {/* Portal Area - Ridgeline */}
          <div className="col-span-1 md:col-span-3 space-y-4">
            <div>
              <span className="font-trail-mono text-xs text-trail-ember tracking-widest block uppercase">[03 // HOSTS]</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-trail-ember"></span>
                <h3 className="font-trail-serif text-xl font-bold text-trail-parchment tracking-wide">Ridgeline</h3>
              </div>
            </div>
            <ul className="space-y-2.5">
              <li><Link to="/dashboard" className="text-trail-moss hover:text-trail-parchment text-sm transition-colors duration-200 font-trail-sans">Owner Dashboard</Link></li>
              <li><Link to="/add-campsite" className="text-trail-moss hover:text-trail-parchment text-sm transition-colors duration-200 font-trail-sans">List Your Camp</Link></li>
              <li><Link to="/admin" className="text-trail-moss hover:text-trail-parchment text-sm transition-colors duration-200 font-trail-sans">Admin Portal</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="border-t border-emerald-950/40 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs">
          <p className="text-trail-moss/60">
            &copy; {new Date().getFullYear()} CampNest. Built for the wild at heart.
          </p>
          

          <div className="flex gap-6">
            <a href="#" className="text-trail-moss/60 hover:text-trail-parchment transition-colors duration-200">Terms</a>
            <a href="#" className="text-slate-500 hover:text-[var(--color-nature-sand)] transition-colors duration-200">Privacy</a>
            <a href="mailto:info@campnest.com" className="text-trail-moss/60 hover:text-trail-parchment transition-colors duration-200">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
