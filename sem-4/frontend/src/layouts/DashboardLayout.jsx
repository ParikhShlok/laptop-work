import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard,
  UploadCloud,
  Layers,
  GraduationCap,
  MessageSquare,
  User,
  ShieldCheck,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  Cpu,
  ArrowLeftRight
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Resume Upload', href: '/upload', icon: UploadCloud },
    { name: 'Job Matching', href: '/jobs', icon: ArrowLeftRight },
    { name: 'Learning Center', href: '/learning', icon: GraduationCap },
    { name: 'AI Career Coach', href: '/coach', icon: MessageSquare },
    { name: 'User Profile', href: '/profile', icon: User },
  ];

  if (user?.is_staff || user?.is_superuser) {
    navigation.push({ name: 'Admin Dashboard', href: '/admin', icon: ShieldCheck });
  }

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-dark-950 dark:text-slate-100 flex transition-colors duration-200">
      
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 shrink-0 border-r border-slate-200 dark:border-slate-850 bg-white dark:bg-dark-900 sticky top-0 h-screen">
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-850 gap-3">
          <div className="bg-emerald-500 text-white p-1.5 rounded-lg">
            <Cpu className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-350 bg-clip-text text-transparent">
            CareerIntel AI
          </span>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className={`h-5 w-5 ${active ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Footer Profile in Sidebar */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-850 flex flex-col gap-2">
          <div className="flex items-center gap-3 px-2 py-1.5">
            <div className="h-9 w-9 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-450 font-bold flex items-center justify-center shrink-0 border border-emerald-500/25">
              {user?.username?.substring(0, 2).toUpperCase() || 'US'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold truncate text-slate-800 dark:text-slate-200">
                {user?.first_name ? `${user.first_name} ${user.last_name}` : user?.username}
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                {user?.email}
              </p>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/5 transition-all mt-1"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Drawer (Sidebar overlay) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-slate-900/60 backdrop-blur-sm transition-opacity">
          <div className="w-64 bg-white dark:bg-dark-900 h-full flex flex-col border-r border-slate-200 dark:border-slate-850 relative animate-slide-in">
            <button 
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="h-16 flex items-center px-6 border-b border-slate-200/50 dark:border-slate-800/80 gap-3">
              <div className="bg-emerald-500 text-white p-1.5 rounded-lg">
                <Cpu className="h-5 w-5" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-350 bg-clip-text text-transparent">
                CareerIntel AI
              </span>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto" onClick={() => setMobileOpen(false)}>
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${active ? 'text-emerald-500' : 'text-slate-400'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-200 dark:border-slate-850 flex flex-col gap-2">
              <div className="flex items-center gap-3 px-2 py-1.5">
                <div className="h-9 w-9 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-450 font-bold flex items-center justify-center shrink-0 border border-emerald-500/25">
                  {user?.username?.substring(0, 2).toUpperCase() || 'US'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold truncate text-slate-800 dark:text-slate-200">
                    {user?.first_name ? `${user.first_name} ${user.last_name}` : user?.username}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/5 transition-all"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Page Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-850 bg-white/70 dark:bg-dark-900/70 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-bold tracking-tight text-slate-850 dark:text-slate-100 capitalize">
              {navigation.find((item) => isActive(item.href))?.name || 'Overview'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750 transition-all"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="h-4.5 w-4.5 text-amber-400" /> : <Moon className="h-4.5 w-4.5" />}
            </button>
          </div>
        </header>

        {/* Content Box */}
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

    </div>
  );
}
