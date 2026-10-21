import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import axiosClient from '../api/axiosClient';
import toast from 'react-hot-toast';
import { User, Mail, Phone, Save, Loader2 } from 'lucide-react';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Backend lo PUT /api/auth/profile ki call
      const { data } = await axiosClient.put('/auth/profile', form);
      
      // Context lo update cheyadam
      setUser(data.user);
      
      // LocalStorage lo kuda update cheyadam (refresh chesina data save avutundi)
      localStorage.setItem('user', JSON.stringify(data.user));
      
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        
        <div className="card">
          <form onSubmit={handleUpdate} className="space-y-5">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
              <div className="w-20 h-20 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center text-3xl font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold">{user?.name}</h2>
                <p className="text-slate-500 text-sm capitalize">{user?.role}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-slate-400" size={18} />
                <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-field pl-10" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                <input type="email" value={user?.email} disabled className="input-field pl-10 bg-slate-100 cursor-not-allowed" />
              </div>
              <p className="text-xs text-slate-400 mt-1">Email cannot be changed.</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
                <input type="tel" placeholder="9876543210" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="input-field pl-10" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-auto px-6">
              {loading ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} className="mr-2"/> Save Changes</>}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Profile;