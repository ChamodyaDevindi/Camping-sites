import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CampsiteService from '../services/campsite.service';

export default function Campsites() {
  const [campsites, setCampsites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    CampsiteService.getAllCampsites()
      .then(response => {
        if (Array.isArray(response.data)) {
          setCampsites(response.data);
        } else {
          setCampsites([]);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching campsites", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Explore Campsites</h1>
      
      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading amazing places...</div>
      ) : campsites.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-xl text-gray-600 mb-4">No campsites found.</p>
          <p className="text-gray-400">Be the first to list a beautiful destination!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {campsites.map((camp) => (
            <div key={camp.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 group flex flex-col">
              <div className="h-64 overflow-hidden relative bg-gray-200">
                {camp.booked && (
                  <div className="absolute top-4 left-4 z-10 bg-red-600/90 text-white backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold shadow-sm uppercase tracking-wider">
                    Reserved
                  </div>
                )}
                {camp.photos && camp.photos.length > 0 ? (
                  <img src={camp.photos[0]} alt={camp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 bg-[var(--color-nature-sand)] opacity-20">
                    No Image
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-[var(--color-nature-green)] shadow-sm">
                  ${camp.pricePerNight}/night
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{camp.name}</h3>
                <p className="text-gray-500 text-sm mb-6">{camp.district}, {camp.province}</p>
                
                <div className="mt-auto">
                  <Link to={`/campsites/${camp.id}`} className="w-full inline-block text-center bg-[var(--color-nature-green)] hover:bg-[var(--color-nature-light-green)] text-white font-medium py-2 rounded-lg transition-colors shadow-sm">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
