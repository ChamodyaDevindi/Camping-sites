import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CampsiteService from '../services/campsite.service';

export default function EditCampsite() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pricePerNight: '',
    maxGuests: '',
    maxTents: '',
    campType: 'TENT',
    location: '',
    district: '',
    province: '',
    campTypes: '', 
    activities: '', 
    facilitiesList: '', 
    attractions: '', 
    limitedFacilities: '', 
    bestTimes: '', 
    hikingStartingPoint: '',
    hikingDistance: '',
    hikingTime: '',
    hikingDifficulty: 'Easy'
  });

  const [priceDetails, setPriceDetails] = useState([]);

  useEffect(() => {
    CampsiteService.getCampsiteById(id)
      .then(res => {
        const camp = res.data;
        setFormData({
          name: camp.name || '',
          description: camp.description || '',
          pricePerNight: camp.pricePerNight || '',
          maxGuests: camp.maxGuests || '',
          maxTents: camp.maxTents || '',
          campType: camp.campType || 'TENT',
          location: camp.location || '',
          district: camp.district || '',
          province: camp.province || '',
          campTypes: camp.campTypes ? camp.campTypes.join(', ') : '',
          activities: camp.activities ? camp.activities.join(', ') : '',
          facilitiesList: camp.facilitiesList ? camp.facilitiesList.join(', ') : '',
          attractions: camp.attractions ? camp.attractions.join(', ') : '',
          limitedFacilities: camp.limitedFacilities ? camp.limitedFacilities.join(', ') : '',
          bestTimes: camp.bestTimes ? camp.bestTimes.join(', ') : '',
          hikingStartingPoint: camp.hikingStartingPoint || '',
          hikingDistance: camp.hikingDistance || '',
          hikingTime: camp.hikingTime || '',
          hikingDifficulty: camp.hikingDifficulty || 'Easy'
        });
        
        if (camp.estimatedPrices && camp.estimatedPrices.length > 0) {
          const parsedPrices = camp.estimatedPrices.map(ep => {
            const parts = ep.split(':');
            return {
              label: parts[0] || '',
              price: parts.slice(1).join(':').trim() || ''
            };
          });
          setPriceDetails(parsedPrices);
        }
        
        setExistingPhotos(camp.photos || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to fetch campsite details.');
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleRemoveExistingPhoto = (index) => {
    setExistingPhotos(existingPhotos.filter((_, i) => i !== index));
  };

  const handleAddPriceDetail = () => {
    setPriceDetails([...priceDetails, { label: '', price: '' }]);
  };

  const handleRemovePriceDetail = (index) => {
    setPriceDetails(priceDetails.filter((_, i) => i !== index));
  };

  const handlePriceDetailChange = (index, field, value) => {
    const updated = priceDetails.map((pd, i) => i === index ? { ...pd, [field]: value } : pd);
    setPriceDetails(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    
    try {
      let uploadedPhotos = [...existingPhotos];
      if (selectedFiles.length > 0) {
        const uploadPromises = selectedFiles.map(file => CampsiteService.uploadImage(file));
        const uploadResponses = await Promise.all(uploadPromises);
        uploadedPhotos = [...uploadedPhotos, ...uploadResponses.map(res => res.data.url)];
      }

      const splitField = (val) => val ? val.split(',').map(s => s.trim()).filter(Boolean) : [];
      const mappedPrices = priceDetails
        .filter(pd => pd.label && pd.price)
        .map(pd => `${pd.label}: ${pd.price}`);

      await CampsiteService.updateCampsite(id, {
        ...formData,
        pricePerNight: parseFloat(formData.pricePerNight),
        maxGuests: parseInt(formData.maxGuests),
        maxTents: parseInt(formData.maxTents),
        photos: uploadedPhotos,
        videos: [],
        campTypes: splitField(formData.campTypes),
        activities: splitField(formData.activities),
        facilitiesList: splitField(formData.facilitiesList),
        attractions: splitField(formData.attractions),
        limitedFacilities: splitField(formData.limitedFacilities),
        bestTimes: splitField(formData.bestTimes),
        estimatedPrices: mappedPrices
      });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update campsite. Make sure you are logged in as the owner.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-500">Loading campsite details...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 font-display">Edit Campsite</h1>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. Basic Info */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Basic Info</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Campsite Name</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-nature-green)]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Overview / Description</label>
              <textarea name="description" required rows="4" value={formData.description} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-nature-green)]"></textarea>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Per Night (LKR)</label>
                <input type="number" step="0.01" name="pricePerNight" value={formData.pricePerNight} required onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Main Category</label>
                <select name="campType" value={formData.campType} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
                  <option value="TENT">Tent</option>
                  <option value="GLAMPING">Glamping</option>
                  <option value="RV">RV Park</option>
                  <option value="CABIN">Cabin</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Guests</label>
                <input type="number" name="maxGuests" value={formData.maxGuests} required onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Tents</label>
                <input type="number" name="maxTents" value={formData.maxTents} required onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>
          </div>

          {/* 2. Detailed Location */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Location Details</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Address / Location</label>
              <input type="text" name="location" value={formData.location} required onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                <input type="text" name="district" value={formData.district} required onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                <input type="text" name="province" value={formData.province} required onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>
          </div>

          {/* 3. Detailed Information & Tags */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Campsite Tags & Attributes</h2>
            <p className="text-xs text-gray-400">Enter multiple values separated by commas.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Camp Type Tags</label>
                <input type="text" name="campTypes" value={formData.campTypes} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" placeholder="e.g. River Camp, Adventure Camp" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Activities</label>
                <input type="text" name="activities" value={formData.activities} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" placeholder="e.g. White Water Rafting, River Bathing" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Facilities & Amenities</label>
                <input type="text" name="facilitiesList" value={formData.facilitiesList} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" placeholder="e.g. Riverside camping area, Camping tents" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nearby Attractions</label>
                <input type="text" name="attractions" value={formData.attractions} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" placeholder="e.g. Kelani River, Rainforest scenery" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Limited / Unavailable Facilities</label>
                <input type="text" name="limitedFacilities" value={formData.limitedFacilities} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Best Time to Visit details</label>
                <input type="text" name="bestTimes" value={formData.bestTimes} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>
          </div>

          {/* 4. Estimated Pricing Table */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-xl font-semibold text-gray-800">Estimated Price Breakdown</h2>
              <button type="button" onClick={handleAddPriceDetail} className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg transition-colors font-medium">+ Add Row</button>
            </div>
            <div className="space-y-3">
              {priceDetails.map((pd, index) => (
                <div key={index} className="flex gap-4 items-center">
                  <input type="text" value={pd.label} onChange={(e) => handlePriceDetailChange(index, 'label', e.target.value)} placeholder="Label" className="flex-1 px-4 py-2 border rounded-lg" required />
                  <input type="text" value={pd.price} onChange={(e) => handlePriceDetailChange(index, 'price', e.target.value)} placeholder="Price range" className="flex-1 px-4 py-2 border rounded-lg" required />
                  <button type="button" onClick={() => handleRemovePriceDetail(index)} className="text-red-500 hover:text-red-700 font-bold px-2 py-1">×</button>
                </div>
              ))}
              {priceDetails.length === 0 && <p className="text-sm text-gray-500 text-center">No price details added. Add custom pricing labels for users.</p>}
            </div>
          </div>

          {/* 5. Hiking Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Hiking Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Starting Point</label>
                <input type="text" name="hikingStartingPoint" value={formData.hikingStartingPoint} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Walking Distance</label>
                <input type="text" name="hikingDistance" value={formData.hikingDistance} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hiking Time</label>
                <input type="text" name="hikingTime" value={formData.hikingTime} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level</label>
                <select name="hikingDifficulty" value={formData.hikingDifficulty} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg">
                  <option value="Easy">Easy</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Difficult">Difficult</option>
                  <option value="N/A">Not Applicable</option>
                </select>
              </div>
            </div>
          </div>

          {/* 6. Photos */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Photos</h2>
            <div>
              {existingPhotos.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-700 mb-2">Current Campsite Images:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {existingPhotos.map((photo, idx) => (
                      <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border group">
                        <img src={photo} alt="Current" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => handleRemoveExistingPhoto(idx)} className="absolute top-1 right-1 bg-red-500 hover:bg-red-700 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shadow-md transition-colors">
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <label className="block text-sm font-medium text-gray-700 mb-1 font-semibold">Upload More Campsite Images (Multiple allowed)</label>
              <input type="file" multiple accept="image/*" onChange={handleFileChange} className="w-full px-4 py-2 border rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-nature-green)] file:text-white hover:file:bg-[var(--color-nature-light-green)]" />
              {selectedFiles.length > 0 && (
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedFiles.map((file, idx) => (
                    <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border">
                      <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute bottom-1 left-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                        New Photo
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 flex gap-4">
            <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 bg-[var(--color-nature-green)] hover:bg-[var(--color-nature-light-green)] text-white px-6 py-3 rounded-lg font-medium shadow-md transition-all disabled:opacity-50">
              {saving ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
