import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  FileText, 
  TrendingUp, 
  Sparkles, 
  DollarSign, 
  Briefcase, 
  AlertTriangle,
  GraduationCap
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  // Temporary mock data for design showcase
  const stats = {
    resumeScore: 82,
    atsScore: 78,
    employabilityScore: 85,
    recommendedRole: 'Software Engineer',
    salaryMin: '$75k',
    salaryExpected: '$90k',
    salaryMax: '$110k',
    matchingSkillsCount: 12,
    missingSkillsCount: 4,
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/5 dark:from-emerald-500/20 dark:to-teal-500/10 border border-emerald-500/20 dark:border-emerald-500/15 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            Hi, {user?.first_name || user?.username}! <Sparkles className="h-5 w-5 text-amber-500" />
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            Your profile matching scores are in. Upload a new resume to re-evaluate.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-all text-sm">
            Quick Scan Resume
          </button>
        </div>
      </div>

      {/* Main Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Resume Score */}
        <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-850 p-6 rounded-xl relative overflow-hidden group shadow-sm">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform" />
          <div className="flex justify-between items-start">
            <span className="text-sm font-semibold text-slate-400">Resume Score</span>
            <FileText className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black">{stats.resumeScore}</span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <div className="mt-4 h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${stats.resumeScore}%` }}></div>
          </div>
          <p className="text-xs text-emerald-500 font-medium mt-2">Excellent parsed profile</p>
        </div>

        {/* Card 2: ATS Fit */}
        <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-850 p-6 rounded-xl relative overflow-hidden group shadow-sm">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform" />
          <div className="flex justify-between items-start">
            <span className="text-sm font-semibold text-slate-400">ATS Keyword Match</span>
            <TrendingUp className="h-5 w-5 text-blue-500" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black">{stats.atsScore}</span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <div className="mt-4 h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${stats.atsScore}%` }}></div>
          </div>
          <p className="text-xs text-slate-400 mt-2">Needs 4 skills optimization</p>
        </div>

        {/* Card 3: Employability Index */}
        <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-850 p-6 rounded-xl relative overflow-hidden group shadow-sm">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform" />
          <div className="flex justify-between items-start">
            <span className="text-sm font-semibold text-slate-400">Employability Index</span>
            <Sparkles className="h-5 w-5 text-purple-500" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black">{stats.employabilityScore}%</span>
          </div>
          <div className="mt-4 h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${stats.employabilityScore}%` }}></div>
          </div>
          <p className="text-xs text-purple-500 font-medium mt-2">Highly competitive candidate</p>
        </div>

        {/* Card 4: Expected Salary */}
        <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-850 p-6 rounded-xl relative overflow-hidden group shadow-sm">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full translate-x-8 -translate-y-8 group-hover:scale-110 transition-transform" />
          <div className="flex justify-between items-start">
            <span className="text-sm font-semibold text-slate-400">Predictive Salary</span>
            <DollarSign className="h-5 w-5 text-amber-500" />
          </div>
          <div className="mt-4 flex flex-col justify-center">
            <span className="text-2xl font-black">{stats.salaryExpected}</span>
            <span className="text-xs text-slate-400 mt-1">{stats.salaryMin} - {stats.salaryMax} range</span>
          </div>
          <div className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-2 flex items-center justify-between">
            <span className="text-[10px] text-slate-400">ML Random Forest prediction</span>
          </div>
        </div>

      </div>

      {/* Main Grid: Recommended Role & missing skills */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Career Recommendation */}
        <div className="lg:col-span-2 bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-850 p-6 rounded-xl shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <Briefcase className="h-6 w-6 text-emerald-500" />
            <h3 className="text-lg font-bold">Recommended Career Goal</h3>
          </div>
          
          <div className="p-5 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-dark-950/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Top Recommended Role</span>
              <h4 className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{stats.recommendedRole}</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Based on resume text structure, experience density, and project mappings.</p>
            </div>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-all text-xs">
              View Role Details
            </button>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
            <h4 className="text-sm font-semibold mb-4 text-slate-500 dark:text-slate-450">Analyzed Skills Inventory</h4>
            <div className="flex flex-wrap gap-2">
              {['Python', 'Django', 'React', 'Javascript', 'TailwindCSS', 'REST APIs', 'SQL', 'Git', 'Machine Learning'].map((s) => (
                <span key={s} className="px-3 py-1 bg-emerald-500/10 dark:bg-emerald-500/25 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-semibold">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Missing Skills & Quick Learning links */}
        <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-850 p-6 rounded-xl shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-amber-500" />
            <h3 className="text-lg font-bold">Skills Gaps Detected</h3>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            The job market currently requires these skills for **{stats.recommendedRole}** positions. Add them to improve your ATS score.
          </p>

          <div className="space-y-3">
            {[
              { skill: 'Docker', level: 'High Demand' },
              { skill: 'Redis', level: 'Medium Demand' },
              { skill: 'Kubernetes', level: 'Growing' },
              { skill: 'Unit Testing', level: 'Required' },
            ].map((s) => (
              <div key={s.skill} className="flex justify-between items-center p-3 border border-slate-150 dark:border-slate-850 rounded-lg bg-slate-50/20 dark:bg-dark-950/20">
                <span className="text-sm font-semibold">{s.skill}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-450 border border-amber-500/25">
                  {s.level}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-150 dark:border-slate-850 pt-4 flex justify-between items-center">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-450 hover:underline cursor-pointer">
              <GraduationCap className="h-4 w-4" /> Recommend Courses
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
