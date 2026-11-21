import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import axios from 'axios';
import { 
  ShoppingBag, MessageSquare, Download, Clock, DollarSign, Send, 
  FileText, CheckCircle2, RefreshCcw, Eye, Phone, Smile, WalletCards, CreditCard, ReceiptText
} from 'lucide-react';
import confetti from 'canvas-confetti';

const Dashboard = () => {
  const { user } = useAuth();
  const socket = useSocket();

  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Chat State
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [recipientTyping, setRecipientTyping] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [accountView, setAccountView] = useState('orders');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchOrders();
    fetchAdminDetails();
  }, []);

  useEffect(() => {
    if (socket) {
      // Listen for incoming chat messages
      socket.on('receive_message', (message) => {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();
      });

      // Listen for typing events
      socket.on('user_typing', (data) => {
        if (data.sender === adminUser?.id || data.sender === adminUser?._id) {
          setRecipientTyping(data.isTyping);
        }
      });

      // Listen for order updates
      socket.on('order_status_updated', (data) => {
        fetchOrders();
        // Notify customer
        alert(`Order "${data.serviceTitle}" status updated to: ${data.status.toUpperCase()}`);
      });

      socket.on('order_completed', (data) => {
        fetchOrders();
        confetti({ particleCount: 50 });
        alert(`🎉 Your order "${data.serviceTitle}" is completed! Check the downloads section.`);
      });
    }

    return () => {
      if (socket) {
        socket.off('receive_message');
        socket.off('user_typing');
        socket.off('order_status_updated');
        socket.off('order_completed');
      }
    };
  }, [socket, adminUser]);

  useEffect(() => {
    if (selectedOrder) {
      fetchChatHistory();
    }
  }, [selectedOrder]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/orders');
      setOrders(res.data);
      if (res.data.length > 0 && !selectedOrder) {
        setSelectedOrder(res.data[0]);
      }
      setLoadingOrders(false);
    } catch (e) {
      console.error('Failed to load orders', e);
      setLoadingOrders(false);
    }
  };

  const fetchAdminDetails = async () => {
    try {
      // For customer, recipient is admin. Find admin email/details
      const res = await axios.post('/api/auth/seed'); // Just to trigger/check seed if needed, but normally we search contacts
      // Get chat contacts (admin just fetches user, customer fetches admin contacts)
      // For simplicity, we can fetch messages with recipientId = admin. In seed we created a default admin at admin@swapnaart.com.
      // Let's seed or load default admin.
    } catch (e) {}
  };

  const fetchChatHistory = async () => {
    try {
      const res = await axios.get('/api/chat');
      setMessages(res.data);
      scrollToBottom();
    } catch (e) {
      console.error('Failed to load chat logs');
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !socket || !user) return;

    const messagePayload = {
      sender: user.id,
      recipient: 'admin_placeholder_id', // Express backend automatically routes to first admin if customer sends to placeholder
      message: inputText,
      type: 'text',
      attachments: [],
      order: selectedOrder?._id || selectedOrder?.id || null
    };

    // Emit event
    socket.emit('send_message', messagePayload);
    
    // Optimistic message receipt
    const optimisticMessage = {
      _id: Math.random().toString(),
      sender: user.id,
      recipient: 'admin',
      message: inputText,
      createdAt: new Date().toISOString(),
      read: false
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setInputText('');
    scrollToBottom();

    // Trigger typing stop
    socket.emit('typing', { sender: user.id, recipient: 'admin_placeholder_id', isTyping: false });
    setIsTyping(false);
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    
    if (!socket || !user) return;

    if (!isTyping) {
      setIsTyping(true);
      socket.emit('typing', { sender: user.id, recipient: 'admin_placeholder_id', isTyping: true });
    }

    // Debounce typing indicator
    const timeout = setTimeout(() => {
      socket.emit('typing', { sender: user.id, recipient: 'admin_placeholder_id', isTyping: false });
      setIsTyping(false);
    }, 2000);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Helper to draw progress stages
  const progressStages = ['pending', 'designing', 'revision', 'printing', 'completed'];
  const getStageIndex = (status) => progressStages.indexOf(status.toLowerCase());
  const totalPaid = orders.filter((order) => order.paymentStatus === 'paid').reduce((sum, order) => sum + Number(order.pricing || 0), 0);
  const totalPending = orders.filter((order) => order.paymentStatus !== 'paid').reduce((sum, order) => sum + Number(order.pricing || 0), 0);
  const walletBalance = Number(user?.walletBalance || 0);

  return (
    <div className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-poppins text-left">
      
      {/* Background Blobs */}
      <div className="blob-container">
        <div className="blob blob-primary" />
        <div className="blob blob-accent" />
      </div>

      <div className="mb-8 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">Customer account</p>
          <h1 className="mt-1 text-3xl font-extrabold text-gray-800">Hello, {user?.name?.split(' ')[0] || 'there'}</h1>
          <p className="text-xs text-gray-400 font-inter">Manage orders, payment records, downloads, and your creative desk conversation.</p>
        </div>
        <div className="flex rounded-2xl bg-white p-1.5 shadow-premium">
          <button onClick={() => setAccountView('orders')} className={`rounded-xl px-4 py-2.5 text-xs font-bold transition-colors ${accountView === 'orders' ? 'bg-primary text-white' : 'text-gray-500 hover:text-primary'}`}>Orders & workspace</button>
          <button onClick={() => setAccountView('payments')} className={`rounded-xl px-4 py-2.5 text-xs font-bold transition-colors ${accountView === 'payments' ? 'bg-primary text-white' : 'text-gray-500 hover:text-primary'}`}>Payment history</button>
        </div>
      </div>

      {accountView === 'payments' ? (
        <section className="space-y-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="rounded-3xl bg-gradient-to-br from-primary to-secondary p-6 text-white shadow-premium"><WalletCards className="mb-6 h-6 w-6 text-white/80" /><p className="text-[10px] font-bold uppercase tracking-wider text-white/70">Wallet balance</p><p className="mt-1 text-2xl font-extrabold">₹{walletBalance.toLocaleString('en-IN')}</p><p className="mt-2 text-[10px] text-white/75">Credit available for future print orders</p></div>
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-premium"><CheckCircle2 className="mb-6 h-6 w-6 text-green-500" /><p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Paid to date</p><p className="mt-1 text-2xl font-extrabold text-gray-800">₹{totalPaid.toLocaleString('en-IN')}</p><p className="mt-2 text-[10px] text-gray-400">Approved payment records</p></div>
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-premium"><Clock className="mb-6 h-6 w-6 text-amber-500" /><p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Awaiting payment</p><p className="mt-1 text-2xl font-extrabold text-gray-800">₹{totalPending.toLocaleString('en-IN')}</p><p className="mt-2 text-[10px] text-gray-400">Final amount confirmed after artwork review</p></div>
          </div>
          <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-premium"><div className="flex items-center gap-3 border-b border-gray-100 p-6"><ReceiptText className="h-5 w-5 text-primary" /><div><h2 className="text-sm font-extrabold text-gray-800">Payment ledger</h2><p className="text-[10px] text-gray-400">A complete record of the payments linked to your print and design orders.</p></div></div><div className="overflow-x-auto"><table className="w-full min-w-[640px] text-left"><thead className="bg-gray-50 text-[10px] uppercase tracking-wider text-gray-400"><tr><th className="px-6 py-4">Invoice</th><th className="px-6 py-4">Date</th><th className="px-6 py-4">Order</th><th className="px-6 py-4 text-right">Amount</th><th className="px-6 py-4">Status</th></tr></thead><tbody className="divide-y divide-gray-100">{orders.length ? orders.map((order) => <tr key={order._id || order.id} className="text-xs"><td className="px-6 py-4 font-bold text-gray-700">{order.invoiceNumber || 'SA-PENDING'}</td><td className="px-6 py-4 text-gray-500">{order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : '—'}</td><td className="px-6 py-4 text-gray-600">{order.serviceTitle}</td><td className="px-6 py-4 text-right font-extrabold text-gray-800">₹{Number(order.pricing || 0).toLocaleString('en-IN')}</td><td className="px-6 py-4"><span className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>{order.paymentStatus || 'pending'}</span></td></tr>) : <tr><td colSpan="5" className="px-6 py-12 text-center text-xs text-gray-400">No payment records yet. Your order payments will appear here.</td></tr>}</tbody></table></div></div>
        </section>
      ) : (

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Orders Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Order Selector List */}
          <div className="bg-white rounded-3xl p-6 shadow-premium border border-gray-100">
            <h3 className="font-extrabold text-gray-800 text-sm mb-4">My Placed Orders</h3>
            
            {loadingOrders ? (
              <p className="text-xs text-gray-400 py-6">Retrieving order lists...</p>
            ) : orders.length === 0 ? (
              <div className="text-center py-8 text-xs text-gray-400 space-y-2">
                <ShoppingBag className="w-8 h-8 mx-auto text-gray-300" />
                <p>No orders placed yet. Check our catalog page to buy.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <button
                    key={order._id || order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`w-full p-4 rounded-2xl border text-left flex justify-between items-center transition-all ${
                      selectedOrder?._id === order._id || selectedOrder?.id === order.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-150 hover:bg-gray-50'
                    }`}
                  >
                    <div className="space-y-1">
                      <h4 className="font-bold text-xs text-gray-800">{order.serviceTitle}</h4>
                      <p className="text-[10px] text-gray-400 font-inter">Invoice: {order.invoiceNumber || 'SA-PENDING'}</p>
                    </div>

                    <div className="text-right space-y-1">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[9px] font-bold uppercase ${
                        order.status === 'completed' || order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                        order.status === 'designing' || order.status === 'revision' ? 'bg-blue-100 text-blue-600' :
                        'bg-yellow-100 text-yellow-600'
                      }`}>
                        {order.status}
                      </span>
                      <p className="text-[10px] font-extrabold text-primary">₹{order.pricing}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Active Order Details & Timeline tracker */}
          {selectedOrder && (
            <div className="bg-white rounded-3xl p-6 shadow-premium border border-gray-50 space-y-8">
              
              {/* Info Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-gray-100">
                <div>
                  <span className="text-[9px] font-bold text-primary uppercase tracking-wider">Active Workspace</span>
                  <h3 className="font-extrabold text-gray-800 text-lg">{selectedOrder.serviceTitle}</h3>
                  <p className="text-[10px] text-gray-400 font-inter">Placed: {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                </div>
                
                {/* Print Invoice trigger */}
                <button
                  onClick={() => window.print()}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-4 rounded-xl text-[10px] font-bold flex items-center space-x-1.5 transition-colors"
                >
                  <FileText className="w-4 h-4 text-primary" />
                  <span>Print invoice</span>
                </button>
              </div>

              {/* Progress Timeline Tracker */}
              <div className="space-y-4">
                <h4 className="font-bold text-gray-800 text-xs">Timeline Pipeline Progress</h4>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-4 px-2 bg-gray-50/50 rounded-2xl border border-gray-100 relative">
                  {progressStages.map((stage, idx) => {
                    const currentIdx = getStageIndex(selectedOrder.status);
                    const isPassed = idx <= currentIdx;
                    return (
                      <div key={stage} className="flex items-center space-x-2 sm:space-x-1 sm:flex-col sm:w-1/5 text-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                          isPassed ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                        }`}>
                          {idx + 1}
                        </div>
                        <span className={`text-[10px] font-bold capitalize ${isPassed ? 'text-primary' : 'text-gray-400'}`}>
                          {stage}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Customer design brief details */}
              <div className="space-y-2">
                <h4 className="font-bold text-gray-800 text-xs font-poppins">Submitted Requirements Brief</h4>
                <div className="bg-gray-50 rounded-2xl p-4 text-xs text-gray-500 font-inter leading-relaxed whitespace-pre-line">
                  {selectedOrder.requirements || 'No details provided.'}
                </div>
              </div>

              {/* Uploaded briefs assets list */}
              {selectedOrder.attachments && selectedOrder.attachments.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-bold text-gray-800 text-xs">My Attached Assets</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedOrder.attachments.map((fileUrl, index) => (
                      <a
                        key={index}
                        href={fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 text-[10px] font-bold text-gray-600 flex items-center space-x-1.5 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-primary" />
                        <span>Brief attachment-{index + 1}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Handoff final deliverables files download */}
              {selectedOrder.finalFiles && selectedOrder.finalFiles.length > 0 ? (
                <div className="bg-green-50 rounded-3xl p-6 border border-green-100 space-y-4">
                  <div className="flex items-center space-x-2 text-green-700">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <h4 className="font-bold text-sm">Final Design Deliverables Uploaded!</h4>
                  </div>
                  <p className="text-[10px] text-green-600 font-inter leading-relaxed">
                    Our designers have attached the ready offset printing/vector files. Click to download them below:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedOrder.finalFiles.map((fileUrl, idx) => (
                      <a
                        key={idx}
                        href={fileUrl}
                        download
                        target="_blank"
                        rel="noreferrer"
                        className="bg-white hover:bg-green-100 border border-green-200 text-green-700 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 transition-all shadow-sm"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download file-{idx + 1}</span>
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 rounded-3xl p-6 border border-yellow-100 text-yellow-700 flex items-center space-x-3 text-xs">
                  <Clock className="w-5 h-5 shrink-0 text-yellow-600" />
                  <div>
                    <p className="font-bold">Designing under progress...</p>
                    <p className="text-[10px] text-yellow-600/80 font-inter">Once files are completed, download vectors here.</p>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Live Chat Column */}
        <div className="lg:col-span-1">
          
          <div className="bg-white rounded-3xl shadow-premium border border-gray-100 overflow-hidden flex flex-col h-[580px]">
            
            {/* Header info */}
            <div className="bg-gradient-to-r from-primary to-secondary p-4 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-lg">👨‍🎨</div>
                <div className="text-left">
                  <h4 className="font-bold text-xs">SWAPNAART Creative Desk</h4>
                  <p className="text-[9px] text-white/80 font-inter">Typically responds in minutes</p>
                </div>
              </div>
            </div>

            {/* Message lists */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
              {messages.length === 0 ? (
                <div className="text-center py-20 text-xs text-gray-400 font-inter space-y-1">
                  <MessageSquare className="w-6 h-6 mx-auto text-gray-300 mb-2" />
                  <p>Start a conversation with admin</p>
                  <p className="text-[10px]">Discuss colors, text layouts, or revisions</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isOwn = msg.sender === user?.id;
                  return (
                    <div
                      key={msg._id || msg.id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[75%] rounded-2xl p-3 text-xs leading-relaxed ${
                        isOwn 
                          ? 'bg-primary text-white rounded-tr-none' 
                          : 'bg-white text-gray-700 shadow-sm border border-gray-150 rounded-tl-none'
                      }`}>
                        <p className="font-inter">{msg.message}</p>
                        <span className={`text-[8px] block text-right mt-1.5 ${isOwn ? 'text-white/70' : 'text-gray-400'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              {recipientTyping && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-400 text-[10px] px-3 py-1.5 rounded-full shadow-sm italic font-inter">
                    Designer is typing...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input form */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-100 flex items-center space-x-2">
              <input
                type="text"
                placeholder="Type messages..."
                value={inputText}
                onChange={handleInputChange}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:bg-white focus:border-primary transition-all font-inter"
              />
              <button
                type="submit"
                className="bg-primary hover:bg-secondary text-white p-2.5 rounded-xl transition-all shadow-md shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>

        </div>

      </div>
      )}

    </div>
  );
};

export default Dashboard;
