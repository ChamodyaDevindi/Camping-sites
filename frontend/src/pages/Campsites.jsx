import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CampsiteService from '../services/campsite.service';

export default function Campsites() {
  const [campsites, setCampsites] = useState([]);
  const [filteredCampsites, setFilteredCampsites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minRating, setMinRating] = useState('ALL');
  const [amenities, setAmenities] = useState({
    wifi: false,
    petFriendly: false,
    parking: false,
    river: false,
    forest: false,
    mountain: false
  });

  // Comparison States
  const [compareList, setCompareList] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Recently Viewed States
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    CampsiteService.getAllCampsites()
      .then(response => {
        const list = Array.isArray(response.data) ? response.data : [];
        setCampsites(list);
        setFilteredCampsites(list);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching campsites", error);
        setLoading(false);
      });

    // Load recently viewed from local storage
    const recentIds = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    if (recentIds.length > 0) {
      CampsiteService.getAllCampsites().then(res => {
        const list = Array.isArray(res.data) ? res.data : [];
        const filtered = list.filter(c => recentIds.includes(c.id));
        setRecentlyViewed(filtered);
      });
    }
  }, []);

  // Filter Logic
  useEffect(() => {
    let result = [...campsites];

    // 1. Text Search (Name, location, description)
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(c => 
        c.name?.toLowerCase().includes(term) ||
        c.location?.toLowerCase().includes(term) ||
        c.district?.toLowerCase().includes(term) ||
        c.description?.toLowerCase().includes(term)
      );
    }

    // 2. District filter
    if (selectedDistrict !== '') {
      result = result.filter(c => c.district?.toLowerCase() === selectedDistrict.toLowerCase());
    }

    // 3. Camp Type filter
    if (selectedType !== 'ALL') {
      result = result.filter(c => c.campType === selectedType);
    }

    // 4. Price filters
    if (minPrice !== '') {
      result = result.filter(c => c.pricePerNight >= parseFloat(minPrice));
    }
    if (maxPrice !== '') {
      result = result.filter(c => c.pricePerNight <= parseFloat(maxPrice));
    }

    // 5. Rating filter
    if (minRating !== 'ALL') {
      result = result.filter(c => (c.averageRating || 0) >= parseFloat(minRating));
    }

    // 6. Amenities checkmarks
    Object.keys(amenities).forEach(key => {
      if (amenities[key]) {
        // Map key to matches inside facilities list or description text
        const term = key === 'petFriendly' ? 'pet' : key;
        result = result.filter(c => {
          const listText = c.facilitiesList?.join(' ').toLowerCase() || '';
          const descText = c.description?.toLowerCase() || '';
          const nameText = c.name?.toLowerCase() || '';
          return listText.includes(term) || descText.includes(term) || nameText.includes(term);
        });
      }
    });

    setFilteredCampsites(result);
  }, [searchTerm, selectedDistrict, selectedType, minPrice, maxPrice, minRating, amenities, campsites]);

  // Handle Toggle Compare
  const handleToggleCompare = (campId) => {
    if (compareList.includes(campId)) {
      setCompareList(compareList.filter(id => id !== campId));
    } else {
      if (compareList.length >= 3) {
        alert("You can compare up to 3 campsites at a time.");
        return;
      }
      setCompareList([...compareList, campId]);
    }
  };

  const selectedForCompare = campsites.filter(c => compareList.includes(c.id));

  // Districts list for dropdown helper
  const uniqueDistricts = [...new Set(campsites.map(c => c.district).filter(Boolean))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen relative">
      
      {/* Title */}
      <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-8">Explore Campsites</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Column: Advanced Search Filters */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 h-fit space-y-6">
          <h3 className="font-bold text-gray-800 text-lg border-b pb-3 flex justify-between items-center">
            <span>Filter Search</span>
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedDistrict('');
                setSelectedType('ALL');
                setMinPrice('');
                setMaxPrice('');
                setMinRating('ALL');
                setAmenities({ wifi: false, petFriendly: false, parking: false, river: false, forest: false, mountain: false });
              }}
              className="text-xs text-red-500 font-bold hover:underline"
            >
              Clear All
            </button>
          </h3>

          {/* Search Term */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Keywords</label>
            <input 
              type="text" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[var(--color-nature-green)]" 
              placeholder="River side, camping..." 
            />
          </div>

          {/* District Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">District</label>
            <select 
              value={selectedDistrict} 
              onChange={(e) => setSelectedDistrict(e.target.value)} 
              className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[var(--color-nature-green)]"
            >
              <option value="">All Districts</option>
              {uniqueDistricts.map((d, idx) => (
                <option key={idx} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Category Type */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Campsite Category</label>
            <select 
              value={selectedType} 
              onChange={(e) => setSelectedType(e.target.value)} 
              className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[var(--color-nature-green)]"
            >
              <option value="ALL">All Categories</option>
              <option value="TENT">Tent Setup</option>
              <option value="GLAMPING">Glamping Site</option>
              <option value="RV">RV Park</option>
              <option value="CABIN">Cabins</option>
            </select>
          </div>

          {/* Pricing Range */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Price Range (LKR)</label>
            <div className="grid grid-cols-2 gap-2">
              <input 
                type="number" 
                value={minPrice} 
                onChange={(e) => setMinPrice(e.target.value)} 
                placeholder="Min" 
                className="w-full px-3 py-2 text-sm border rounded-lg" 
              />
              <input 
                type="number" 
                value={maxPrice} 
                onChange={(e) => setMaxPrice(e.target.value)} 
                placeholder="Max" 
                className="w-full px-3 py-2 text-sm border rounded-lg" 
              />
            </div>
          </div>

          {/* Ratings selection */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Minimum Rating</label>
            <select 
              value={minRating} 
              onChange={(e) => setMinRating(e.target.value)} 
              className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[var(--color-nature-green)]"
            >
              <option value="ALL">All Ratings</option>
              <option value="4.5">4.5+ ★ Outstanding</option>
              <option value="4.0">4.0+ ★ Good</option>
              <option value="3.0">3.0+ ★ Average</option>
            </select>
          </div>

          {/* Amenities checklist */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Amenities & Scenery</label>
            <div className="space-y-2 text-sm font-semibold text-gray-600">
              {Object.keys(amenities).map((key) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer hover:text-gray-800">
                  <input 
                    type="checkbox" 
                    checked={amenities[key]} 
                    onChange={(e) => setAmenities({ ...amenities, [key]: e.target.checked })}
                    className="h-4 w-4 text-[var(--color-nature-green)] focus:ring-[var(--color-nature-green)] border-gray-300 rounded" 
                  />
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Listing Cards */}
        <div className="lg:col-span-3 space-y-12">
          {loading ? (
            <div className="text-center py-20 text-gray-500 font-medium">Searching amazing campsites...</div>
          ) : filteredCampsites.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <h3 className="text-xl font-bold text-gray-800">No Campsites Found</h3>
              <p className="text-gray-500 text-sm mt-1">Try adjusting your filters or keywords search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredCampsites.map((camp) => (
                <div key={camp.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 group flex flex-col transition-all relative">
                  
                  {/* Compare Checkbox */}
                  <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm text-xs font-bold flex items-center gap-1.5 text-gray-700">
                    <input 
                      type="checkbox" 
                      id={`compare-${camp.id}`}
                      checked={compareList.includes(camp.id)}
                      onChange={() => handleToggleCompare(camp.id)}
                      className="h-3.5 w-3.5 text-[var(--color-nature-green)] border-gray-300 rounded"
                    />
                    <label htmlFor={`compare-${camp.id}`} className="cursor-pointer select-none">Compare</label>
                  </div>

                  <Link to={`/campsites/${camp.id}`} className="h-48 overflow-hidden bg-gray-200 block relative">
                    {camp.photos && camp.photos[0] ? (
                      <img src={camp.photos[0]} alt={camp.name} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100 text-sm">No Image</div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[var(--color-nature-green)] shadow-sm">
                      LKR {camp.pricePerNight}/person/night
                    </div>
                  </Link>
                  
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 leading-tight text-lg hover:text-[var(--color-nature-green)]">
                        <Link to={`/campsites/${camp.id}`}>{camp.name}</Link>
                      </h3>
                      {camp.averageRating > 0 && (
                        <div className="bg-yellow-50 px-2 py-0.5 rounded border border-yellow-100 text-yellow-700 text-xs font-bold flex items-center gap-0.5 shrink-0">
                          ★ {camp.averageRating.toFixed(1)}
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-500 text-xs font-semibold mb-6 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-[var(--color-nature-green)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {camp.location}, {camp.district}
                    </p>
                    
                    <div className="mt-auto">
                      <Link to={`/campsites/${camp.id}`} className="w-full inline-block text-center bg-[var(--color-nature-green)] hover:bg-[var(--color-nature-light-green)] text-white font-bold py-2 rounded-xl transition-all shadow-sm text-sm">
                        View details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Recently Viewed Panel */}
          {recentlyViewed.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
              <h4 className="font-bold text-gray-800 text-sm mb-4">Recently Viewed Listings</h4>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
                {recentlyViewed.map(camp => (
                  <Link key={camp.id} to={`/campsites/${camp.id}`} className="w-36 flex-shrink-0 bg-white border border-gray-100 p-2 rounded-xl hover:shadow shadow-sm block transition-all">
                    <div className="h-20 w-full overflow-hidden rounded-lg bg-gray-100 mb-2">
                      <img src={camp.photos?.[0]} alt={camp.name} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-xs font-bold text-gray-800 truncate">{camp.name}</p>
                    <p className="text-[10px] font-bold text-[var(--color-nature-green)] mt-0.5">LKR {camp.pricePerNight}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Floating Comparison Bar */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white border border-gray-200 shadow-2xl p-4 rounded-full flex items-center gap-6 z-40 transition-all select-none">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">{compareList.length} / 3 Selected</span>
            <div className="flex gap-2">
              {selectedForCompare.map(c => (
                <div key={c.id} className="relative w-8 h-8 rounded-full overflow-hidden border">
                  <img src={c.photos?.[0]} alt={c.name} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              disabled={compareList.length < 2}
              onClick={() => setIsCompareModalOpen(true)}
              className="bg-[var(--color-nature-green)] hover:bg-[var(--color-nature-light-green)] disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-full text-xs transition-all shadow-md cursor-pointer"
            >
              Compare Side-by-Side
            </button>
            <button 
              onClick={() => setCompareList([])}
              className="text-xs text-gray-400 font-bold hover:text-gray-600 px-2"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Side-by-Side Compare Modal */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300">
          <div className="bg-white rounded-3xl w-full max-w-5xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[85vh] animate-in fade-in zoom-in duration-200">
            <div className="px-8 py-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h3 className="font-extrabold text-gray-900 text-xl tracking-tight">Compare Camping Sites</h3>
              <button 
                onClick={() => setIsCompareModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-2xl transition-colors p-2"
              >
                &times;
              </button>
            </div>
            
            <div className="p-8 overflow-auto flex-grow">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-4 font-bold text-gray-500 w-1/4">Specification</th>
                    {selectedForCompare.map(c => (
                      <th key={c.id} className="py-4 px-6 font-extrabold text-gray-900 text-base w-1/4">
                        {c.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
                  <tr>
                    <td className="py-4 font-bold text-gray-500">Image</td>
                    {selectedForCompare.map(c => (
                      <td key={c.id} className="py-4 px-6">
                        <div className="h-28 w-full rounded-xl overflow-hidden bg-gray-100 border">
                          <img src={c.photos?.[0]} alt={c.name} className="w-full h-full object-cover" />
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-4 font-bold text-gray-500">Price Per Night</td>
                    {selectedForCompare.map(c => (
                      <td key={c.id} className="py-4 px-6 text-[var(--color-nature-green)] font-bold text-base">
                        LKR {c.pricePerNight}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-4 font-bold text-gray-500">Rating</td>
                    {selectedForCompare.map(c => (
                      <td key={c.id} className="py-4 px-6 text-yellow-600 font-bold">
                        ★ {c.averageRating > 0 ? c.averageRating.toFixed(1) : 'N/A'} ({c.reviewCount || 0} reviews)
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-4 font-bold text-gray-500">Location</td>
                    {selectedForCompare.map(c => (
                      <td key={c.id} className="py-4 px-6">
                        {c.location}, {c.district}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-4 font-bold text-gray-500">Category Type</td>
                    {selectedForCompare.map(c => (
                      <td key={c.id} className="py-4 px-6 capitalize">
                        {c.campType?.toLowerCase()}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-4 font-bold text-gray-500">Max Guests</td>
                    {selectedForCompare.map(c => (
                      <td key={c.id} className="py-4 px-6">
                        {c.maxGuests || 'N/A'} Guests
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-4 font-bold text-gray-500">Amenities List</td>
                    {selectedForCompare.map(c => (
                      <td key={c.id} className="py-4 px-6 text-xs leading-relaxed max-h-24 overflow-y-auto">
                        <div className="flex flex-wrap gap-1">
                          {c.facilitiesList?.map((fac, i) => (
                            <span key={i} className="bg-gray-100 px-2 py-0.5 rounded border text-gray-600 font-medium">{fac}</span>
                          )) || 'Basic amenities'}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-4 font-bold text-gray-500">Contact Number</td>
                    {selectedForCompare.map(c => (
                      <td key={c.id} className="py-4 px-6 font-medium">
                        {c.contactNumber || c.owner?.phoneNumber || 'N/A'}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-4 font-bold text-gray-500">Booking Style</td>
                    {selectedForCompare.map(c => (
                      <td key={c.id} className="py-4 px-6">
                        {c.externalBooking ? (
                          <span className="text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded text-xs font-bold">External Website</span>
                        ) : (
                          <span className="text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-xs font-bold">Direct Call / WA</span>
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="px-8 py-5 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button 
                onClick={() => setIsCompareModalOpen(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-6 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
