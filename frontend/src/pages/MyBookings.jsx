import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import ReservationService from '../services/reservation.service';

export default function MyBookings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    ReservationService.getMyReservations()
      .then(res => {
        setBookings(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [user, navigate]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>
      
      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading your adventures...</div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-xl text-gray-600 mb-4">You have no upcoming trips.</p>
          <Link to="/campsites" className="text-[var(--color-nature-green)] font-semibold hover:underline">
            Explore Campsites &rarr;
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map(booking => (
            <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{booking.campsiteName}</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Check-in: <span className="font-semibold text-gray-800">{booking.checkInDate}</span> • 
                  Check-out: <span className="font-semibold text-gray-800">{booking.checkOutDate}</span>
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">
                    {booking.numberOfPeople !== null && booking.numberOfPeople !== undefined ? booking.numberOfPeople : (booking.adults + booking.children)} People
                  </span>
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">
                    {booking.numberOfTents} Tents
                  </span>
                </div>
                {booking.status === 'REJECTED' && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-100 text-red-700 rounded-lg text-sm max-w-md">
                    <span className="font-semibold text-red-800">Reason for rejection: </span>
                    {booking.rejectionReason || "No reason provided."}
                  </div>
                )}
              </div>
              
              <div className="flex flex-col items-start md:items-end gap-2">
                <div className="text-2xl font-bold text-[var(--color-nature-green)]">LKR {booking.totalPrice}</div>
                <div>
                  Status: 
                  <span className={`ml-2 px-3 py-1 rounded-full text-xs font-bold ${
                    booking.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 
                    booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {booking.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-2">Booked on {new Date(booking.bookingDate).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
