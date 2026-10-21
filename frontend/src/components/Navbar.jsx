import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut, Calendar, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm">S</div>
        <span className="text-xl font-bold text-slate-800">SalonPro</span>
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            {/* Customer Links */}
            {user.role === 'customer' && (
              <Link to="/my-bookings" className="text-slate-600 hover:text-brand-600 flex items-center gap-1 font-medium transition-colors">
                <Calendar size={18} /> My Bookings
              </Link>
            )}
            
            {/* Provider Links */}
            {user.role === 'provider' && (
              <>
                <Link to="/provider" className="text-slate-600 hover:text-brand-600 flex items-center gap-1 font-medium transition-colors">
                  My Services
                </Link>
                <Link to="/provider-bookings" className="text-slate-600 hover:text-brand-600 flex items-center gap-1 font-medium transition-colors">
                  <Calendar size={18} /> Bookings
                </Link>
              </>
            )}
            
            {/* User Profile Link (Kotha ga add chesam) */}
            <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors">
              <User size={16} className="text-slate-500" />
              <span className="text-sm font-medium text-slate-700">{user.name}</span>
            </Link>
            
            <button onClick={handleLogout} className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Logout">
              <LogOut size={18} />
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-slate-600 hover:text-brand-600 font-medium">Login</Link>
            <Link to="/register" className="btn-primary w-auto">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;