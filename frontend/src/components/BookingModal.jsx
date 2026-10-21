import React, { useState } from 'react';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';
import { X, Calendar, Clock, Loader2 } from 'lucide-react';

const BookingModal = ({ service, onClose, onSuccess }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00 AM');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axiosClient.post('/bookings', {
        service_id: service.id,
        booking_date: date,
        booking_time: time,
        notes
      });
      toast.success('Booking created! Please proceed to payment.');
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-2">Book {service.name}</h2>
        <p className="text-slate-500 mb-6">Total Amount: <span className="font-bold text-brand-600">₹{service.price}</span></p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">Select Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 text-slate-400" size={18} />
              <input 
                type="date" 
                required 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
                className="input-field pl-10"
                min={new Date().toISOString().split('T')[0]} 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">Select Time</label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 text-slate-400" size={18} />
              <select 
                value={time} 
                onChange={(e) => setTime(e.target.value)}
                className="input-field pl-10"
              >
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="12:00 PM">12:00 PM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="03:00 PM">03:00 PM</option>
                <option value="04:00 PM">04:00 PM</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700">Notes (Optional)</label>
            <textarea 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)}
              className="input-field h-20 resize-none"
              placeholder="Any specific requests?"
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary mt-2">
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;