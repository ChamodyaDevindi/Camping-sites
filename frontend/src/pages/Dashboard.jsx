import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CampsiteService from '../services/campsite.service';
import ReservationService from '../services/reservation.service';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [campsites, setCampsites] = useState([]);
  const [bookings, setBookings] = useState({}); // mapped by campsite id

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role === 'ROLE_ADMIN') {
      CampsiteService.getAllCampsites().then(res => {
        setCampsites(Array.isArray(res.data) ? res.data : []);
      }).catch(() => setCampsites([]));
    } else if (user.role === 'ROLE_OWNER') {
      CampsiteService.getMyCampsites().then(res => {
        setCampsites(Array.isArray(res.data) ? res.data : []);
      }).catch(() => setCampsites([]));
    }
  }, [user, navigate]);

  const handleDelete = (id) => {
    if(window.confirm('Are you sure you want to delete this campsite?')) {
      CampsiteService.deleteCampsite(id).then(() => {
        setCampsites(campsites.filter(c => c.id !== id));
      });
    }
  };

  const handleFetchBookings = async (campsiteId) => {
    if (bookings[campsiteId]) {
      // Toggle off
      const newBookings = { ...bookings };
      delete newBookings[campsiteId];
      setBookings(newBookings);
      return;
    }
    
    try {
      const res = await ReservationService.getCampsiteReservations(campsiteId);
      setBookings({ ...bookings, [campsiteId]: res.data });
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (campsiteId, bookingId, status, rejectionReason) => {
    try {
      const res = await ReservationService.updateReservationStatus(bookingId, status, rejectionReason);
      // Update local state
      const updatedBookings = bookings[campsiteId].map(b => b.id === bookingId ? res.data : b);
      setBookings({ ...bookings, [campsiteId]: updatedBookings });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to update booking status.');
      // Refresh bookings as the database record might have been set to REJECTED automatically on capacity failure
      try {
        const res = await ReservationService.getCampsiteReservations(campsiteId);
        setBookings({ ...bookings, [campsiteId]: res.data });
      } catch (fetchErr) {
        console.error(fetchErr);
      }
    }
  };

  const handleDeleteReservation = async (campsiteId, bookingId) => {
    if (window.confirm('Are you sure you want to delete this reservation?')) {
      try {
        await ReservationService.deleteReservation(bookingId);
        // Update local state by removing the reservation
        const updatedBookings = bookings[campsiteId].filter(b => b.id !== bookingId);
        setBookings({ ...bookings, [campsiteId]: updatedBookings });
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || 'Failed to delete reservation.');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your campsite listings and view reservations.</p>
        </div>
        {(user?.role === 'ROLE_OWNER' || user?.role === 'ROLE_ADMIN') && (
          <Link to="/add-campsite" className="bg-[var(--color-nature-brown)] hover:bg-[var(--color-nature-light-brown)] text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm">
            + Add New Campsite
          </Link>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="font-semibold text-gray-800">Your Properties</h2>
        </div>
        
        {campsites.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            You haven't listed any campsites yet.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {campsites.map(camp => (
              <li key={camp.id} className="p-6 flex flex-col transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-[var(--color-nature-green)]">{camp.name}</h3>
                    <p className="text-sm text-gray-500">{camp.location} • LKR {camp.pricePerNight}/person/night</p>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => handleFetchBookings(camp.id)} className="text-[var(--color-nature-brown)] hover:text-[var(--color-nature-light-brown)] font-medium text-sm">
                      {bookings[camp.id] ? 'Hide Bookings' : 'View Bookings'}
                    </button>
                    <button onClick={() => navigate(`/edit-campsite/${camp.id}`)} className="text-gray-600 hover:text-[var(--color-nature-green)] font-medium text-sm">Edit</button>
                    <button onClick={() => handleDelete(camp.id)} className="text-red-500 hover:text-red-700 font-medium text-sm">Delete</button>
                  </div>
                </div>
                
                {/* Bookings Section for this Campsite */}
                {bookings[camp.id] && (
                  <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <h4 className="font-semibold text-gray-800 mb-3">Reservations</h4>
                    {bookings[camp.id].length === 0 ? (
                      <p className="text-sm text-gray-500">No bookings yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {bookings[camp.id].map(booking => (
                          <div key={booking.id} className="bg-white p-4 rounded shadow-sm flex items-center justify-between text-sm">
                            <div>
                              <p className="font-bold text-gray-900">{booking.userName}</p>
                              <p className="text-gray-600">{booking.checkInDate} to {booking.checkOutDate}</p>
                              <p className="text-xs text-gray-500">{booking.numberOfPeople !== null && booking.numberOfPeople !== undefined ? booking.numberOfPeople : (booking.adults + booking.children)} People • {booking.numberOfTents} Tents • LKR {booking.totalPrice}</p>
                              {booking.status === 'REJECTED' && (
                                <p className="text-xs text-red-600 mt-1">
                                  <span className="font-semibold text-red-800">Reason: </span>
                                  {booking.rejectionReason || "No reason provided."}
                                </p>
                              )}
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <span className={`px-2 py-1 rounded text-xs font-bold ${
                                booking.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                                booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {booking.status}
                              </span>
                              
                              <div className="flex gap-2 mt-1">
                                {booking.status === 'PENDING' && (
                                  <>
                                    <button onClick={() => handleUpdateStatus(camp.id, booking.id, 'APPROVED')} className="text-green-600 hover:text-green-800 font-semibold text-xs border border-green-200 px-2 py-1 rounded bg-green-50">Approve</button>
                                    <button onClick={() => {
                                      const reason = prompt("Enter reason for rejection (optional):", "Dates not available");
                                      if (reason !== null) {
                                        handleUpdateStatus(camp.id, booking.id, 'REJECTED', reason);
                                      }
                                    }} className="text-red-600 hover:text-red-800 font-semibold text-xs border border-red-200 px-2 py-1 rounded bg-red-50">Reject</button>
                                  </>
                                )}
                                <button onClick={() => handleDeleteReservation(camp.id, booking.id)} className="text-red-600 hover:text-red-800 hover:bg-red-50 font-semibold text-xs border border-red-200 px-2 py-1 rounded bg-red-50">Delete</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
