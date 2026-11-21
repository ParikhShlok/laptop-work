import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import axios from 'axios';
import { 
  ShoppingBag, Users, DollarSign, MessageSquare, Plus, Edit, Trash2, 
  Upload, CheckCircle, RefreshCcw, Send, Settings, UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

const AdminPanel = () => {
  const { user } = useAuth();
  const socket = useSocket();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'services', 'chats'
  
  // Dashboard Analytics
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalOrders: 0,
    revenue: 0,
    pending: 0,
    completed: 0
  });

  // Services Editor State
  const [editingService, setEditingService] = useState(null);
  const [serviceTitle, setServiceTitle] = useState('');
  const [serviceDesc, setServiceDesc] = useState('');
  const [serviceMinPrice, setServiceMinPrice] = useState(500);
  const [serviceMaxPrice, setServiceMaxPrice] = useState(5000);
  const [serviceCategory, setServiceCategory] = useState('Cards');
  const [serviceDelivery, setServiceDelivery] = useState('2 Days');
  const [serviceFeatures, setServiceFeatures] = useState('');

  // Active Selected Order
  const [activeOrder, setActiveOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState('');
  const [finalFiles, setFinalFiles] = useState([]);
  const [uploadingFinal, setUploadingFinal] = useState(false);

  // Chat Desk State
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [adminInput, setAdminInput] = useState('');
  const [contactTyping, setContactTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  useEffect(() => {
    if (activeTab === 'chats') {
      fetchChatContacts();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeContact) {
      fetchContactHistory(activeContact.id);
    }
  }, [activeContact]);

  useEffect(() => {
    if (socket) {
      // Incoming message listener for admin
      socket.on('receive_message', (message) => {
        // If message is from current active contact, append to messages
        if (activeContact && message.sender === activeContact.id) {
          setChatMessages((prev) => [...prev, message]);
          scrollToChatBottom();
        }
        // Update contact list sidebar
        fetchChatContacts();
      });

      socket.on('user_typing', (data) => {
        if (activeContact && data.sender === activeContact.id) {
          setContactTyping(data.isTyping);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('receive_message');
        socket.off('user_typing');
      }
    };
  }, [socket, activeContact]);

  const fetchAdminData = async () => {
    try {
      const ordersRes = await axios.get('/api/orders');
      const servicesRes = await axios.get('/api/services');
      
      setOrders(ordersRes.data);
      setServices(servicesRes.data);
      
      // Calculate Analytics stats
      const total = ordersRes.data.length;
      const completed = ordersRes.data.filter(o => o.status === 'completed' || o.status === 'delivered').length;
      const pending = total - completed;
      const rev = ordersRes.data
        .filter(o => o.paymentStatus === 'paid' || o.status === 'completed')
        .reduce((sum, o) => sum + (o.pricing || 0), 0);

      setAnalytics({ totalOrders: total, revenue: rev, pending, completed });
      
      if (ordersRes.data.length > 0 && !activeOrder) {
        setActiveOrder(ordersRes.data[0]);
        setOrderStatus(ordersRes.data[0].status);
      }
    } catch (e) {
      console.error('Failed to load admin analytics');
    }
  };

  const handleUpdateStatus = async (id) => {
    try {
      const res = await axios.put(`/api/orders/${id}/status`, { status: orderStatus });
      fetchAdminData();
      alert(`Order status updated to: ${orderStatus.toUpperCase()}`);
    } catch (e) {
      alert('Failed to update status.');
    }
  };

  const handleFinalUpload = async (e, id) => {
    e.preventDefault();
    if (finalFiles.length === 0) return;
    setUploadingFinal(true);

    try {
      const formData = new FormData();
      for (let i = 0; i < finalFiles.length; i++) {
        formData.append('finalFiles', finalFiles[i]);
      }

      await axios.post(`/api/orders/${id}/upload-final`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      confetti({ particleCount: 50 });
      fetchAdminData();
      alert('Final deliverable files uploaded successfully! Status set to completed.');
      setFinalFiles([]);
    } catch (e) {
      alert('Upload failed.');
    } finally {
      setUploadingFinal(false);
    }
  };

  // Chat Desk Methods
  const fetchChatContacts = async () => {
    try {
      const res = await axios.get('/api/chat/contacts');
      setContacts(res.data);
      if (res.data.length > 0 && !activeContact) {
        setActiveContact(res.data[0]);
      }
    } catch (e) {
      console.error('Failed to load contacts');
    }
  };

  const fetchContactHistory = async (contactId) => {
    try {
      const res = await axios.get(`/api/chat?recipientId=${contactId}`);
      setChatMessages(res.data);
      scrollToChatBottom();
    } catch (e) {
      console.error('Failed to load history');
    }
  };

  const handleAdminSend = (e) => {
    e.preventDefault();
    if (!adminInput.trim() || !socket || !activeContact || !user) return;

    const payload = {
      sender: user.id,
      recipient: activeContact.id,
      message: adminInput,
      type: 'text',
      attachments: []
    };

    socket.emit('send_message', payload);

    // Optimistic local add
    const optMsg = {
      _id: Math.random().toString(),
      sender: user.id,
      recipient: activeContact.id,
      message: adminInput,
      createdAt: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, optMsg]);
    setAdminInput('');
    scrollToChatBottom();
  };

  const scrollToChatBottom = () => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Service CRUD Methods
  const handleSaveService = async (e) => {
    e.preventDefault();
    const payload = {
      title: serviceTitle,
      description: serviceDesc,
      minPrice: serviceMinPrice,
      maxPrice: serviceMaxPrice,
      category: serviceCategory,
      deliveryTime: serviceDelivery,
      features: serviceFeatures.split(',').map(f => f.trim())
    };

    try {
      if (editingService) {
        await axios.put(`/api/services/${editingService._id || editingService.id}`, payload);
      } else {
        await axios.post('/api/services', payload);
      }
      setEditingService(null);
      setServiceTitle('');
      setServiceDesc('');
      setServiceMinPrice(500);
      setServiceMaxPrice(5000);
      setServiceFeatures('');
      fetchAdminData();
      alert('Service catalog entry updated successfully!');
    } catch (e) {
      alert('Failed to save service.');
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm('Delete this service permanently?')) return;
    try {
      await axios.delete(`/api/services/${id}`);
      fetchAdminData();
    } catch (e) {
      alert('Failed to delete service.');
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-poppins text-left">
      
      {/* Analytics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white rounded-3xl p-6 shadow-premium border border-gray-150 flex items-center space-x-4">
          <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-inter">Total Orders</p>
            <h2 className="text-xl font-bold text-gray-800">{analytics.totalOrders}</h2>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-premium border border-gray-150 flex items-center space-x-4">
          <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-inter">Revenue</p>
            <h2 className="text-xl font-bold text-gray-800">₹{analytics.revenue}</h2>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-premium border border-gray-150 flex items-center space-x-4">
          <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center shrink-0">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-inter">Pending Tasks</p>
            <h2 className="text-xl font-bold text-gray-800">{analytics.pending}</h2>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-premium border border-gray-150 flex items-center space-x-4">
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-inter">Completed</p>
            <h2 className="text-xl font-bold text-gray-800">{analytics.completed}</h2>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8 space-x-6">
        <button 
          onClick={() => setActiveTab('orders')}
          className={`pb-3 text-xs font-bold transition-all ${activeTab === 'orders' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}
        >
          Customer Orders
        </button>
        <button 
          onClick={() => setActiveTab('services')}
          className={`pb-3 text-xs font-bold transition-all ${activeTab === 'services' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}
        >
          Services Manager
        </button>
        <button 
          onClick={() => setActiveTab('chats')}
          className={`pb-3 text-xs font-bold transition-all ${activeTab === 'chats' ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}
        >
          Live Chat Desk
        </button>
      </div>

      {/* Active View renders */}
      {activeTab === 'orders' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order list column */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-premium border border-gray-50 space-y-4">
            <h3 className="font-extrabold text-gray-800 text-sm">Design Pipeline Orders</h3>
            
            {orders.length === 0 ? (
              <p className="text-xs text-gray-400">No client orders found.</p>
            ) : (
              <div className="space-y-3">
                {orders.map((o) => (
                  <button
                    key={o._id || o.id}
                    onClick={() => {
                      setActiveOrder(o);
                      setOrderStatus(o.status);
                    }}
                    className={`w-full p-4 rounded-2xl border text-left flex justify-between items-center transition-all ${
                      activeOrder?._id === o._id || activeOrder?.id === o.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-150 hover:bg-gray-50'
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-xs text-gray-800">{o.serviceTitle}</h4>
                      <p className="text-[10px] text-gray-400 font-inter">Customer ID: {o.customer.substring(0, 8)}...</p>
                    </div>

                    <div className="text-right space-y-1">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-gray-100 text-gray-600 capitalize">
                        {o.status}
                      </span>
                      <p className="text-[10px] font-extrabold text-primary">₹{o.pricing}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Active Order Details status modifier */}
          {activeOrder && (
            <div className="lg:col-span-1 bg-white rounded-3xl p-6 shadow-premium border border-gray-50 space-y-6">
              <h3 className="font-extrabold text-gray-800 text-sm">Order Status Action</h3>

              <div>
                <p className="text-[10px] text-gray-400 font-inter uppercase">Project Type</p>
                <h4 className="font-bold text-xs text-gray-700">{activeOrder.serviceTitle}</h4>
              </div>

              {/* Status Select dropdown */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-600">Update Status Stage</label>
                <select
                  value={orderStatus}
                  onChange={(e) => setOrderStatus(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:bg-white"
                >
                  <option value="pending">Pending</option>
                  <option value="designing">Designing</option>
                  <option value="revision">Revision</option>
                  <option value="printing">Printing</option>
                  <option value="completed">Completed</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button
                  onClick={() => handleUpdateStatus(activeOrder._id || activeOrder.id)}
                  className="w-full bg-primary hover:bg-secondary text-white font-bold py-2 rounded-xl text-[10px] shadow-sm transition-colors"
                >
                  Apply Status Change
                </button>
              </div>

              {/* Final file upload form */}
              <form 
                onSubmit={(e) => handleFinalUpload(e, activeOrder._id || activeOrder.id)}
                className="pt-6 border-t border-gray-100 space-y-4"
              >
                <label className="text-[10px] font-bold text-gray-600 block">Deliver Completed Files</label>
                
                <div className="border border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer relative bg-gray-50/50 hover:bg-gray-50">
                  <input
                    type="file"
                    multiple
                    onChange={(e) => setFinalFiles(Array.from(e.target.files))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                  <span className="text-[9px] font-bold text-gray-500">Click to add vector files (AI, PDF, ZIP)</span>
                </div>

                {finalFiles.length > 0 && (
                  <div className="bg-gray-50 p-2 rounded-lg text-[9px] text-gray-600 font-inter truncate">
                    {finalFiles.map((file, idx) => (
                      <p key={idx}>{file.name}</p>
                    ))}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={uploadingFinal}
                  className="w-full bg-secondary hover:bg-primary text-white font-bold py-2.5 rounded-xl text-[10px] transition-colors"
                >
                  {uploadingFinal ? 'Uploading Handoff...' : 'Upload Handoff & Complete'}
                </button>
              </form>

            </div>
          )}
        </div>
      )}

      {/* Services CRUD Manager */}
      {activeTab === 'services' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Services Editor Form */}
          <div className="lg:col-span-1 bg-white rounded-3xl p-6 shadow-premium border border-gray-100">
            <h3 className="font-extrabold text-gray-800 text-sm mb-4">
              {editingService ? 'Modify Service Card' : 'Add New Service Card'}
            </h3>
            
            <form onSubmit={handleSaveService} className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600">Service Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flex Banner Printing"
                  value={serviceTitle}
                  onChange={(e) => setServiceTitle(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-150 rounded-xl px-3 py-2.5 text-xs outline-none focus:bg-white font-inter"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600">Description</label>
                <textarea
                  required
                  placeholder="Service description..."
                  value={serviceDesc}
                  onChange={(e) => setServiceDesc(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-150 rounded-xl px-3 py-2.5 text-xs outline-none focus:bg-white font-inter"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600">Min Price (₹)</label>
                  <input
                    type="number"
                    value={serviceMinPrice}
                    onChange={(e) => setServiceMinPrice(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-155 rounded-xl px-3 py-2 text-xs font-inter"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600">Max Price (₹)</label>
                  <input
                    type="number"
                    value={serviceMaxPrice}
                    onChange={(e) => setServiceMaxPrice(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-155 rounded-xl px-3 py-2 text-xs font-inter"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600">Category</label>
                  <select
                    value={serviceCategory}
                    onChange={(e) => setServiceCategory(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-150 rounded-xl px-3 py-2 text-xs outline-none focus:bg-white"
                  >
                    <option value="Cards">Cards</option>
                    <option value="Branding">Branding</option>
                    <option value="Banners">Banners</option>
                    <option value="Restaurant">Restaurant</option>
                    <option value="Invitations">Invitations</option>
                    <option value="Printing">Printing</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600">Delivery Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 2 Days"
                    value={serviceDelivery}
                    onChange={(e) => setServiceDelivery(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-155 rounded-xl px-3 py-2 text-xs font-inter"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600">Features Checklist (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Double-sided, Gloss finish"
                  value={serviceFeatures}
                  onChange={(e) => setServiceFeatures(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-150 rounded-xl px-3 py-2 text-xs font-inter"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-secondary text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-premium"
              >
                {editingService ? 'Save Card Changes' : 'Create Service Entry'}
              </button>
              
              {editingService && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingService(null);
                    setServiceTitle('');
                    setServiceDesc('');
                    setServiceFeatures('');
                  }}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 rounded-xl text-[10px]"
                >
                  Cancel Edit Mode
                </button>
              )}

            </form>
          </div>

          {/* Catalog grid */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-premium border border-gray-100 space-y-4">
            <h3 className="font-extrabold text-gray-800 text-sm">Services Listings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((item) => (
                <div key={item._id || item.id} className="p-4 border border-gray-150 rounded-2xl flex justify-between items-center text-left">
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs text-gray-800">{item.title}</h4>
                    <p className="text-[10px] text-gray-400 capitalize">{item.category} • ₹{item.minPrice}</p>
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => {
                        setEditingService(item);
                        setServiceTitle(item.title);
                        setServiceDesc(item.description);
                        setServiceMinPrice(item.minPrice);
                        setServiceMaxPrice(item.maxPrice);
                        setServiceCategory(item.category);
                        setServiceDelivery(item.deliveryTime);
                        setServiceFeatures(item.features.join(', '));
                      }}
                      className="p-2 hover:bg-primary/10 hover:text-primary rounded-lg text-gray-400 transition-all"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteService(item._id || item.id)}
                      className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg text-gray-400 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      )}

      {/* Admin Chat Desk */}
      {activeTab === 'chats' && (
        <div className="bg-white rounded-3xl shadow-premium border border-gray-100 overflow-hidden flex h-[600px]">
          
          {/* Customers list sidebar */}
          <div className="w-1/3 border-r border-gray-150 flex flex-col">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
              <h4 className="font-bold text-xs text-gray-800 text-left">Customer Chat Inbox</h4>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
              {contacts.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-10 font-inter">No customer chats yet.</p>
              ) : (
                contacts.map((c) => {
                  const isSel = activeContact?.id === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        setActiveContact(c);
                        setChatMessages([]);
                      }}
                      className={`w-full p-4 text-left flex justify-between items-start transition-all ${
                        isSel ? 'bg-primary/5 border-l-4 border-primary' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="space-y-1 max-w-[70%]">
                        <h5 className="font-bold text-xs text-gray-800 truncate">{c.name}</h5>
                        <p className="text-[10px] text-gray-400 truncate font-inter">{c.lastMessage || 'Open chat thread'}</p>
                      </div>
                      
                      {c.unreadCount > 0 && (
                        <span className="w-5 h-5 rounded-full bg-secondary text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                          {c.unreadCount}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Active chat thread */}
          <div className="w-2/3 flex flex-col h-full bg-gray-50/20">
            {activeContact ? (
              <>
                {/* Header */}
                <div className="p-4 border-b border-gray-100 bg-white flex justify-between items-center text-left">
                  <div>
                    <h4 className="font-bold text-xs text-gray-800">{activeContact.name}</h4>
                    <p className="text-[9px] text-gray-400 font-inter">{activeContact.email}</p>
                  </div>
                </div>

                {/* Messages list */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {chatMessages.map((msg) => {
                    const isOwn = msg.sender === user?.id;
                    return (
                      <div
                        key={msg._id || msg.id}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[75%] rounded-2xl p-3 text-xs leading-relaxed ${
                          isOwn 
                            ? 'bg-primary text-white rounded-tr-none' 
                            : 'bg-white text-gray-700 border border-gray-150 rounded-tl-none shadow-sm'
                        }`}>
                          <p className="font-inter">{msg.message}</p>
                          <span className={`text-[8px] block text-right mt-1.5 ${isOwn ? 'text-white/70' : 'text-gray-400'}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {contactTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white text-gray-400 text-[10px] px-3 py-1.5 rounded-full shadow-sm italic font-inter">
                        Customer is typing...
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input panel */}
                <form onSubmit={handleAdminSend} className="p-3 border-t border-gray-150 bg-white flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Type response..."
                    value={adminInput}
                    onChange={(e) => setAdminInput(e.target.value)}
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:bg-white focus:border-primary transition-all font-inter"
                  />
                  <button
                    type="submit"
                    className="bg-primary hover:bg-secondary text-white p-2.5 rounded-xl transition-all shadow-md shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-gray-400 font-inter">
                Select a customer contact thread from sidebar to begin chatting.
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};

export default AdminPanel;
