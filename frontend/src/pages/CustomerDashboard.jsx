import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FavoriteService from '../services/favorite.service';
import ReviewService from '../services/review.service';
import AuthService from '../services/auth.service';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('favorites'); // favorites, reviews, profile
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [favCampsites, setFavCampsites] = useState([]);
  const [loadingFavs, setLoadingFavs] = useState(false);
  
  const [userReviews, setUserReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const fetchFavorites = () => {
    setLoadingFavs(true);
    FavoriteService.getUserFavorites()
      .then(res => {
        setFavCampsites(res.data || []);
        setLoadingFavs(false);
      })
      .catch(err => {
        console.error("Error fetching database favorites", err);
        setLoadingFavs(false);
      });
  };

  const fetchUserReviews = () => {
    setLoadingReviews(true);
    ReviewService.getUserReviews()
      .then(res => {
        setUserReviews(res.data || []);
        setLoadingReviews(false);
      })
      .catch(err => {
        console.error("Error loading user reviews", err);
        setLoadingReviews(false);
      });
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Load Profile Info
    setLoadingProfile(true);
    AuthService.getUserProfile()
      .then(res => {
        setProfileData(res.data);
        setLoadingProfile(false);
      })
      .catch(err => {
        console.error("Error loading user profile details", err);
        setLoadingProfile(false);
      });

    fetchFavorites();
    fetchUserReviews();
  }, [user, navigate]);

  const removeFavorite = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    FavoriteService.toggleFavorite(id)
      .then(() => {
        fetchFavorites();
      })
      .catch(err => console.error("Error toggling favorite from dashboard", err));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      
      {/* Page Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Customer Dashboard</h1>
        <p className="text-gray-500 mt-1 font-medium">Manage your saved camping spots, view past reviews, and update profile settings.</p>
      </div>

      {/* Tabs Menu */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex gap-8" aria-label="Tabs">
          <button 
            onClick={() => setActiveTab('favorites')}
            className={`pb-4 px-1 border-b-2 font-bold text-sm transition-all ${
              activeTab === 'favorites' 
                ? 'border-[var(--color-nature-green)] text-[var(--color-nature-green)]' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Favorite Campsites ({favCampsites.length})
          </button>
          
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 px-1 border-b-2 font-bold text-sm transition-all ${
              activeTab === 'reviews' 
                ? 'border-[var(--color-nature-green)] text-[var(--color-nature-green)]' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Reviews ({userReviews.length})
          </button>
          
          <button 
            onClick={() => setActiveTab('profile')}
            className={`pb-4 px-1 border-b-2 font-bold text-sm transition-all ${
              activeTab === 'profile' 
                ? 'border-[var(--color-nature-green)] text-[var(--color-nature-green)]' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Profile Details
          </button>
        </nav>
      </div>

      {/* Tab Contents */}
      <div>
        
        {/* Tab 1: Favorite Campsites */}
        {activeTab === 'favorites' && (
          <div>
            {loadingFavs ? (
              <div className="text-center py-10 text-gray-500 font-medium">Loading favorites...</div>
            ) : favCampsites.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                <h3 className="text-lg font-bold text-gray-800">No Saved Campsites</h3>
                <p className="text-gray-500 text-sm mt-1 mb-6">Browse and save your favorite campsites to plan your next camping adventure!</p>
                <Link to="/campsites" className="inline-block bg-[var(--color-nature-green)] hover:bg-[var(--color-nature-light-green)] text-white font-bold px-6 py-3 rounded-xl transition-all shadow-md">
                  Explore Campsites
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {favCampsites.map(camp => (
                  <div key={camp.id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden group hover:shadow-lg transition-all relative">
                    <button 
                      onClick={(e) => removeFavorite(camp.id, e)}
                      className="absolute top-3 right-3 bg-white/80 hover:bg-white text-red-500 rounded-full p-2 transition-all shadow-sm z-10"
                      title="Remove from favorites"
                    >
                      <svg className="w-5 h-5 fill-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                    
                    <Link to={`/campsites/${camp.id}`} className="block h-48 overflow-hidden relative">
                      {camp.photos && camp.photos[0] ? (
                        <img src={camp.photos[0]} alt={camp.name} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">No Image</div>
                      )}
                    </Link>
                    
                    <div className="p-6">
                      <h4 className="text-lg font-bold text-gray-800 hover:text-[var(--color-nature-green)] truncate">
                        <Link to={`/campsites/${camp.id}`}>{camp.name}</Link>
                      </h4>
                      <p className="text-sm text-gray-500 font-medium mt-1">{camp.location}</p>
                      
                      <div className="flex justify-between items-center mt-6">
                        <span className="text-sm text-gray-400 font-bold uppercase tracking-wider">Price</span>
                        <span className="text-lg font-extrabold text-[var(--color-nature-green)]">LKR {camp.pricePerNight} <span className="text-xs font-semibold text-gray-400">/ p.n.</span></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: My Reviews */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {loadingReviews ? (
              <div className="text-center py-10 text-gray-500 font-medium">Loading reviews...</div>
            ) : userReviews.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-2xl border p-8 text-gray-400 font-medium">
                You haven't written any reviews yet. Go to a campsite page to share your experience!
              </div>
            ) : (
              userReviews.map((rev) => (
                <div key={rev.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-gray-800 text-lg hover:underline hover:text-[var(--color-nature-green)]">
                        <Link to={`/campsites/${rev.campsite?.id}`}>{rev.campsite?.name || 'Campsite'}</Link>
                      </h4>
                      <span className="text-xs text-gray-400">{new Date(rev.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex text-yellow-400 text-sm">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <span key={idx}>{idx < rev.rating ? '★' : '☆'}</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm italic">"{rev.comment}"</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Profile Details */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-2xl">
            {loadingProfile ? (
              <div className="text-gray-500 font-medium text-center">Loading profile details...</div>
            ) : profileData ? (
              <div className="space-y-6">
                
                {/* User Avatar Circle */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[var(--color-nature-green)] text-white text-2xl font-bold flex items-center justify-center uppercase shadow">
                    {profileData.firstName?.charAt(0)}{profileData.lastName?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{profileData.firstName} {profileData.lastName}</h3>
                    <span className="text-xs font-bold text-[var(--color-nature-brown)] bg-amber-50 px-2 py-0.5 rounded border border-amber-100 uppercase tracking-wider">
                      {profileData.role?.replace('ROLE_', '')} Account
                    </span>
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Profile Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <span className="text-xs text-gray-400 font-bold block uppercase tracking-wide">First Name</span>
                    <span className="text-sm font-semibold text-gray-800 mt-1 block">{profileData.firstName}</span>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <span className="text-xs text-gray-400 font-bold block uppercase tracking-wide">Last Name</span>
                    <span className="text-sm font-semibold text-gray-800 mt-1 block">{profileData.lastName}</span>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <span className="text-xs text-gray-400 font-bold block uppercase tracking-wide">Email Address</span>
                    <span className="text-sm font-semibold text-gray-800 mt-1 block">{profileData.email}</span>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <span className="text-xs text-gray-400 font-bold block uppercase tracking-wide">Phone Number</span>
                    <span className="text-sm font-semibold text-gray-800 mt-1 block">{profileData.phoneNumber || 'N/A'}</span>
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-gray-500 text-center font-medium">Failed to retrieve profile data.</div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
