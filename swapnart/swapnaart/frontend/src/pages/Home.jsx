import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Heart, Clock, Award, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [featuredServices, setFeaturedServices] = useState([]);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    // Fetch seed services, reviews, and portfolios
    axios.get('/api/services').then(res => setFeaturedServices(res.data.slice(0, 3))).catch(e => {});
    axios.get('/api/portfolio').then(res => setPortfolioItems(res.data.slice(0, 3))).catch(e => {});
    axios.get('/api/reviews?featured=true').then(res => setReviews(res.data)).catch(e => {});
  }, []);

  const stats = [
    { value: '500+', label: 'Projects Completed' },
    { value: '300+', label: 'Happy Clients' },
    { value: '5 ★', label: 'Rating' },
    { value: '15+', label: 'Years Experience' }
  ];

  const faqs = [
    { q: 'How do I request a custom quotation?', a: 'Go to our Contact or Services page, select your product requirements, choose your budget, and upload any raw assets. Our designers will review it and send a custom chat quote to your dashboard.' },
    { q: 'Can I request revisions on my design?', a: 'Absolutely! Our dashboard includes a revision loop and live chat with our creative designers to ensure the final output is exactly what you envision.' },
    { q: 'What payment methods do you support?', a: 'We support local card payments, bank transfers, UPI scan codes, and corporate invoice billings.' },
    { q: 'How do I download my final deliverables?', a: 'Once the design is ready and marked as completed, the high-resolution vector source files (AI, PDF, SVG) will be available in your Customer Dashboard for instant download.' }
  ];

  return (
    <div className="relative overflow-hidden font-poppins">
      
      {/* Background blobs */}
      <div className="blob-container">
        <div className="blob blob-primary" />
        <div className="blob blob-secondary" />
        <div className="blob blob-accent" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-24 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Hero Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 text-left"
          >
            <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 px-3 py-1 rounded-full text-primary text-xs font-semibold">
              <span>🚀 Creative Graphic & Print Agency</span>
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-extrabold text-darkObsidian tracking-tight leading-tight">
              Creative Designs <br/>
              That Build <br/>
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Your Brand
              </span>
            </h1>
            
            <p className="text-sm sm:text-base text-gray-500 font-inter leading-relaxed max-w-lg">
              We design and print everything from visiting cards to luxury wedding invitations, banners, brochures, social media ads, packages, and restaurant branding.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link 
                to="/contact" 
                className="shimmer-btn bg-primary hover:bg-secondary text-white font-bold px-8 py-4 rounded-2xl text-sm shadow-premium hover:shadow-hoverGlow transition-all duration-300"
              >
                Get Quote
              </Link>
              <Link 
                to="/services" 
                className="bg-white border border-gray-200 text-gray-700 font-bold px-8 py-4 rounded-2xl text-sm hover:border-primary hover:text-primary transition-all duration-300"
              >
                Explore Services
              </Link>
            </div>
          </motion.div>

          {/* Hero Animated Illustration */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-md h-[400px] rounded-3xl overflow-hidden glass-panel shadow-premium p-6 flex flex-col justify-between border border-white/40">
              
              {/* Floating micro layouts */}
              <div className="absolute top-8 left-[-20px] bg-white p-3 rounded-2xl shadow-premium border border-gray-100 flex items-center space-x-2 animate-bounce" style={{ animationDuration: '4s' }}>
                <span className="p-2 bg-accent/20 rounded-lg text-accent text-xs font-bold">✨ Premium</span>
                <span className="text-[10px] text-gray-500">Visiting Card</span>
              </div>

              <div className="absolute bottom-16 right-[-20px] bg-white p-3 rounded-2xl shadow-premium border border-gray-100 flex items-center space-x-2 animate-bounce" style={{ animationDuration: '6s', animationDelay: '1s' }}>
                <span className="p-2 bg-secondary/20 rounded-lg text-secondary text-xs font-bold">💎 5 ★</span>
                <span className="text-[10px] text-gray-500">Logo Design</span>
              </div>

              <div className="w-full h-48 bg-gradient-to-tr from-primary/20 via-secondary/15 to-accent/20 rounded-2xl flex items-center justify-center overflow-hidden">
                <span className="text-5xl">🎨</span>
              </div>

              <div className="space-y-2 mt-4 text-left">
                <h3 className="font-bold text-gray-800 text-sm">SWAPNAART Creative Studio</h3>
                <p className="text-[11px] text-gray-400 font-inter">Vector layouts, offset press, and creative graphics tailored to build corporate brand guidelines.</p>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full bg-primary text-white text-[9px] flex items-center justify-center font-bold">JD</div>
                  <div className="w-7 h-7 rounded-full bg-secondary text-white text-[9px] flex items-center justify-center font-bold">SM</div>
                  <div className="w-7 h-7 rounded-full bg-accent text-white text-[9px] flex items-center justify-center font-bold">EW</div>
                </div>
                <span className="text-[10px] font-bold text-primary">Live Chat Support</span>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Stats Counter Bar */}
      <section className="py-8 bg-white/40 border-y border-white/20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="space-y-1">
              <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{stat.value}</h2>
              <p className="text-xs sm:text-sm text-gray-500 font-medium font-inter">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-extrabold text-darkObsidian tracking-tight">Our Premium Design Categories</h2>
          <p className="text-xs sm:text-sm text-gray-500 font-inter">We deliver pixel-perfect designs with quick delivery and beautiful finishes.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredServices.length > 0 ? (
            featuredServices.map((service, index) => (
              <div 
                key={service._id || service.id}
                className="group relative bg-white/70 backdrop-blur-md rounded-3xl p-6 border border-white/40 hover-card-premium shadow-premium flex flex-col justify-between"
              >
                <div className="space-y-4 text-left">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-lg font-bold group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    {index + 1}
                  </div>
                  <h3 className="font-bold text-lg text-gray-800 group-hover:text-primary transition-colors">{service.title}</h3>
                  <p className="text-xs text-gray-400 font-inter leading-relaxed">{service.description}</p>
                  <div className="flex justify-between items-center text-xs font-bold pt-2">
                    <span className="text-secondary">Price: ₹{service.minPrice} - ₹{service.maxPrice}</span>
                    <span className="text-gray-400">Time: {service.deliveryTime}</span>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between">
                  <Link to="/services" className="text-xs font-bold text-primary flex items-center space-x-1 group-hover:text-secondary transition-colors">
                    <span>Order Now</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center text-xs text-gray-400">Loading catalog services...</div>
          )}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/services" className="inline-flex items-center space-x-2 text-xs font-bold text-primary hover:text-secondary transition-all">
            <span>View All Design & Print Services</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Portfolio Slider Preview */}
      <section className="py-20 bg-darkObsidian text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="space-y-2 text-left">
            <h2 className="text-3xl font-bold tracking-tight">Recent Visual Work</h2>
            <p className="text-xs text-gray-400 font-inter">Take a look at the graphic branding layouts created recently for our clients.</p>
          </div>
          <Link to="/portfolio" className="mt-4 sm:mt-0 text-xs font-bold text-accent flex items-center space-x-1 hover:underline">
            <span>Open Portfolio Gallery</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {portfolioItems.length > 0 ? (
            portfolioItems.map(item => (
              <div key={item._id || item.id} className="group relative rounded-3xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="h-64 overflow-hidden relative">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <div className="space-y-1 text-left">
                      <span className="text-[10px] font-bold text-accent uppercase tracking-wider">{item.category}</span>
                      <h4 className="font-bold text-sm">{item.title}</h4>
                      <p className="text-[11px] text-gray-300 font-inter line-clamp-2">{item.description}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 flex justify-between items-center bg-black/40">
                  <span className="text-xs font-bold text-gray-400 capitalize">{item.category}</span>
                  <div className="flex items-center space-x-1 text-xs text-secondary font-bold">
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span>{item.likes || 0}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center text-xs text-gray-500">Loading portfolio showcase...</div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-extrabold text-darkObsidian tracking-tight">Why Choose SWAPNAART?</h2>
          <p className="text-xs sm:text-sm text-gray-500 font-inter">We set up high-end branding layouts and offset print files with precision quality.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
          
          <div className="bg-white rounded-3xl p-6 shadow-premium space-y-4 border border-gray-50">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-gray-800 text-sm">Top-Tier Quality</h4>
            <p className="text-xs text-gray-400 font-inter leading-relaxed">No generic templates. Every visiting card, banner, and layout design is built custom from scratch.</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-premium space-y-4 border border-gray-50">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-gray-800 text-sm">Express Handoff</h4>
            <p className="text-xs text-gray-400 font-inter leading-relaxed">Need it fast? We offer express 24-hour turnaround for select card and brochure graphic designs.</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-premium space-y-4 border border-gray-50">
            <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <h4 className="font-bold text-gray-800 text-sm">Dashboard Order Tracking</h4>
            <p className="text-xs text-gray-400 font-inter leading-relaxed">Submit requirements, chat with designers, request revisions, and download invoices all in one private hub.</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-premium space-y-4 border border-gray-50">
            <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
              <Star className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-gray-800 text-sm">Multi-Language Ready</h4>
            <p className="text-xs text-gray-400 font-inter leading-relaxed">Support local and global campaigns. We create banners and cards in English, Hindi, and Gujarati.</p>
          </div>

        </div>
      </section>

      {/* Testimonials Slider */}
      {reviews.length > 0 && (
        <section className="py-20 bg-primary/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-2xl mx-auto mb-12 space-y-2">
              <h2 className="text-3xl font-bold text-darkObsidian tracking-tight">Loved by Customers</h2>
              <p className="text-xs text-gray-500 font-inter">See reviews from our business and local print design clients.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {reviews.map((r, idx) => (
                <div key={idx} className="bg-white rounded-3xl p-6 shadow-premium border border-gray-50 text-left flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex text-yellow-400">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 font-inter italic leading-relaxed">"{r.comment}"</p>
                  </div>
                  <h5 className="font-bold text-xs text-gray-800 mt-6 pt-4 border-t border-gray-100">{r.customerName}</h5>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Collapsible FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-3xl font-extrabold text-darkObsidian tracking-tight">Frequently Asked Questions</h2>
          <p className="text-xs text-gray-500 font-inter">Got questions about orders, deliveries, or payments? Find replies below.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-premium border border-gray-100 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full px-6 py-4 flex justify-between items-center text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-bold text-sm text-gray-800">{faq.q}</span>
                {openFaq === index ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-primary" />}
              </button>
              {openFaq === index && (
                <div className="px-6 pb-6 pt-2 text-xs text-gray-500 font-inter leading-relaxed border-t border-gray-50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;
