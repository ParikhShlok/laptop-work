import React, { useState } from 'react';
import { 
  ArrowLeftRight, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  CheckCircle, 
  XCircle,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

export default function JobMatchingPage() {
  const [filter, setFilter] = useState('all');

  const jobs = [
    {
      id: 1,
      title: 'Full Stack Engineer',
      company: 'TechCorp Solutions',
      location: 'Remote, US',
      salary: '$95k - $120k',
      match: 86,
      matchingSkills: ['Python', 'Django', 'React', 'REST APIs', 'SQL'],
      missingSkills: ['Docker', 'AWS'],
    },
    {
      id: 2,
      title: 'Python Developer',
      company: 'DataScale Systems',
      location: 'New York, NY',
      salary: '$90k - $110k',
      match: 78,
      matchingSkills: ['Python', 'Django', 'SQL', 'Git'],
      missingSkills: ['Redis', 'Celery'],
    },
    {
      id: 3,
      title: 'Frontend React Developer',
      company: 'DesignFirst Studio',
      location: 'San Francisco, CA',
      salary: '$85k - $105k',
      match: 72,
      matchingSkills: ['React', 'Javascript', 'TailwindCSS'],
      missingSkills: ['TypeScript', 'GraphQL'],
    },
  ];

  const filteredJobs = filter === 'all' 
    ? jobs 
    : jobs.filter(j => j.match >= 80);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Job Market Matching</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Compare your resume profile against scraped job postings in the market.
          </p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-850 p-1 rounded-lg shrink-0 w-fit">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              filter === 'all' 
                ? 'bg-white dark:bg-dark-900 text-slate-800 dark:text-slate-100 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            All Jobs
          </button>
          <button
            onClick={() => setFilter('high')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              filter === 'high' 
                ? 'bg-white dark:bg-dark-900 text-slate-800 dark:text-slate-100 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
            }`}
          >
            High Match (&gt;80%)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredJobs.map((job) => (
          <div 
            key={job.id} 
            className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-850 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 items-start md:items-center justify-between"
          >
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold">{job.title}</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 border border-emerald-500/25 text-[10px] font-bold">
                  {job.match}% ATS Match
                </span>
              </div>
              
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4" /> {job.company}</span>
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {job.location}</span>
                <span className="flex items-center gap-1.5"><DollarSign className="h-4 w-4" /> {job.salary}</span>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {job.matchingSkills.map(skill => (
                  <span key={skill} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold">
                    <CheckCircle className="h-3 w-3 text-emerald-500" /> {skill}
                  </span>
                ))}
                {job.missingSkills.map(skill => (
                  <span key={skill} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/5 dark:bg-red-500/10 border border-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-semibold">
                    <XCircle className="h-3 w-3 text-red-500" /> {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0 w-full md:w-auto border-t md:border-0 border-slate-100 dark:border-slate-800 pt-4 md:pt-0">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">ATS Rating</span>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-350">{job.match >= 80 ? 'Highly Suitable' : 'Moderate Match'}</span>
              </div>
              <button className="flex-1 md:flex-initial bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 font-bold py-2.5 px-5 rounded-lg text-xs transition-all flex items-center justify-center gap-2">
                Analyze Gaps <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
