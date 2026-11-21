import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Mail, Lock, User, Phone, LogIn, ArrowRight, CheckCircle2, AlertCircle, MapPin, Building2, Hash } from 'lucide-react';
import confetti from 'canvas-confetti';

const Login = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [profile, setProfile] = useState({ username: '', address: '', city: '', pinCode: '', state: 'Gujarat', taxNumber: '' });
  
  const [authError, setAuthError] = useState('');
  const [seedingStatus, setSeedingStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);

    if (isLogin) {
      const res = await login(email, password);
      if (res.success) {
        confetti({ particleCount: 60, spread: 40 });
        navigate(redirectUrl);
      } else {
        setAuthError(res.message);
      }
    } else {
      const res = await register(name, email, password, phone, profile);
      if (res.success) {
        confetti({ particleCount: 60, spread: 40 });
        navigate(redirectUrl);
      } else {
        setAuthError(res.message);
      }
    }
    setLoading(false);
  };

  // Helper utility to seed mock records immediately
  const handleSeedDb = async () => {
    setSeedingStatus('Seeding database tables...');
    try {
      const res = await axios.post('/api/auth/seed');
      setSeedingStatus('✨ Database Seeded Successfully!');
      confetti({ particleCount: 80, spread: 50 });
      setTimeout(() => setSeedingStatus(''), 4000);
    } catch (e) {
      setSeedingStatus('Seeding failed or database already has records.');
      setTimeout(() => setSeedingStatus(''), 4000);
    }
  };

  const autofillCredentials = (role) => {
    if (role === 'admin') {
      setEmail('admin@swapnaart.com');
      setPassword('AdminPassword123');
    } else {
      setEmail('customer@swapnaart.com');
      setPassword('CustomerPassword123');
    }
  };

  return (
    <div className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center justify-center font-poppins min-h-[80vh]">
      
      {/* Backdrop */}
      <div className="blob-container">
        <div className="blob blob-primary" />
        <div className="blob blob-secondary" />
      </div>

      <div className="max-h-[85vh] overflow-y-auto bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-white/40 shadow-premium w-full max-w-md text-left space-y-6">
        
        {/* Toggle tabs */}
        <div className="flex border-b border-gray-100 pb-2">
          <button
            onClick={() => { setIsLogin(true); setAuthError(''); }}
            className={`w-1/2 pb-2 text-xs font-bold text-center transition-all ${isLogin ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsLogin(false); setAuthError(''); }}
            className={`w-1/2 pb-2 text-xs font-bold text-center transition-all ${!isLogin ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}
          >
            Register Account
          </button>
        </div>

        {/* Brand visual header */}
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-gray-800">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-[10px] text-gray-400 font-inter mt-1">
            {isLogin ? 'Login to check order status and download files' : 'Sign up to submit custom designs and request quotes'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {!isLogin && (
            <>
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-150 rounded-xl pl-10 pr-4 py-3 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary font-inter"
                  />
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1"><label className="text-[10px] font-bold text-gray-600">Username</label><div className="relative"><input type="text" required placeholder="Choose username" value={profile.username} onChange={(e) => setProfile({ ...profile, username: e.target.value })} className="w-full bg-gray-50 border border-gray-150 rounded-xl pl-10 pr-3 py-3 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-primary" /><User className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" /></div></div>
                <div className="space-y-1"><label className="text-[10px] font-bold text-gray-600">State</label><select value={profile.state} onChange={(e) => setProfile({ ...profile, state: e.target.value })} className="w-full bg-gray-50 border border-gray-150 rounded-xl px-3 py-3 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-primary"><option>Gujarat</option><option>Maharashtra</option><option>Rajasthan</option><option>Other</option></select></div>
              </div>

              <div className="space-y-1"><label className="text-[10px] font-bold text-gray-600">Address</label><div className="relative"><textarea required rows={2} placeholder="Business or delivery address" value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} className="w-full resize-none bg-gray-50 border border-gray-150 rounded-xl pl-10 pr-3 py-3 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-primary" /><MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" /></div></div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><label className="text-[10px] font-bold text-gray-600">City</label><div className="relative"><input type="text" required placeholder="City" value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} className="w-full bg-gray-50 border border-gray-150 rounded-xl pl-9 pr-3 py-3 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-primary" /><Building2 className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3.5" /></div></div>
                <div className="space-y-1"><label className="text-[10px] font-bold text-gray-600">Pin code</label><div className="relative"><input type="text" required inputMode="numeric" placeholder="Pin code" value={profile.pinCode} onChange={(e) => setProfile({ ...profile, pinCode: e.target.value })} className="w-full bg-gray-50 border border-gray-150 rounded-xl pl-9 pr-3 py-3 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-primary" /><Hash className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3.5" /></div></div>
              </div>

              <div className="space-y-1"><label className="text-[10px] font-bold text-gray-600">GST / Tax number <span className="font-normal text-gray-400">(optional)</span></label><input type="text" placeholder="Enter GST or tax number" value={profile.taxNumber} onChange={(e) => setProfile({ ...profile, taxNumber: e.target.value })} className="w-full bg-gray-50 border border-gray-150 rounded-xl px-4 py-3 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-primary" /></div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-600">Phone Number</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="Enter phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-150 rounded-xl pl-10 pr-4 py-3 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary font-inter"
                  />
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                </div>
              </div>
            </>
          )}

          {/* Email */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-600">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-150 rounded-xl pl-10 pr-4 py-3 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary font-inter"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-600">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-150 rounded-xl pl-10 pr-4 py-3 text-xs outline-none focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary font-inter"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
            </div>
          </div>

          {authError && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl flex items-center space-x-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-secondary text-white font-bold py-3.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-premium hover:shadow-hoverGlow"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Processing...' : isLogin ? 'Sign In' : 'Register Now'}</span>
          </button>

        </form>

        {/* Quick autofill helper boxes */}
        {isLogin && (
          <div className="pt-4 border-t border-gray-150 space-y-3">
            <p className="text-[9px] font-bold text-gray-400 text-center uppercase tracking-wider">Fast Test Credentials</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => autofillCredentials('admin')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-xl text-[10px] font-bold transition-colors"
              >
                Autofill Admin
              </button>
              <button
                onClick={() => autofillCredentials('customer')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-xl text-[10px] font-bold transition-colors"
              >
                Autofill Customer
              </button>
            </div>
          </div>
        )}

        {/* Database Seeder Button */}
        <div className="pt-4 border-t border-gray-100 text-center space-y-2">
          <button
            onClick={handleSeedDb}
            className="text-[10px] text-primary hover:text-secondary font-bold underline transition-colors"
          >
            Seeding Utility: Generate Sample Data & Test Accounts
          </button>
          {seedingStatus && (
            <p className="text-[10px] text-green-600 font-bold font-inter animate-pulse">{seedingStatus}</p>
          )}
        </div>

      </div>

    </div>
  );
};

export default Login;
