import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { Plus, Trash2, Loader2, IndianRupee, Briefcase, CalendarCheck, TrendingUp } from 'lucide-react';

const ProviderDashboard = () => {
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]); // Kotha state
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', price: '', duration: '', description: '' });
  const [adding, setAdding] = useState(false);

  const fetchMyServices = async () => {
    try {
      const { data } = await axiosClient.get('/services/my');
      setServices(data);
    } catch (error) {
      console.error(error);
    }
  };

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
    fetchMyServices();
    fetchBookings();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      await axiosClient.post('/services', form);
      toast.success('Service added successfully!');
      setForm({ name: '', price: '', duration: '', description: '' }); 
      fetchMyServices(); 
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add service');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await axiosClient.delete(`/services/${id}`);
      toast.success('Service deleted');
      fetchMyServices();
    } catch (error) {
      toast.error('Failed to delete service');
    }
  };

  // Statistics Calculation
  const totalValue = services.reduce((acc, curr) => acc + Number(curr.price), 0);
  const totalBookings = bookings.length;
  const totalRevenue = bookings
    .filter(b => b.status === 'completed')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 py-10">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Service Management</h1>
          <p className="text-slate-500 mt-1">Manage your offerings and pricing here.</p>
        </div>

        {/* Stats Cards (Kotha ga add chesam) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
            <div className="bg-brand-50 p-3 rounded-lg text-brand-600"><Briefcase size={22} /></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Services</p>
              <p className="text-xl font-bold text-slate-800">{services.length}</p>
            </div>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
            <div className="bg-blue-50 p-3 rounded-lg text-blue-600"><CalendarCheck size={22} /></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Bookings</p>
              <p className="text-xl font-bold text-slate-800">{totalBookings}</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
            <div className="bg-green-50 p-3 rounded-lg text-green-600"><TrendingUp size={22} /></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Revenue (Completed)</p>
              <p className="text-xl font-bold text-green-600">₹{totalRevenue}</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
            <div className="bg-purple-50 p-3 rounded-lg text-purple-600"><IndianRupee size={22} /></div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Menu Value</p>
              <p className="text-xl font-bold text-slate-800">₹{totalValue}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Add Service Form */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24 border-t-4 border-t-brand-500">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Plus size={20} className="text-brand-600"/> Add New Service
              </h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700">Service Name</label>
                  <input type="text" placeholder="e.g., Premium Haircut" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field" />
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1 text-slate-700">Price (₹)</label>
                    <input type="number" placeholder="500" required value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="input-field" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1 text-slate-700">Duration</label>
                    <input type="number" placeholder="30" required value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} className="input-field" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-slate-700">Description</label>
                  <textarea placeholder="Brief details about the service..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="input-field h-24 resize-none" />
                </div>

                <button type="submit" disabled={adding} className="btn-primary mt-2">
                  {adding ? <Loader2 className="animate-spin" size={18}/> : 'Save Service'}
                </button>
              </form>
            </div>
          </div>

          {/* Services List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-200 bg-slate-50/50">
                <h2 className="text-xl font-bold text-slate-800">Active Services</h2>
              </div>
              
              {loading ? (
                <div className="p-10 text-center text-slate-500">Loading...</div>
              ) : services.length === 0 ? (
                <div className="p-10 text-center flex flex-col items-center text-slate-500">
                  <Briefcase size={40} className="text-slate-300 mb-4" />
                  <p>No services added yet. Use the form to add your first service.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {services.map(service => (
                    <div key={service.id} className="p-6 flex justify-between items-center hover:bg-slate-50/50 transition-colors">
                      <div>
                        <h3 className="font-bold text-lg text-slate-800">{service.name}</h3>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-1">{service.description || 'No description provided.'}</p>
                        <div className="flex gap-3 mt-2 text-sm font-medium">
                          <span className="bg-brand-50 text-brand-700 px-2 py-1 rounded">₹{service.price}</span>
                          <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded">{service.duration} mins</span>
                        </div>
                      </div>
                      <button onClick={() => handleDelete(service.id)} className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Delete Service">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default ProviderDashboard;