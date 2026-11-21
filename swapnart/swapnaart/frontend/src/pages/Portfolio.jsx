import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, RefreshCw, Eye, Star } from 'lucide-react';

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewingBeforeAfter, setViewingBeforeAfter] = useState({});

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const res = await axios.get('/api/portfolio');
      setPortfolio(res.data);
      setLoading(false);
    } catch (e) {
      console.error('Failed to load portfolio', e);
      setLoading(false);
    }
  };

  const filters = [
    { label: 'All Projects', value: 'all' },
    { label: 'Cards & Stationery', value: 'cards' },
    { label: 'Brand Identity', value: 'branding' },
    { label: 'Flex Banners', value: 'banners' },
    { label: 'Restaurant', value: 'restaurant' }
  ];

  const filteredItems = portfolio.filter(item => {
    return activeFilter === 'all' || item.category.toLowerCase() === activeFilter.toLowerCase();
  });

  const handleLike = async (id) => {
    try {
      const res = await axios.post(`/api/portfolio/${id}/like`);
      // Update local state
      setPortfolio(prev => prev.map(item => {
        if (item._id === id || item.id === id) {
          return { ...item, likes: res.data.likes };
        }
        return item;
      }));
    } catch (e) {
      console.error('Failed to like portfolio item');
    }
  };

  const toggleBeforeAfter = (id) => {
    setViewingBeforeAfter(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-poppins">
      
      {/* Background decoration */}
      <div className="blob-container">
        <div className="blob blob-primary" />
        <div className="blob blob-secondary" />
      </div>

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
        <div className="inline-flex items-center space-x-2 bg-accent/15 border border-accent/30 px-3 py-1 rounded-full text-primary text-xs font-semibold">
          <span>✨ Creative Showcase</span>
        </div>
        <h1 className="text-4xl font-extrabold text-darkObsidian tracking-tight">Project Portfolio Gallery</h1>
        <p className="text-xs sm:text-sm text-gray-500 font-inter leading-relaxed">
          Explore custom corporate business cards, outdoor hoardings, and premium brand designs.
        </p>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-wrap justify-center gap-2 mb-16 bg-white/70 backdrop-blur-md p-3.5 rounded-3xl border border-white/40 shadow-premium max-w-2xl mx-auto">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
              activeFilter === filter.value
                ? 'bg-primary text-white shadow-premium'
                : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-primary'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-20 text-xs text-gray-400">Loading portfolios...</div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => {
              const itemId = item._id || item.id;
              const isShowingBefore = viewingBeforeAfter[itemId];
              const hasBeforeAfter = item.beforeImageUrl;

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={itemId}
                  className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-premium flex flex-col justify-between"
                >
                  
                  {/* Photo Container */}
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    
                    {/* Before Image */}
                    {hasBeforeAfter && isShowingBefore ? (
                      <img 
                        src={item.beforeImageUrl} 
                        alt="Before design" 
                        className="w-full h-full object-cover transition-transform duration-500" 
                      />
                    ) : (
                      /* Final Image */
                      <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                    )}

                    {/* Before/After Overlay Badge */}
                    {hasBeforeAfter && (
                      <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-xl text-[9px] font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                        <span className={`w-2 h-2 rounded-full ${isShowingBefore ? 'bg-secondary animate-pulse' : 'bg-green-400'}`} />
                        <span>{isShowingBefore ? 'Before Draft' : 'Final Design'}</span>
                      </div>
                    )}

                    {/* Action Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-6">
                      <div className="space-y-2 text-left w-full">
                        <span className="text-[9px] font-bold text-accent uppercase tracking-wider">{item.category}</span>
                        <h4 className="font-extrabold text-sm text-white">{item.title}</h4>
                        <p className="text-[11px] text-gray-300 font-inter line-clamp-2">{item.description}</p>
                        
                        {hasBeforeAfter && (
                          <button
                            onClick={() => toggleBeforeAfter(itemId)}
                            className="mt-2 bg-white/10 hover:bg-white/25 border border-white/20 text-white font-bold py-1.5 px-3 rounded-lg text-[9px] flex items-center space-x-1 transition-all"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Toggle Before/After view</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Info Row */}
                  <div className="p-5 flex justify-between items-center bg-white border-t border-gray-50">
                    <div>
                      <span className="text-[10px] font-medium text-gray-400 capitalize">{item.category}</span>
                    </div>

                    <div className="flex items-center space-x-4">
                      
                      {/* Like CTA */}
                      <button
                        onClick={() => handleLike(itemId)}
                        className="flex items-center space-x-1.5 text-xs text-gray-500 hover:text-secondary font-bold transition-colors"
                      >
                        <Heart className="w-4 h-4 hover:fill-current" />
                        <span>{item.likes || 0}</span>
                      </button>

                    </div>
                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-20 bg-white/40 rounded-3xl border border-gray-100 text-xs text-gray-400">
          No portfolio items available in this category.
        </div>
      )}

    </div>
  );
};

export default Portfolio;
