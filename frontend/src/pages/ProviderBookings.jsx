import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { Calendar, Clock, User, CheckCircle, Check } from 'lucide-react'; // Check icon add chesam

const ProviderBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Provider ki vachina bookings ni fetch cheyadam
  const fetchBookings = async () => {
    try {
      const { data } = await axiosClient.get('/bookings/provider');
      setBookings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Booking ni 'accepted' ga marchadam (Kotha ga add chesam)
  const handleAccept = async (id) => {
    try {
      await axiosClient.put(`/bookings/${id}/status`, { status: 'accepted' });
      toast.success('Booking Accepted! Customer can now pay.');
      fetchBookings(); // Refresh list
    } catch (error) {
      toast.error('Failed to accept booking');
    }
  };

  // Booking status ni 'completed' ga marchadam
  const handleComplete = async (id) => {
    try {
      await axiosClient.put(`/bookings/${id}/status`, { status: 'completed' });
      toast.success('Booking marked as completed!');
      fetchBookings(); // Refresh list
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Customer Bookings</h1>

        {loading ? (
          <p>Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <div className="card text-center py-12 text-slate-500">
            No bookings received yet.
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="card flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{booking.service?.name}</h3>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><User size={16}/> {booking.customer?.name}</span>
                    <span className="flex items-center gap-1"><Calendar size={16}/> {booking.booking_date}</span>
                    <span className="flex items-center gap-1"><Clock size={16}/> {booking.booking_time}</span>
                  </div>
                  {booking.notes && <p className="text-sm text-slate-500 mt-2 italic">Note: {booking.notes}</p>}
                </div>
                
                <div>
                  {/* Status ni batti buttons chupinchadam */}
                  {booking.status === 'pending' && (
                    <button 
                      onClick={() => handleAccept(booking.id)}
                      className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                    >
                      <Check size={18} /> Accept Booking
                    </button>
                  )}

                  {booking.status === 'confirmed' && (
                    <button 
                      onClick={() => handleComplete(booking.id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                    >
                      <CheckCircle size={18} /> Mark as Completed
                    </button>
                  )}

                  {/* Migatha statuses ki badge chupinchadam */}
                  {(booking.status === 'completed' || booking.status === 'cancelled' || booking.status === 'accepted') && (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      booking.status === 'completed' ? 'bg-green-100 text-green-700' : 
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {booking.status.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProviderBookings;