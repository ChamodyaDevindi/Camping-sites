import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CampsiteService from '../services/campsite.service';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [campsites, setCampsites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setLoading(true);
    if (user.role === 'ROLE_ADMIN') {
      CampsiteService.getAllCampsites()
        .then(res => {
          setCampsites(Array.isArray(res.data) ? res.data : []);
          setLoading(false);
        })
        .catch(() => {
          setCampsites([]);
          setLoading(false);
        });
    } else if (user.role === 'ROLE_OWNER') {
      CampsiteService.getMyCampsites()
        .then(res => {
          setCampsites(Array.isArray(res.data) ? res.data : []);
          setLoading(false);
        })
        .catch(() => {
          setCampsites([]);
          setLoading(false);
        });
    }
  }, [user, navigate]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this campsite?')) {
      CampsiteService.deleteCampsite(id).then(() => {
        setCampsites(campsites.filter(c => c.id !== id));
      });
    }
  };

  // Compute Aggregated Statistics
  const totalCampsites = campsites.length;
  const totalViews = campsites.reduce((sum, c) => sum + (c.totalViews || 0), 0);
  const totalClicks = campsites.reduce((sum, c) => sum + (c.bookingClicks || 0), 0);
  
  // Dynamic average rating and reviews count from actual DB fields
  const totalReviews = campsites.reduce((sum, c) => sum + (c.reviewCount || 0), 0);
  const ratedCampsites = campsites.filter(c => c.reviewCount > 0);
  const averageRating = ratedCampsites.length > 0
    ? ratedCampsites.reduce((sum, c) => sum + (c.averageRating || 0), 0) / ratedCampsites.length
    : 0;

  // Click-Through Rate (CTR)
  const ctr = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0;

  if (loading) return <div className="text-center py-20 text-gray-500">Loading dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      
      {/* Dashboard Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Owner Dashboard</h1>
          <p className="text-gray-500 mt-1 font-medium">Manage your campsite listings and analyze user engagement stats.</p>
        </div>
        {(user?.role === 'ROLE_OWNER' || user?.role === 'ROLE_ADMIN') && (
          <Link 
            to="/add-campsite" 
            className="bg-[var(--color-nature-brown)] hover:bg-[var(--color-nature-light-brown)] text-white px-6 py-3.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            + Add New Campsite
          </Link>
        )}
      </div>

      {/* Statistics Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-10">
        
        {/* Stat 1: Total Campsites */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Campsites</span>
          <span className="text-3xl font-extrabold text-gray-900 mt-2">{totalCampsites}</span>
          <span className="text-xs text-gray-500 font-semibold mt-1">Listed properties</span>
        </div>

        {/* Stat 2: Total Views */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Views</span>
          <span className="text-3xl font-extrabold text-gray-900 mt-2">{totalViews}</span>
          <span className="text-xs text-blue-500 font-semibold mt-1">👁️ Visual traffic</span>
        </div>

        {/* Stat 3: Website Clicks */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Booking Clicks</span>
          <span className="text-3xl font-extrabold text-gray-900 mt-2">{totalClicks}</span>
          <span className="text-xs text-green-600 font-semibold mt-1">🖱️ Web redirect clicks</span>
        </div>

        {/* Stat 4: Click-Through Rate (CTR) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">CTR %</span>
          <span className="text-3xl font-extrabold text-gray-900 mt-2">{ctr.toFixed(1)}%</span>
          <span className="text-xs text-indigo-500 font-semibold mt-1">📈 Click-through rate</span>
        </div>

        {/* Stat 5: Rating & Reviews */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Avg Rating</span>
          <span className="text-3xl font-extrabold text-gray-900 mt-2">
            {averageRating > 0 ? averageRating.toFixed(1) : '0.0'} <span className="text-xl text-yellow-400">★</span>
          </span>
          <span className="text-xs text-gray-500 font-semibold mt-1">From {totalReviews} reviews</span>
        </div>

      </div>

      {/* Properties List Block */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="font-bold text-gray-800 tracking-tight text-lg">Your Listed Properties</h2>
        </div>
        
        {campsites.length === 0 ? (
          <div className="p-12 text-center text-gray-400 font-medium">
            You haven't listed any campsites yet. Click "+ Add New Campsite" to begin promoting.
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {campsites.map(camp => {
              const campCtr = (camp.totalViews || 0) > 0 ? ((camp.bookingClicks || 0) / camp.totalViews) * 100 : 0;
              return (
                <li key={camp.id} className="p-6 hover:bg-gray-50/40 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-[var(--color-nature-green)] hover:underline">
                          <Link to={`/campsites/${camp.id}`}>{camp.name}</Link>
                        </h3>
                        {camp.averageRating > 0 && (
                          <span className="bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded border border-yellow-100 text-xs font-bold flex items-center gap-0.5">
                            ★ {camp.averageRating.toFixed(1)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 font-medium">{camp.location} • {camp.district}</p>
                      
                      <div className="flex flex-wrap gap-3 mt-2 text-xs font-semibold">
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full border border-gray-200">
                          LKR {camp.pricePerNight} / person / night
                        </span>
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200">
                          👁️ {camp.totalViews || 0} Views
                        </span>
                        <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200">
                          🖱️ {camp.bookingClicks || 0} Clicks
                        </span>
                        <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-200">
                          📈 CTR: {campCtr.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <button 
                        onClick={() => navigate(`/edit-campsite/${camp.id}`)} 
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold transition-all"
                      >
                        Edit Listing
                      </button>
                      <button 
                        onClick={() => handleDelete(camp.id)} 
                        className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-bold transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
