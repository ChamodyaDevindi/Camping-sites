import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import CampsiteService from '../services/campsite.service';
import { useAuth } from '../context/AuthContext';

export default function CampsiteDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  
  const [camp, setCamp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  // Redirection Link formatter
  const formatUrl = (url) => {
    if (!url) return "#";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    return `https://${url}`;
  };

  const cleanNumber = (num) => {
    if (!num) return "";
    return num.replace(/[+\s-]/g, "");
  };

  useEffect(() => {
    CampsiteService.getCampsiteById(id)
      .then(res => {
        setCamp(res.data);
        if (res.data.photos && res.data.photos.length > 0) {
          setActivePhoto(res.data.photos[0]);
        }
        
        // Check favorites from local storage
        const favs = JSON.parse(localStorage.getItem('favCampsites') || '[]');
        setIsFavorite(favs.includes(res.data.id));
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching campsite details", err);
        setLoading(false);
      });
  }, [id]);

  const handleBookingClick = async () => {
    if (!camp) return;
    try {
      await CampsiteService.registerClick(camp.id);
    } catch (err) {
      console.error("Failed to register booking click statistics", err);
    }
  };

  const toggleFavorite = () => {
    if (!camp) return;
    const favs = JSON.parse(localStorage.getItem('favCampsites') || '[]');
    let newFavs;
    if (favs.includes(camp.id)) {
      newFavs = favs.filter(fid => fid !== camp.id);
      setIsFavorite(false);
    } else {
      newFavs = [...favs, camp.id];
      setIsFavorite(true);
    }
    localStorage.setItem('favCampsites', JSON.stringify(newFavs));
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Loading details...</div>;
  if (!camp) return <div className="text-center py-20 text-gray-500">Campsite not found.</div>;

  const phone = camp.contactNumber || camp.owner?.phoneNumber || "N/A";
  const whatsapp = camp.whatsappNumber || phone;
  const email = camp.email || camp.owner?.email || "N/A";
  const bookingUrl = camp.bookingUrl || "";

  // Mock Reviews
  const mockReviews = [
    { name: "Suresh Perera", rating: 5, date: "May 12, 2026", text: "Absolutely stunning place! The river view was breathtaking and the facilities were very clean. Highly recommended for weekend getaways!" },
    { name: "Niluni Silva", rating: 4, date: "June 03, 2026", text: "Great campsite with helpful guides. Hiking trails around the location are easy to moderate. WhatsApp communication with the owner was very fast." },
    { name: "David M.", rating: 5, date: "June 24, 2026", text: "One of the best camping spots in Sri Lanka. Smooth booking experience. Will definitely visit again next month!" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <Link to="/campsites" className="text-[var(--color-nature-green)] hover:underline mb-6 inline-block font-semibold">
        &larr; Back to all campsites
      </Link>
      
      {/* 1. Header Details (Camping Name & Rating stars & Favorite button) */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8 p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{camp.name}</h1>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex text-yellow-400 text-lg">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
              <span className="text-sm font-semibold text-gray-500">(4.8 / 5.0 from {mockReviews.length} reviews)</span>
            </div>
            <p className="text-gray-600 mt-2 flex items-center gap-2 font-medium">
              <svg className="w-5 h-5 text-[var(--color-nature-green)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              {camp.location}, {camp.district}, {camp.province} Province
            </p>
          </div>
          
          <button 
            onClick={toggleFavorite}
            className={`flex items-center gap-2 px-5 py-3 rounded-full border text-sm font-bold transition-all shadow-sm ${
              isFavorite 
                ? 'bg-red-50 border-red-200 text-red-600' 
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <svg className={`w-5 h-5 ${isFavorite ? 'fill-red-600' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {isFavorite ? 'Saved to Favorites' : 'Add to Favorites'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          
          {/* 2. Photos Section */}
          <section className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="h-[450px] overflow-hidden relative">
              {activePhoto ? (
                <img src={activePhoto} alt={camp.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-100">
                  <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  <span className="text-lg font-medium">No Image Provided</span>
                </div>
              )}
            </div>
            {camp.photos && camp.photos.length > 1 && (
              <div className="flex gap-4 p-4 overflow-x-auto bg-gray-50 border-t border-gray-100 scrollbar-thin">
                {camp.photos.map((photo, i) => (
                  <button 
                    key={i} 
                    type="button" 
                    onClick={() => setActivePhoto(photo)} 
                    className={`w-24 h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                      activePhoto === photo ? 'border-[var(--color-nature-green)] shadow' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={photo} alt={`Campsite view ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* 3. About / Overview */}
          <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-display">About the Campsite</h2>
            <div className="prose text-gray-600 leading-relaxed">
              <p className="whitespace-pre-line">{camp.description ? camp.description.replace(/Rating:.*|Phone:.*|Features:.*/gi, '') : ''}</p>
            </div>
          </section>

          {/* 4. Facilities & Activities */}
          <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Activities Available</h3>
                {camp.activities && camp.activities.length > 0 ? (
                  <ul className="space-y-3">
                    {camp.activities.map((activity, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-600 font-medium">
                        <svg className="w-5 h-5 text-[var(--color-nature-brown)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>{activity}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">Contact owner for activities.</p>
                )}
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Facilities & Camp Amenities</h3>
                {camp.facilitiesList && camp.facilitiesList.length > 0 ? (
                  <ul className="space-y-3">
                    {camp.facilitiesList.map((facility, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-600 font-medium">
                        <svg className="w-5 h-5 text-[var(--color-nature-green)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        <span>{facility}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">Standard basic camping setup.</p>
                )}
              </div>
            </div>
          </section>

          {/* 5. Estimated Pricing Breakdown */}
          {camp.estimatedPrices && camp.estimatedPrices.length > 0 && (
            <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Estimated Price Breakdown</h2>
              <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody className="bg-white divide-y divide-gray-100">
                    {camp.estimatedPrices.map((ep, i) => {
                      const parts = ep.split(':');
                      const label = parts[0] || '';
                      const price = parts.slice(1).join(':') || '';
                      return (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">{label}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-[var(--color-nature-green)] text-right">{price}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* 6. Reviews & Ratings Section */}
          <section className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">User Reviews</h2>
            <div className="space-y-6">
              {mockReviews.map((review, i) => (
                <div key={i} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-gray-800">{review.name}</h4>
                      <span className="text-xs text-gray-400">{review.date}</span>
                    </div>
                    <div className="flex text-yellow-400 text-sm">
                      {Array.from({ length: review.rating }).map((_, idx) => (
                        <span key={idx}>★</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm italic">"{review.text}"</p>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* 7. Sidebar Details & Booking CTAs */}
        <div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-24 shadow-md space-y-6">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Estimated Base Price</span>
              <span className="text-3xl font-extrabold text-gray-900">LKR {camp.pricePerNight}</span>
              <span className="text-gray-500 font-semibold text-sm"> / person / night</span>
            </div>
            
            <hr className="border-gray-100" />
            
            <div className="space-y-4">
              <h4 className="font-bold text-gray-800 text-sm">Contact Information</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-semibold">Phone:</span>
                  <span className="text-gray-900 font-bold">{phone}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-semibold">WhatsApp:</span>
                  <span className="text-gray-900 font-bold">{whatsapp}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 font-semibold">Email:</span>
                  <span className="text-gray-900 font-bold">{email}</span>
                </div>
                {bookingUrl && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-semibold">Official Web:</span>
                    <a href={formatUrl(bookingUrl)} target="_blank" rel="noopener noreferrer" className="text-[var(--color-nature-green)] font-bold hover:underline truncate max-w-[150px]">
                      {bookingUrl.replace(/https?:\/\/(www\.)?/, '')}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <hr className="border-gray-100" />

            {camp.externalBooking && bookingUrl ? (
              <a 
                href={formatUrl(bookingUrl)} 
                target="_blank" 
                rel="noopener noreferrer" 
                onClick={handleBookingClick}
                className="w-full inline-block text-center bg-[var(--color-nature-green)] hover:bg-[var(--color-nature-light-green)] text-white font-bold py-4 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md cursor-pointer text-sm"
              >
                Book on Official Website
              </a>
            ) : (
              <div className="space-y-3">
                <a 
                  href={`tel:${cleanNumber(phone)}`}
                  className="w-full inline-block text-center bg-[var(--color-nature-brown)] hover:bg-[var(--color-nature-light-brown)] text-white font-bold py-3.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md text-sm"
                >
                  Call Owner
                </a>
                <a 
                  href={`https://wa.me/${cleanNumber(whatsapp)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-block text-center bg-[#25D366] hover:bg-[#20ba56] text-white font-bold py-3.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md text-sm"
                >
                  WhatsApp Owner
                </a>
              </div>
            )}
            
            <div className="bg-gray-50 p-4 rounded-xl text-center text-xs text-gray-500 font-medium">
              No booking fees or commissions. You deal directly with the campsite owner.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
