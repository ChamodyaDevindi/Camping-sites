import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import CampsiteService from '../services/campsite.service';
import ReservationService from '../services/reservation.service';
import { useAuth } from '../context/AuthContext';

export default function CampsiteDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [camp, setCamp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState('');

  // Booking Form State
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [numberOfTents, setNumberOfTents] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    CampsiteService.getCampsiteById(id)
      .then(res => {
        setCamp(res.data);
        if (res.data.photos && res.data.photos.length > 0) {
          setActivePhoto(res.data.photos[0]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching campsite details", err);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (camp && checkInDate && checkOutDate) {
      const start = new Date(checkInDate);
      const end = new Date(checkOutDate);
      const timeDiff = end.getTime() - start.getTime();
      const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
      if (nights > 0) {
        setTotalPrice(nights * camp.pricePerNight);
        setBookingError('');
      } else {
        setTotalPrice(0);
        setBookingError('Check-out date must be after Check-in date.');
      }
    }
  }, [checkInDate, checkOutDate, camp]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (totalPrice <= 0) return;
    
    setIsSubmitting(true);
    setBookingError('');
    
    try {
      await ReservationService.createReservation({
        campsiteId: camp.id,
        checkInDate,
        checkOutDate,
        numberOfPeople: parseInt(numberOfPeople),
        numberOfTents: parseInt(numberOfTents)
      });
      setBookingSuccess(true);
      setTimeout(() => {
        navigate('/my-bookings');
      }, 2000);
    } catch (err) {
      console.error("Booking API Error:", err);
      setBookingError(err.response?.data?.message || 'Failed to create booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading details...</div>;
  if (!camp) return <div className="text-center py-20">Campsite not found.</div>;

  const phoneMatch = camp.description?.match(/Phone:\s*([\d\s]+)/);
  const phone = phoneMatch ? phoneMatch[1].trim() : "N/A";
  
  const featuresMatch = camp.description?.match(/Features:\s*(.+)/i);
  const features = featuresMatch ? featuresMatch[1].trim() : "Basic camping facilities";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <Link to="/campsites" className="text-[var(--color-nature-green)] hover:underline mb-6 inline-block">
        &larr; Back to all campsites
      </Link>
      
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="h-96 overflow-hidden relative">
          {activePhoto ? (
            <img src={activePhoto} alt={camp.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-100">
              <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              <span className="text-lg font-medium">No Image Provided</span>
            </div>
          )}
          <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-md p-4 rounded-xl">
             <h1 className="text-3xl font-bold text-white">{camp.name}</h1>
             <p className="text-gray-200 mt-1 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {camp.location}, {camp.district}
             </p>
          </div>
        </div>

        {/* Gallery Thumbnails */}
        {camp.photos && camp.photos.length > 1 && (
          <div className="flex gap-4 p-4 overflow-x-auto bg-gray-50 border-b border-gray-100 scrollbar-thin">
            {camp.photos.map((photo, i) => (
              <button key={i} type="button" onClick={() => setActivePhoto(photo)} className={`w-28 h-18 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 hover:scale-102 hover:shadow-sm ${activePhoto === photo ? 'border-[var(--color-nature-green)] shadow-md scale-102 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                <img src={photo} alt={`Campsite view ${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
        
        <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            {(() => {
              const campTypes = camp.campTypes && camp.campTypes.length > 0 ? camp.campTypes : [camp.campType];
              const overview = camp.description ? camp.description.replace(/Rating:.*|Phone:.*|Features:.*/gi, '') : '';
              
              const fallbackFeatures = features ? features.split(',').map(s => s.trim()) : ["Basic camping facilities"];
              const facilitiesList = camp.facilitiesList && camp.facilitiesList.length > 0 ? camp.facilitiesList : fallbackFeatures;

              return (
                <>
                  {/* 1. Overview */}
                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
                    <div className="prose text-gray-600">
                      <p>{overview}</p>
                    </div>
                  </section>

                  {/* 2. Camp Types */}
                  {campTypes && campTypes.length > 0 && (
                    <section>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Camp Type</h2>
                      <div className="flex flex-wrap gap-2">
                        {campTypes.map((type, i) => (
                          <span key={i} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            {type}
                          </span>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* 3. Estimated Prices */}
                  {camp.estimatedPrices && camp.estimatedPrices.length > 0 && (
                    <section>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Estimated Price</h2>
                      <ul className="space-y-2 text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100">
                        {camp.estimatedPrices.map((ep, i) => {
                          const parts = ep.split(':');
                          const label = parts[0] || '';
                          const price = parts.slice(1).join(':') || '';
                          return (
                            <li key={i} className={`flex justify-between ${i < camp.estimatedPrices.length - 1 ? 'border-b border-gray-200 pb-2' : ''}`}>
                              <span className="font-medium">{label}</span>
                              <span>{price}</span>
                            </li>
                          );
                        })}
                      </ul>
                    </section>
                  )}

                  {/* 4. Activities & Facilities (Side-by-Side) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {camp.activities && camp.activities.length > 0 && (
                      <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Activities</h2>
                        <ul className="space-y-3">
                          {camp.activities.map((activity, i) => (
                            <li key={i} className="flex items-center gap-2 text-gray-600">
                              <svg className="w-5 h-5 text-[var(--color-nature-brown)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              <span>{activity}</span>
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}
                    
                    {facilitiesList && facilitiesList.length > 0 && (
                      <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Facilities & Attractions</h2>
                        <ul className="space-y-3">
                          {facilitiesList.map((facility, i) => (
                            <li key={i} className="flex items-center gap-2 text-gray-600">
                              <svg className="w-5 h-5 text-[var(--color-nature-green)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                              <span>{facility}</span>
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}
                  </div>

                  {/* 5. Hiking Details */}
                  {camp.hikingStartingPoint && (
                    <section>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Hiking Details</h2>
                      <ul className="space-y-2 text-gray-600 bg-orange-50 p-4 rounded-xl border border-orange-100">
                        <li className="flex justify-between border-b border-orange-200 pb-2">
                          <span className="font-medium text-orange-900">Starting Point</span>
                          <span className="text-orange-800">{camp.hikingStartingPoint}</span>
                        </li>
                        <li className="flex justify-between border-b border-orange-200 pb-2">
                          <span className="font-medium text-orange-900">Walking Distance</span>
                          <span className="text-orange-800">{camp.hikingDistance}</span>
                        </li>
                        <li className="flex justify-between border-b border-orange-200 pb-2">
                          <span className="font-medium text-orange-900">Hiking Time</span>
                          <span className="text-orange-800">{camp.hikingTime}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="font-medium text-orange-900">Difficulty</span>
                          <span className="text-orange-800">{camp.hikingDifficulty}</span>
                        </li>
                      </ul>
                    </section>
                  )}

                  {/* 6. Attractions */}
                  {camp.attractions && camp.attractions.length > 0 && (
                    <section>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Attractions</h2>
                      <div className="flex flex-wrap gap-2">
                        {camp.attractions.map((attraction, i) => (
                          <span key={i} className="bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1 rounded-lg text-sm font-medium">
                            {attraction}
                          </span>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* 7. Limited Facilities & Best Time (Side-by-Side) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {camp.limitedFacilities && camp.limitedFacilities.length > 0 && (
                      <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Limited Facilities</h2>
                        <ul className="space-y-3">
                          {camp.limitedFacilities.map((lf, i) => (
                            <li key={i} className="flex items-center gap-2 text-red-600">
                              <span>❌</span>
                              <span>{lf}</span>
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}

                    {camp.bestTimes && camp.bestTimes.length > 0 && (
                      <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Best Time to Visit</h2>
                        <ul className="space-y-3">
                          {camp.bestTimes.map((bt, i) => (
                            <li key={i} className="flex items-center gap-2 text-gray-600">
                              <span className="text-xl">☀️</span>
                              <span>{bt}</span>
                            </li>
                          ))}
                        </ul>
                      </section>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
          
          <div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 sticky top-24 shadow-sm">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                LKR {camp.pricePerNight} <span className="text-base font-normal text-gray-500">/ night</span>
              </div>
              
              <div className="mb-6"></div>
              
              <div className="space-y-4 pt-4 border-t border-gray-200 mb-6">
                 <div className="flex justify-between items-center">
                   <span className="text-gray-600 font-medium">Contact Number:</span>
                   <span className="text-gray-900">{phone}</span>
                 </div>
              </div>

              <form onSubmit={handleBooking} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                    <input type="date" required value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="w-full border-gray-300 rounded-lg p-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                    <input type="date" required value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} min={checkInDate || new Date().toISOString().split('T')[0]} className="w-full border-gray-300 rounded-lg p-2 text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Number of People</label>
                    <input type="number" min="1" required value={numberOfPeople} onChange={(e) => setNumberOfPeople(e.target.value)} className="w-full border-gray-300 rounded-lg p-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Number of Tents</label>
                    <input type="number" min="1" required value={numberOfTents} onChange={(e) => setNumberOfTents(e.target.value)} className="w-full border-gray-300 rounded-lg p-2 text-sm" />
                  </div>
                </div>

                {totalPrice > 0 && (
                  <div className="bg-green-50 p-4 rounded-lg flex justify-between items-center border border-green-100">
                    <span className="font-semibold text-green-800">Total Price:</span>
                    <span className="font-bold text-xl text-green-800">LKR {totalPrice}</span>
                  </div>
                )}

                {bookingError && <div className="text-red-500 text-sm">{bookingError}</div>}
                
                {bookingSuccess ? (
                  <div className="bg-green-100 text-green-700 p-4 rounded-lg text-center font-bold">
                    Reservation Successful! Redirecting...
                  </div>
                ) : (
                  <button type="submit" disabled={isSubmitting || totalPrice <= 0} className="w-full mt-4 bg-[var(--color-nature-brown)] hover:bg-[var(--color-nature-light-brown)] disabled:opacity-50 text-white font-bold py-4 rounded-lg transition-colors shadow-md">
                    {isSubmitting ? 'Processing...' : (user ? 'Reserve Now' : 'Log in to Reserve')}
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
