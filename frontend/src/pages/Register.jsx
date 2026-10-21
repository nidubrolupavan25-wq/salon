import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await register(form.name, form.email, form.password, form.role);
    setLoading(false);
    if (res.success) {
      navigate(res.user.role === 'provider' ? '/provider' : '/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-purple-50 p-4">
      <form onSubmit={handleSubmit} className="card w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center mb-4">Create Account</h1>

        <input type="text" placeholder="Full Name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="input-field" required />

        <input type="email" placeholder="Email" value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="input-field" required />

        <input type="password" placeholder="Password (min 6 chars)" value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="input-field" minLength="6" required />

        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="input-field">
          <option value="customer">Customer (Book services)</option>
          <option value="provider">Provider (Offer services)</option>
        </select>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? <Loader2 className="animate-spin" size={18} /> : 'Sign Up'}
        </button>

        <p className="text-center text-sm text-slate-500">
          Already have an account? <Link to="/login" className="text-brand-600 font-medium">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;