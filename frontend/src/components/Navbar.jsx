import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <svg className="h-8 w-8 text-[var(--color-nature-green)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-bold text-xl text-[var(--color-nature-green)] tracking-wider">CampNest</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/campsites" className="text-gray-700 hover:text-[var(--color-nature-green)] font-medium transition-colors duration-200">
              Explore Campsites
            </Link>
            
            {user ? (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-200">
                <span className="text-sm font-medium text-gray-600">Hi, {user.firstName || user.email}</span>
                {user?.role === 'ROLE_CUSTOMER' && (
                  <Link to="/customer-dashboard" className="text-sm font-medium text-[var(--color-nature-green)] hover:text-[var(--color-nature-light-green)] transition-colors">
                    Dashboard
                  </Link>
                )}
                {user?.role === 'ROLE_OWNER' && (
                  <Link to="/dashboard" className="text-sm font-medium text-[var(--color-nature-brown)] hover:text-[var(--color-nature-light-brown)] transition-colors">
                    Owner Dashboard
                  </Link>
                )}
                {user?.role === 'ROLE_ADMIN' && (
                  <Link to="/admin" className="text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors">
                    Admin Dashboard
                  </Link>
                )}
                <button 
                  onClick={handleLogout}
                  className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
                <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-[var(--color-nature-green)] transition-colors">
                  Sign In
                </Link>
                <Link to="/register" className="bg-[var(--color-nature-green)] hover:bg-[var(--color-nature-light-green)] text-white px-5 py-2 rounded-full text-sm font-medium shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
