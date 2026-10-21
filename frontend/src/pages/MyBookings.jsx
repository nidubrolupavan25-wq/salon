import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import Navbar from '../components/Navbar';
import { Calendar, Clock, IndianRupee, CheckCircle2, AlertCircle, XCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const { data } = await axiosClient.get('/bookings/my');
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

  // Dummy Payment Logic - Direct ga status ni 'confirmed' ga marchutunnam
  const handlePayment = async (bookingId) => {
    const confirmPay = window.confirm("Do you want to pay now? (Test Mode)");
    if (!confirmPay) return;

    try {
      toast.loading('Processing payment...', { id: 'payment' });
      
      // Backend lo status update API ki call chestunnam
      await axiosClient.put(`/bookings/${bookingId}/status`, { status: 'confirmed' });
      
      toast.success('Payment Successful! Booking Confirmed.', { id: 'payment' });
      fetchBookings(); // List ni refresh cheyadam
    } catch (error) {
      toast.error('Payment failed.', { id: 'payment' });
    }
  };

  // Booking Cancel Logic
  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      toast.loading('Cancelling booking...', { id: 'cancel' });
      await axiosClient.put(`/bookings/${bookingId}/status`, { status: 'cancelled' });
      toast.success('Booking cancelled successfully.', { id: 'cancel' });
      fetchBookings();
    } catch (error) {
      toast.error('Failed to cancel booking.', { id: 'cancel' });
    }
  };

  // Status badge design
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><AlertCircle size={14}/> Pending Acceptance</span>;
      case 'accepted': return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><AlertCircle size={14}/> Ready to Pay</span>;
      case 'confirmed': return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle2 size={14}/> Confirmed</span>;
      case 'completed': return <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle size={14}/> Completed</span>;
      case 'cancelled': return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><XCircle size={14}/> Cancelled</span>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

        {loading ? (
          <p>Loading...</p>
        ) : bookings.length === 0 ? (
          <div className="card text-center py-12 text-slate-500">You have no bookings yet.</div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="card flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{booking.service?.name}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><Calendar size={16}/> {booking.booking_date}</span>
                    <span className="flex items-center gap-1"><Clock size={16}/> {booking.booking_time}</span>
                    <span className="flex items-center gap-1"><IndianRupee size={16}/> {booking.amount}</span>
                  </div>
                  {booking.notes && <p className="text-sm text-slate-500 mt-2 italic">Note: {booking.notes}</p>}
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  {getStatusBadge(booking.status)}
                  
                  {/* Ippudu 'accepted' unte matrame Pay Now and Cancel chupinchali */}
                  {booking.status === 'accepted' && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handlePayment(booking.id)}
                        className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Pay Now
                      </button>
                      <button 
                        onClick={() => handleCancel(booking.id)}
                        className="bg-white border border-slate-200 text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
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

export default MyBookings;