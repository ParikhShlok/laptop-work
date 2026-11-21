import React, { useState } from 'react';
import { 
  Users, 
  Briefcase, 
  Settings, 
  ShieldAlert, 
  Play, 
  Activity, 
  RotateCw
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [scraping, setScraping] = useState(false);
  const [training, setTraining] = useState(false);

  const stats = {
    totalUsers: 142,
    jobsScraped: 8520,
    activeModels: 3,
    errorLogs: 0,
  };

  const users = [
    { id: 1, name: 'Alice Smith', email: 'alice@example.com', role: 'Student', resumeUploaded: true },
    { id: 2, name: 'Bob Johnson', email: 'bob@example.com', role: 'Student', resumeUploaded: false },
    { id: 3, name: 'Charlie Admin', email: 'admin@careerintel.com', role: 'Admin', resumeUploaded: false },
  ];

  const handleRunScraper = () => {
    setScraping(true);
    setTimeout(() => setScraping(false), 3000);
  };

  const handleTrainModels = () => {
    setTraining(true);
    setTimeout(() => setTraining(false), 4000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Admin Moderation Dashboard</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Perform administrative controls, monitor machine learning models, trigger scrapers, and review accounts.
        </p>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-850 p-6 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold">Total Accounts</p>
            <h4 className="text-2xl font-extrabold mt-1">{stats.totalUsers}</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-850 p-6 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
            <Briefcase className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold">Scraped Listings</p>
            <h4 className="text-2xl font-extrabold mt-1">{stats.jobsScraped}</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-850 p-6 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
            <Settings className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold">Active ML Models</p>
            <h4 className="text-2xl font-extrabold mt-1">{stats.activeModels}</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-850 p-6 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-red-500/10 text-red-500 rounded-xl">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold">System Errors</p>
            <h4 className="text-2xl font-extrabold mt-1">{stats.errorLogs}</h4>
          </div>
        </div>
      </div>

      {/* Admin Action Triggers */}
      <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-850 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-4">Operations Engine</h3>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleRunScraper}
            disabled={scraping}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-6 rounded-lg text-sm transition-all disabled:opacity-50"
          >
            {scraping ? (
              <>
                <RotateCw className="h-4.5 w-4.5 animate-spin" /> Scraping Jobs...
              </>
            ) : (
              <>
                <Play className="h-4.5 w-4.5" /> Trigger Job Scraper
              </>
            )}
          </button>
          <button
            onClick={handleTrainModels}
            disabled={training}
            className="inline-flex items-center gap-2 bg-slate-200/50 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-850 dark:text-slate-200 font-semibold py-2.5 px-6 rounded-lg text-sm transition-all disabled:opacity-50"
          >
            {training ? (
              <>
                <Activity className="h-4.5 w-4.5 animate-spin text-emerald-500" /> Training Models...
              </>
            ) : (
              <>
                <Activity className="h-4.5 w-4.5" /> Re-Train ML Models
              </>
            )}
          </button>
        </div>
      </div>

      {/* Users moderation list */}
      <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-850 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-200 dark:border-slate-850">
          <h3 className="text-lg font-bold">User Registrations</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-850">
            <thead className="bg-slate-50 dark:bg-dark-950/20">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Resume Attached</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-dark-950/10">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">{u.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{u.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      u.role === 'Admin' ? 'bg-red-500/10 text-red-500' : 'bg-slate-250/50 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{u.resumeUploaded ? '✓ Yes' : '✕ No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
