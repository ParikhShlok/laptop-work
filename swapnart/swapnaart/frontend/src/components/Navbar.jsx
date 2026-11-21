import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User as UserIcon, LogOut, ChevronDown, LayoutDashboard, PenTool, Globe } from 'lucide-react';

const Navbar = () => {
  const { user, logout, updateLanguage } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('English');

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const handleLangChange = (lang, label) => {
    setCurrentLang(label);
    updateLanguage(lang);
    setLangDropdownOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass-panel sticky top-0 w-full z-50 transition-all duration-300 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          {/* Logo with Creative typography and pen/brush icon */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary text-white shadow-premium group-hover:scale-105 transition-transform duration-300">
              <span className="font-montserrat font-bold text-lg">S</span>
              <div className="absolute -top-1 -right-1 text-xs">🎨</div>
            </div>
            <span className="font-montserrat font-extrabold text-2xl tracking-wider text-darkObsidian group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
              SWAPNA<span className="text-primary group-hover:text-secondary">ART</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`relative font-poppins font-medium text-sm transition-all duration-300 ${
                  isActive(item.path) 
                    ? 'text-primary' 
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                {item.name}
                {isActive(item.path) && (
                  <span className="absolute bottom-[-6px] left-0 w-full h-[3px] bg-gradient-to-r from-primary to-secondary rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Right Section: Language & User Profile */}
          <div className="hidden md:flex items-center space-x-4">
            
            {/* Multi Language Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setLangDropdownOpen(!langDropdownOpen);
                  setProfileDropdownOpen(false);
                }}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-600 font-medium text-xs transition-colors duration-200"
              >
                <Globe className="w-4 h-4 text-primary" />
                <span>{currentLang}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              
              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-36 rounded-xl bg-white border border-gray-100 shadow-premium p-1 z-50">
                  <button
                    onClick={() => handleLangChange('en', 'English')}
                    className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-primary/5 hover:text-primary rounded-lg transition-colors"
                  >
                    English
                  </button>
                  <button
                    onClick={() => handleLangChange('hi', 'हिन्दी (Hindi)')}
                    className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-primary/5 hover:text-primary rounded-lg transition-colors"
                  >
                    हिन्दी (Hindi)
                  </button>
                  <button
                    onClick={() => handleLangChange('gu', 'ગુજરાતી (Gujarati)')}
                    className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-primary/5 hover:text-primary rounded-lg transition-colors"
                  >
                    ગુજરાતી (Gujarati)
                  </button>
                </div>
              )}
            </div>

            {/* Auth Buttons */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(!profileDropdownOpen);
                    setLangDropdownOpen(false);
                  }}
                  className="flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-premium hover:shadow-hoverGlow hover:scale-[1.02] transition-all duration-300"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>{user.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white border border-gray-100 shadow-premium p-2 z-50">
                    <div className="px-3 py-2 border-b border-gray-100 mb-2">
                      <p className="font-bold text-xs text-gray-800">{user.name}</p>
                      <p className="text-[10px] text-gray-400 capitalize">{user.role}</p>
                    </div>
                    
                    <Link
                      to="/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg text-xs text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>My Dashboard</span>
                    </Link>

                    {user.role === 'admin' && (
                      <>
                        <Link
                          to="/admin"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center space-x-2 px-3 py-2 rounded-lg text-xs text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-secondary" />
                          <span className="font-semibold text-secondary">Admin Panel</span>
                        </Link>
                        
                        <Link
                          to="/design-tool"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center space-x-2 px-3 py-2 rounded-lg text-xs text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                        >
                          <PenTool className="w-4 h-4 text-accent" />
                          <span className="font-semibold text-primary">Design Canvas Tool</span>
                        </Link>
                      </>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                        navigate('/');
                      }}
                      className="w-full flex items-center space-x-2 px-3 py-2 mt-2 rounded-lg text-xs text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-white border border-gray-200 text-gray-700 px-5 py-2 rounded-xl text-xs font-semibold hover:border-primary hover:text-primary transition-all duration-300"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Quick dashboard for mobile user */}
            {user && (
              <Link to="/dashboard" className="text-primary p-2">
                <LayoutDashboard className="w-5 h-5" />
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-primary focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md px-4 pt-4 pb-6 space-y-3 z-50">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                isActive(item.path) 
                  ? 'bg-primary/5 text-primary' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
              }`}
            >
              {item.name}
            </Link>
          ))}
          
          <div className="border-t border-gray-100 pt-3 flex flex-col space-y-3">
            {/* Language Selection */}
            <div className="flex justify-between items-center px-3">
              <span className="text-xs text-gray-500">Language</span>
              <div className="flex space-x-2">
                <button onClick={() => handleLangChange('en', 'English')} className="text-xs font-bold text-primary">EN</button>
                <button onClick={() => handleLangChange('hi', 'हिन्दी')} className="text-xs font-bold text-gray-500">HI</button>
                <button onClick={() => handleLangChange('gu', 'ગુજરાતી')} className="text-xs font-bold text-gray-500">GU</button>
              </div>
            </div>

            {user ? (
              <>
                {user.role === 'admin' && (
                  <>
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-sm font-medium text-secondary hover:bg-secondary/5"
                    >
                      Admin Panel
                    </Link>
                    <Link
                      to="/design-tool"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-lg text-sm font-medium text-primary hover:bg-primary/5"
                    >
                      Design Canvas
                    </Link>
                  </>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                    navigate('/');
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center bg-primary text-white py-2 rounded-xl text-sm font-semibold hover:bg-secondary transition-all"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
