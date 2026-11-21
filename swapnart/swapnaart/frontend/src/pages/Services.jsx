import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Search, ShoppingBag, Check, Upload, HelpCircle, AlertCircle, X, Plus, Minus, PackageCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

// Structured price-list supplied for the print ordering workflow. It lives beside
// the bespoke design services so customers can order either a ready print job or
// a fully custom project from one place.
const printCatalog = [
  { category: 'Premium Velvet Cards', note: 'Round cut with dye punching', items: [
    ['400 GSM Velvet with UV FB (93.5×54)', 500, 930], ['400 GSM Velvet with Foils FB (93.5×54)', 500, 1280],
    ['400 GSM Velvet with Foils SS (93.5×54)', 500, 980], ['400 GSM Velvet UV SS (93.5×54)', 500, 830],
    ['400 GSM Velvet Card (93.5×54) MM', 500, 730], ['400 GSM Velvet PP (93.5×54)', 1000, 980]
  ]},
  { category: 'Visiting Cards', items: [
    ['NT Single Side', 1000, 280], ['NT Front Back', 1000, 330], ['250 GSM Both Side Card', 1000, 280],
    ['250 GSM One Side Card', 1000, 240], ['250 BSSY Art Glossy Card', 1000, 310], ['400 GSM Thermal Matt Card', 1000, 540],
    ['400 GSM Single Side UV Card', 1000, 670], ['400 GSM Front Back UV Card', 1000, 770]
  ]},
  { category: 'Square Inch Job', items: [['Art Card Single Side (sq.inch)', 1000, 23], ['Art Card Both Side (sq.inch)', 1000, 27], ['Art Card Lamination (sq.inch)', 1000, 35]] },
  { category: 'Letterhead & Envelope', items: [
    ['100 Alabaster (210×297)', 1000, 1150], ['80 GSM JK Finish (210×285)', 1000, 1050], ['100 GSM JK (210×297)', 1000, 1400],
    ['80 GSM JK Finish Front Back (210×285)', 1000, 1900], ['100 GSM Front Back (210×297)', 1000, 2200], ['100 Alabaster Front-Back (210×297)', 1000, 2350],
    ['9.5×4.25 Envelope 100 GSM', 1000, 1650], ['9.5×4.25 Envelope 100 Alabaster', 1000, 1400]
  ]},
  { category: 'Brochure', items: [['A4 Size Single Side', 1000, 2200], ['A4 Size Both Side without Lamination', 1000, 2500], ['A4 Both Side Lamination', 1000, 3300], ['A8 250 Terrable FB', 1000, 1250], ['A8 250 Lamination FB', 1000, 1650]] },
  { category: 'Sticker & Leaflet', items: [['Sticker without Lamination (80/90 sq.inch)', 1000, 28], ['Sticker with Lamination (80/90 sq.inch)', 1000, 35], ['A4 130 GSM Art Paper (S/S) F/B', 1000, 1900], ['A4 170 GSM Art Paper (S/S) F/B', 1000, 2100], ['9.5×4.25 Cover 170 GSM Art Paper', 1000, 2450]] },
  { category: 'Other Print Jobs', items: [['00 Printing Job Work', 1, 1800], ['Repeat File for Printing', 1, 0], ['Extra File Upload', 1, 0], ['500 Copy 80 GSM JK 2 Job', '500+500', 1700], ['500 Copy 100 GSM 2 Job', '500+500', 1900], ['320 GSM White Back Gloss Lamination', 3000, 30], ['Metallic Box 300GSM FB Dripoff', 3000, 65]] }
];

const Services = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Checkout Modal State
  const [activeCheckoutService, setActiveCheckoutService] = useState(null);
  const [requirements, setRequirements] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [cart, setCart] = useState(() => JSON.parse(sessionStorage.getItem('swapnaart-print-cart') || '[]'));
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    sessionStorage.setItem('swapnaart-print-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await axios.get('/api/services');
      setServices(res.data);
      setLoading(false);
    } catch (e) {
      console.error('Failed to load services', e);
      setLoading(false);
    }
  };

  const categories = ['All', 'Cards', 'Branding', 'Banners', 'Restaurant', 'Invitations', 'Printing'];

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || service.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login?redirect=/services');
      return;
    }

    if (!activeCheckoutService) return;

    setSubmittingOrder(true);
    setOrderError('');

    try {
      const formData = new FormData();
      formData.append('serviceId', activeCheckoutService._id || activeCheckoutService.id);
      formData.append('serviceTitle', activeCheckoutService.title);
      formData.append('requirements', requirements);
      formData.append('pricing', activeCheckoutService.minPrice);

      for (let i = 0; i < attachments.length; i++) {
        formData.append('attachments', attachments[i]);
      }

      await axios.post('/api/orders', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Trigger Confetti Celebration!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Reset Form and close modal
      setActiveCheckoutService(null);
      setRequirements('');
      setAttachments([]);
      if (activeCheckoutService.cartItems) setCart([]);
      
      // Redirect to Dashboard
      navigate('/dashboard');
    } catch (err) {
      setOrderError(err.response?.data?.message || 'Failed to submit order. Please check file formats.');
    } finally {
      setSubmittingOrder(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const addPrintItem = (category, item) => {
    const [title, quantity, price] = item;
    const id = `${category}-${title}`;
    setCart((current) => {
      const existing = current.find((entry) => entry.id === id);
      return existing
        ? current.map((entry) => entry.id === id ? { ...entry, count: entry.count + 1 } : entry)
        : [...current, { id, title, category, quantity, price, count: 1 }];
    });
    setCartOpen(true);
  };

  const updateCartCount = (id, delta) => {
    setCart((current) => current.flatMap((entry) => {
      if (entry.id !== id) return [entry];
      return entry.count + delta > 0 ? [{ ...entry, count: entry.count + delta }] : [];
    }));
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.count, 0);
  const startCartCheckout = () => {
    if (!user) return navigate('/login?redirect=/services');
    if (!cart.length) return;
    setActiveCheckoutService({
      id: 'print-catalog-order',
      title: `Print order — ${cart.length} item${cart.length === 1 ? '' : 's'}`,
      minPrice: cartTotal,
      cartItems: cart
    });
    setCartOpen(false);
  };

  return (
    <div className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-poppins">
      
      {/* Background blobs */}
      <div className="blob-container">
        <div className="blob blob-secondary" />
        <div className="blob blob-accent" />
      </div>

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
        <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 px-3 py-1 rounded-full text-primary text-xs font-semibold">
          <span>🛍️ Service Catalog</span>
        </div>
        <h1 className="text-4xl font-extrabold text-darkObsidian tracking-tight">Design & Printing Services</h1>
        <p className="text-xs sm:text-sm text-gray-500 font-inter leading-relaxed">
          Order custom-designed visiting cards, logo brand marks, store banners, brochures, and digital invitations.
        </p>
      </div>

      {/* Search & Categories Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 bg-white/70 backdrop-blur-md p-4 rounded-3xl border border-white/40 shadow-premium">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search designs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-10 pr-4 py-3 text-xs focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all font-inter"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                selectedCategory === cat
                  ? 'bg-primary text-white shadow-premium'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button onClick={() => setCartOpen(true)} className="relative shrink-0 flex items-center gap-2 rounded-2xl bg-darkObsidian px-4 py-3 text-xs font-bold text-white shadow-premium hover:bg-primary transition-colors">
          <ShoppingBag className="h-4 w-4" /> Print cart
          {cart.length > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-secondary px-1 text-[10px]">{cart.reduce((sum, item) => sum + item.count, 0)}</span>}
        </button>

      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="text-center py-20 text-xs text-gray-400">Loading catalog items...</div>
      ) : filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {filteredServices.map((service) => (
            <div
              key={service._id || service.id}
              className="group bg-white/80 backdrop-blur-md rounded-3xl p-6 border border-white/40 shadow-premium hover-card-premium flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Visual Header */}
                <div className="h-44 bg-gradient-to-tr from-primary/10 via-secondary/5 to-accent/10 rounded-2xl flex items-center justify-center text-4xl">
                  {service.category === 'Cards' ? '🎴' : 
                   service.category === 'Branding' ? '💎' :
                   service.category === 'Banners' ? '🖼️' :
                   service.category === 'Restaurant' ? '🍕' : '🎨'}
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{service.category}</span>
                  <h3 className="font-extrabold text-gray-800 text-base group-hover:text-primary transition-colors">{service.title}</h3>
                </div>

                <p className="text-xs text-gray-400 font-inter leading-relaxed line-clamp-3">{service.description}</p>

                {/* Features checklist */}
                <ul className="space-y-1 pt-2">
                  {service.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center space-x-2 text-[10px] text-gray-500 font-inter">
                      <Check className="w-3.5 h-3.5 text-green-500 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* Price Display */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                  <div className="text-left">
                    <p className="text-[9px] text-gray-400 font-inter">Starts at</p>
                    <p className="text-base font-extrabold text-secondary">₹{service.minPrice}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-gray-400 font-inter">Delivery</p>
                    <p className="text-xs font-bold text-gray-500">{service.deliveryTime}</p>
                  </div>
                </div>
              </div>

              {/* Order Button */}
              <button
                onClick={() => {
                  if (!user) {
                    navigate('/login?redirect=/services');
                  } else {
                    setActiveCheckoutService(service);
                  }
                }}
                className="w-full mt-6 bg-primary hover:bg-secondary text-white font-bold py-3.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all duration-300 shadow-premium hover:shadow-hoverGlow"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Order Now</span>
              </button>

            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white/40 rounded-3xl border border-gray-100 text-xs text-gray-400">
          No services match your filters. Try checking other categories.
        </div>
      )}

      {/* Quick-order rate card based on the supplied customer catalog. */}
      <section className="mt-20 text-left">
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Ready-to-print price list</span>
            <h2 className="mt-1 text-2xl font-extrabold text-darkObsidian">Print jobs, quantities & rates</h2>
            <p className="mt-1 text-xs text-gray-500">Choose a specification, add it to your cart, then upload the artwork at checkout.</p>
          </div>
          <button onClick={() => setCartOpen(true)} className="text-xs font-bold text-primary hover:text-secondary">View print cart →</button>
        </div>
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {printCatalog.map((group) => (
            <div key={group.category} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-premium">
              <div className="bg-gradient-to-r from-primary to-secondary px-5 py-3 text-white">
                <h3 className="text-sm font-extrabold">{group.category}</h3>
                {group.note && <p className="text-[10px] text-white/80">{group.note}</p>}
              </div>
              <div className="divide-y divide-gray-100">
                {group.items.map((item) => (
                  <div key={item[0]} className="flex items-center gap-2 px-4 py-3 hover:bg-primary/[0.02]">
                    <p className="min-w-0 flex-1 text-[11px] font-medium text-gray-700">{item[0]}</p>
                    <span className="w-16 text-center text-[10px] text-gray-400">{item[1]} copies</span>
                    <span className="w-16 text-right text-xs font-extrabold text-darkObsidian">₹{item[2]}</span>
                    <button onClick={() => addPrintItem(group.category, item)} aria-label={`Add ${item[0]} to cart`} className="ml-1 rounded-lg bg-primary/10 p-2 text-primary hover:bg-primary hover:text-white"><Plus className="h-3.5 w-3.5" /></button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {cartOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end bg-black/40 backdrop-blur-sm" onClick={() => setCartOpen(false)}>
          <aside className="flex h-full w-full max-w-md flex-col bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-gray-100 pb-4"><div><p className="text-[10px] font-bold uppercase tracking-wider text-primary">Your selection</p><h2 className="text-lg font-extrabold text-gray-800">Print cart</h2></div><button onClick={() => setCartOpen(false)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"><X className="h-5 w-5" /></button></div>
            <div className="flex-1 space-y-3 overflow-y-auto py-5">
              {cart.length === 0 ? <div className="pt-16 text-center text-xs text-gray-400"><ShoppingBag className="mx-auto mb-3 h-8 w-8 text-gray-300" />Your print cart is empty.</div> : cart.map((item) => <div key={item.id} className="rounded-2xl border border-gray-100 p-4"><p className="text-[10px] font-bold uppercase text-primary">{item.category}</p><p className="mt-1 text-xs font-bold text-gray-800">{item.title}</p><div className="mt-3 flex items-center justify-between"><div className="flex items-center gap-2"><button onClick={() => updateCartCount(item.id, -1)} className="rounded-lg bg-gray-100 p-1.5"><Minus className="h-3 w-3" /></button><span className="w-4 text-center text-xs font-bold">{item.count}</span><button onClick={() => updateCartCount(item.id, 1)} className="rounded-lg bg-gray-100 p-1.5"><Plus className="h-3 w-3" /></button></div><span className="text-sm font-extrabold text-secondary">₹{item.price * item.count}</span></div></div>)}
            </div>
            <div className="border-t border-gray-100 pt-4"><div className="mb-4 flex justify-between text-sm font-extrabold text-gray-800"><span>Estimated total</span><span>₹{cartTotal.toLocaleString('en-IN')}</span></div><button disabled={!cart.length} onClick={startCartCheckout} className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-xs font-bold text-white shadow-premium disabled:cursor-not-allowed disabled:opacity-40"><PackageCheck className="h-4 w-4" />Continue to artwork upload</button></div>
          </aside>
        </div>
      )}

      {/* Checkout Requirements Modal */}
      {activeCheckoutService && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white flex justify-between items-center text-left">
              <div>
                <p className="text-[10px] text-white/80 font-bold uppercase tracking-wider">Checkout Order Requirements</p>
                <h3 className="font-bold text-lg">{activeCheckoutService.title}</h3>
              </div>
              <button 
                onClick={() => {
                  setActiveCheckoutService(null);
                  setRequirements('');
                  setAttachments([]);
                  setOrderError('');
                }}
                className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleOrderSubmit} className="p-6 space-y-6 text-left">
              
              <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 flex justify-between items-center text-xs">
                <span className="font-medium text-gray-600">Base Project Price</span>
                <span className="font-extrabold text-primary text-sm">₹{activeCheckoutService.minPrice}</span>
              </div>

              {activeCheckoutService.cartItems && <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 text-xs"><p className="mb-2 font-bold text-gray-700">Selected print specifications</p><div className="space-y-1.5">{activeCheckoutService.cartItems.map((item) => <div key={item.id} className="flex justify-between text-[10px] text-gray-500"><span>{item.count}× {item.title}</span><span>₹{item.price * item.count}</span></div>)}</div></div>}

              {/* Requirements text */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Design Brief & Text details</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Enter print notes, delivery address, colors, finishing preferences, or business detail guidelines..."
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-xs focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all font-inter"
                />
              </div>

              {/* Upload files */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700">Reference Images or Brand Logos (Optional)</label>
                
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-primary transition-colors cursor-pointer relative bg-gray-50/50">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-gray-600">Drag & drop files or click to upload</p>
                  <p className="text-[10px] text-gray-400 mt-1">Accepts PNG, JPG, PDF, ZIP (Max 50MB total)</p>
                </div>

                {attachments.length > 0 && (
                  <div className="bg-gray-50 p-3 rounded-xl space-y-1">
                    <p className="text-[10px] font-bold text-gray-500">Selected Files:</p>
                    {attachments.map((file, idx) => (
                      <p key={idx} className="text-[10px] text-gray-600 truncate">{file.name} ({Math.round(file.size / 1024)} KB)</p>
                    ))}
                  </div>
                )}
              </div>

              {orderError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl flex items-center space-x-2 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{orderError}</span>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submittingOrder}
                className="w-full bg-primary hover:bg-secondary text-white font-bold py-3.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-premium hover:shadow-hoverGlow disabled:opacity-50"
              >
                <span>{submittingOrder ? 'Submitting Brief...' : 'Confirm Order & Place Request'}</span>
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Services;
