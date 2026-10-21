import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../hooks/useAuth';
import { Clock, Tag, CalendarPlus, Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import BookingModal from '../components/BookingModal';

const Home = () => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  // Category state (Kotha ga add chesam)
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Booking Modal state
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchServices = async () => {
    try {
      const { data } = await axiosClient.get('/services');
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleBookClick = (service) => {
    if (!user) return; // Login ledu ante aapam
    setSelectedService(service);
    setIsModalOpen(true);
  };

  // Search + Category Filter Logic
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || 
      service.name.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Book Your Next Appointment</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Choose from our top-rated services and get pampered by professionals.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-6 relative">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search for services (e.g., Haircut)..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 outline-none shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category Filter Buttons (Kotha ga add chesam) */}
        <div className="flex justify-center gap-3 mb-10 flex-wrap">
          {['All', 'Hair', 'Facial', 'Spa'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat 
                  ? 'bg-brand-600 text-white shadow-md' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-500">Loading services...</div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-20 card text-slate-500">
            No services found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div key={service.id} className="card hover:shadow-md transition-shadow group">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-slate-800">{service.name}</h3>
                  <span className="bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                    <Tag size={14} /> ₹{service.price}
                  </span>
                </div>
                
                <p className="text-slate-500 mb-6 line-clamp-2">{service.description}</p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                  <span className="text-sm text-slate-500 flex items-center gap-1">
                    <Clock size={16} /> {service.duration} mins
                  </span>
                  
                  <button 
                    onClick={() => handleBookClick(service)}
                    className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all active:scale-95"
                  >
                    <CalendarPlus size={16} /> Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Booking Modal */}
      {isModalOpen && selectedService && (
        <BookingModal 
          service={selectedService} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => {
            setIsModalOpen(false);
            // Booking success ayyaka em cheyalo ikkada cheppachu
          }}
        />
      )}
    </div>
  );
};

export default Home;