import React, { useState } from 'react';
import { 
  GraduationCap, 
  Youtube, 
  Github, 
  BookOpen, 
  Award,
  Play,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export default function LearningCenterPage() {
  const [selectedSkill, setSelectedSkill] = useState('Docker');

  const skillsGaps = ['Docker', 'Redis', 'Kubernetes', 'Unit Testing'];

  const resources = {
    Docker: [
      {
        type: 'youtube',
        title: 'Docker Tutorial for Beginners [Full Course]',
        author: 'Programming with Mosh',
        link: 'https://www.youtube.com/',
        duration: '2 hours',
      },
      {
        type: 'github',
        title: 'awesome-docker',
        desc: 'A curated list of Docker resources and projects.',
        link: 'https://github.com/',
        stars: '26k',
      },
      {
        type: 'documentation',
        title: 'Docker Get Started Guide',
        desc: 'Official Docker setup and containerization walkthroughs.',
        link: 'https://docs.docker.com/',
      },
      {
        type: 'practice',
        title: 'Docker Labs & Playgrounds',
        desc: 'Hands-on practice containers in your browser.',
        link: 'https://labs.play-with-docker.com/',
      }
    ],
    Redis: [
      {
        type: 'youtube',
        title: 'Redis Crash Course',
        author: 'Traversy Media',
        link: 'https://www.youtube.com/',
        duration: '45 mins',
      },
      {
        type: 'github',
        title: 'redis-py',
        desc: 'Python interface to the Redis key-value store.',
        link: 'https://github.com/',
        stars: '11k',
      }
    ]
  };

  const activeResources = resources[selectedSkill] || [];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Learning & Recommendations</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Bridge your skills gaps with curated tutorials, open-source repositories, and official documentations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side: Skills tabs */}
        <div className="lg:col-span-1 space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Select Skill Gap</span>
          <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-2 pb-2 lg:pb-0">
            {skillsGaps.map((skill) => (
              <button
                key={skill}
                onClick={() => setSelectedSkill(skill)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all shrink-0 lg:shrink flex items-center justify-between ${
                  selectedSkill === skill
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/10'
                    : 'bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-850'
                }`}
              >
                <span>{skill}</span>
                <ChevronRight className="h-4 w-4 hidden lg:block opacity-60" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Resources List */}
        <div className="lg:col-span-3 space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-850 pb-4">
            <h3 className="text-xl font-bold">Curated Resources for {selectedSkill}</h3>
          </div>

          {activeResources.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {activeResources.map((res, i) => (
                <div key={i} className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-850 p-6 rounded-xl flex flex-col justify-between shadow-sm hover:shadow-md transition-all">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      {res.type === 'youtube' && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-bold">
                          <Youtube className="h-3.5 w-3.5" /> Video Lesson
                        </span>
                      )}
                      {res.type === 'github' && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-900/10 dark:bg-white/10 text-slate-700 dark:text-slate-200 border border-slate-900/20 dark:border-white/10 text-[10px] font-bold">
                          <Github className="h-3.5 w-3.5" /> Repository
                        </span>
                      )}
                      {res.type === 'documentation' && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20 text-[10px] font-bold">
                          <BookOpen className="h-3.5 w-3.5" /> Documentation
                        </span>
                      )}
                      {res.type === 'practice' && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/20 text-[10px] font-bold">
                          <Award className="h-3.5 w-3.5" /> Practice Ground
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-snug">{res.title}</h4>
                      {res.author && <p className="text-xs text-slate-400 mt-1">Creator: {res.author} • {res.duration}</p>}
                      {res.desc && <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{res.desc}</p>}
                      {res.stars && <p className="text-[10px] text-amber-500 font-bold mt-1">★ {res.stars} Stars</p>}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-850">
                    <a
                      href={res.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 hover:text-emerald-500 dark:text-emerald-450 dark:hover:text-emerald-400"
                    >
                      Access Material <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-12 bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-850 rounded-2xl">
              <GraduationCap className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h4 className="font-bold">Gathering Learning Path</h4>
              <p className="text-xs text-slate-500 mt-1">Connecting to API catalogs to scrape YouTube and GitHub resources...</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// Inline helper icon import check
function ChevronRight(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={props.className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  );
}
