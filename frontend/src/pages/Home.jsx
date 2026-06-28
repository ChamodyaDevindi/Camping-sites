import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CampsiteService from '../services/campsite.service';

export default function Home() {
  const navigate = useNavigate();
  const [featuredCampsites, setFeaturedCampsites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    CampsiteService.getAllCampsites().then(res => {
      if (Array.isArray(res.data)) {
        const sorted = [...res.data].sort((a, b) => {
          if ((b.averageRating || 0) !== (a.averageRating || 0)) {
            return (b.averageRating || 0) - (a.averageRating || 0);
          }
          return (b.reviewCount || 0) - (a.reviewCount || 0);
        });
        setFeaturedCampsites(sorted.slice(0, 3));
      } else {
        setFeaturedCampsites([]);
      }
    }).catch(err => {
      console.error(err);
      setFeaturedCampsites([]);
    });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== '') {
      navigate(`/campsites?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/campsites');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gray-900 h-[600px] flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          {/* We will replace this with a real image later via Cloudinary */}
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-nature-green)] to-[var(--color-nature-brown)] opacity-40 mix-blend-multiply"></div>
          <img 
            src="https://images.unsplash.com/photo-1504280390467-339e151522f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="Camping in nature" 
            className="w-full h-full object-cover opacity-60"
          />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-16">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6 drop-shadow-lg">
            Find Yourself Outside.
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 mb-10 font-light drop-shadow-md">
            Discover and book the most breathtaking campsites and adventures across the country.
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="bg-white p-2 rounded-full shadow-2xl flex flex-col md:flex-row gap-2 max-w-3xl mx-auto">
            <input 
              type="text" 
              placeholder="Where do you want to go?" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-6 py-4 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-[var(--color-nature-green)]"
            />
            <button type="submit" className="bg-[var(--color-nature-green)] hover:bg-[var(--color-nature-light-green)] text-white px-8 py-4 rounded-full font-bold transition-all hover:shadow-lg flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Featured Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Destinations</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">Explore our most highly-rated camping spots handpicked for your next adventure.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCampsites.map((camp) => (
            <div key={camp.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 group flex flex-col">
              <div className="h-64 overflow-hidden relative bg-gray-100">
                {camp.booked && (
                  <div className="absolute top-4 left-4 z-10 bg-red-600/90 text-white backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold shadow-sm uppercase tracking-wider">
                    Reserved
                  </div>
                )}
                {camp.photos && camp.photos.length > 0 ? (
                  <img src={camp.photos[0]} alt={camp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <svg className="w-12 h-12 mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <span className="text-sm font-medium">No Image Provided</span>
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-[var(--color-nature-green)] shadow-sm">
                  LKR {camp.pricePerNight}/person/night
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{camp.name}</h3>
                {camp.averageRating > 0 && (
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-yellow-400 text-sm">★</span>
                    <span className="text-xs font-bold text-gray-700">{camp.averageRating.toFixed(1)}</span>
                    <span className="text-xs text-gray-400 font-semibold">({camp.reviewCount} reviews)</span>
                  </div>
                )}
                <p className="text-gray-500 text-sm mb-6">{camp.location}</p>
                <div className="mt-auto">
                  <Link to={`/campsites/${camp.id}`} className="w-full inline-block text-center bg-[var(--color-nature-green)] hover:bg-[var(--color-nature-light-green)] text-white font-medium py-2 rounded-lg transition-colors shadow-sm">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
