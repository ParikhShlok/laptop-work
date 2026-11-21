import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Phone, Mail, Clock, MessageCircle, Send, CheckCircle, AlertCircle, Upload } from 'lucide-react';
import confetti from 'canvas-confetti';

const Contact = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [service, setService] = useState('Visiting Card / Business Card');
  const [budget, setBudget] = useState('1000');
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const servicesList = [
    'Visiting Card / Business Card',
    'Premium Brand Identity & Logo Design',
    'Flex Banner / Outdoor Hoardings',
    'Creative Restaurant Menu & Branding',
    'Custom Brochures & Flyers',
    'Wedding Card / Marriage Invitation',
    'Other Custom Graphic Printing'
  ];

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login?redirect=/contact');
      return;
    }

    setSubmitting(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('serviceTitle', `${service} (Custom Quote Request)`);
      formData.append('requirements', `Budget: ₹${budget}\nInquiry: ${message}`);
      formData.append('pricing', budget);

      for (let i = 0; i < files.length; i++) {
        formData.append('attachments', files[i]);
      }

      await axios.post('/api/orders', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });

      setSuccess(true);
      setMessage('');
      setFiles([]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit quote inquiry.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  return (
    <div className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-poppins">
      
      {/* Background decoration */}
      <div className="blob-container">
        <div className="blob blob-primary" />
        <div className="blob blob-secondary" />
      </div>

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center space-x-2 bg-secondary/10 border border-secondary/20 px-3 py-1 rounded-full text-secondary text-xs font-semibold">
          <span>📞 Contact SWAPNAART</span>
        </div>
        <h1 className="text-4xl font-extrabold text-darkObsidian tracking-tight">Request a Custom Quotation</h1>
        <p className="text-xs sm:text-sm text-gray-500 font-inter leading-relaxed">
          Tell us about your graphic design or offset print requirements and get an estimate details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start text-left">
        
        {/* Contact info column */}
        <div className="lg:col-span-1 space-y-8">
          
          <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 border border-white/40 shadow-premium space-y-6">
            <h3 className="font-extrabold text-gray-800 text-lg">Direct Contacts</h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-inter">Telephone hotline</p>
                  <p className="text-xs font-bold text-gray-700">+91 99999 99999</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-inter">Email assistance</p>
                  <p className="text-xs font-bold text-gray-700">contact@swapnaart.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-accent/15 text-primary flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-inter">Office timing</p>
                  <p className="text-xs font-bold text-gray-700">Mon - Sat: 9:00 AM - 7:00 PM</p>
                </div>
              </div>
            </div>

            {/* Quick action triggers */}
            <div className="pt-6 border-t border-gray-100 flex flex-col gap-3">
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noreferrer"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
              <a
                href="tel:+919999999999"
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all"
              >
                <Phone className="w-4 h-4 text-primary" />
                <span>Call Main Hotline</span>
              </a>
            </div>

          </div>

          {/* Styled Physical Office Map Panel */}
          <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 border border-white/40 shadow-premium space-y-4">
            <h3 className="font-extrabold text-gray-800 text-sm">Physical Office</h3>
            <div className="h-40 bg-gradient-to-tr from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center border border-gray-100 relative overflow-hidden">
              {/* Styled Mock map grids */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#6c3bff_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="relative text-center space-y-1">
                <span className="text-3xl">📍</span>
                <p className="text-xs font-extrabold text-gray-800">SWAPNAART Creative Plaza</p>
                <p className="text-[9px] text-gray-400 font-inter">Gujarat, India</p>
              </div>
            </div>
          </div>

        </div>

        {/* Contact Form Column */}
        <div className="lg:col-span-2">
          
          <div className="bg-white rounded-3xl p-8 shadow-premium border border-gray-50 space-y-6">
            
            {success ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-2xl">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg text-gray-800">Quote Request Submitted!</h3>
                <p className="text-xs text-gray-500 font-inter leading-relaxed max-w-sm mx-auto">
                  Your requirements are saved as a custom order. You can chat with designers and track pricing estimates under your dashboard.
                </p>
                <button
                  onClick={() => {
                    setSuccess(false);
                    navigate('/dashboard');
                  }}
                  className="bg-primary hover:bg-secondary text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-all shadow-premium"
                >
                  Go to Dashboard
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <h3 className="font-extrabold text-gray-800 text-lg">Inquiry Specs</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-xs focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all font-inter"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. email@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-xs focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all font-inter"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-xs focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all font-inter"
                    />
                  </div>

                  {/* Service Dropdown */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Category of Interest</label>
                    <select
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-xs focus:bg-white outline-none transition-all font-inter"
                    >
                      {servicesList.map((item, idx) => (
                        <option key={idx} value={item}>{item}</option>
                      ))}
                    </select>
                  </div>

                </div>

                {/* Budget Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-gray-700">
                    <span>Target Budget Range</span>
                    <span className="text-primary">₹{budget}</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="20000"
                    step="500"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full accent-primary bg-gray-100 rounded-lg h-2 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-inter">
                    <span>₹500 (Visiting Cards)</span>
                    <span>₹20,000+ (Premium Branding Packages)</span>
                  </div>
                </div>

                {/* Brief message */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Describe what you need</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide details (dimensions, printing material gloss/matte, concept notes, or logo texts)..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-xs focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all font-inter"
                  />
                </div>

                {/* Reference upload */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700">Attach Specifications or Logomarks (Optional)</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-5 text-center relative hover:border-primary bg-gray-50/50 cursor-pointer">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                    <p className="text-[11px] font-bold text-gray-600">Select files (PNG, JPG, PDF, ZIP)</p>
                  </div>
                  {files.length > 0 && (
                    <div className="bg-gray-50 p-2 rounded-xl text-[10px] text-gray-500 font-inter">
                      {files.map((file, idx) => (
                        <p key={idx} className="truncate">{file.name} ({Math.round(file.size / 1024)} KB)</p>
                      ))}
                    </div>
                  )}
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-xl flex items-center space-x-2 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary hover:bg-secondary text-white font-bold py-3.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-premium hover:shadow-hoverGlow"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Sending Request...' : 'Submit Quotation Request'}</span>
                </button>

              </form>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};

export default Contact;
