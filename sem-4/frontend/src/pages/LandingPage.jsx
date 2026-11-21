import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, 
  Cpu, 
  FileText, 
  GraduationCap, 
  LineChart, 
  MessageSquare, 
  Sun, 
  Moon, 
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function LandingPage() {
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-dark-950 dark:text-slate-100 transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/70 dark:bg-dark-950/70 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 text-white p-2 rounded-lg shadow-lg shadow-emerald-500/20">
              <Cpu className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-350 bg-clip-text text-transparent">
              CareerIntel AI
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#features" className="hover:text-emerald-500 transition-colors">Features</a>
            <a href="#analytics" className="hover:text-emerald-500 transition-colors">Analytics</a>
            <a href="#about" className="hover:text-emerald-500 transition-colors">About</a>
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-200/50 hover:bg-slate-200 dark:bg-slate-800/50 dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-350"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link 
                  to="/dashboard" 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg shadow-lg shadow-emerald-600/10 hover:shadow-emerald-600/25 transition-all text-sm flex items-center gap-2"
                >
                  Dashboard <ArrowRight className="h-4 w-4" />
                </Link>
                <button 
                  onClick={logout}
                  className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-red-500 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium hover:text-emerald-500 transition-colors">
                  Log in
                </Link>
                <Link 
                  to="/register" 
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg shadow-lg shadow-emerald-600/10 hover:shadow-emerald-600/25 transition-all text-sm"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 lg:pt-28 lg:pb-32">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-teal-500/10 dark:bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-450 text-xs font-semibold mb-6 border border-emerald-500/20">
              <Zap className="h-3 w-3" /> Industry-Level Career Intelligence
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Land Your Dream Job with{' '}
              <span className="bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-350 bg-clip-text text-transparent">
                AI-Driven Insights
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Upload your resume, compare it against live market requirements, predict your employability score, and learn the exact skills required to beat the ATS.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/register" 
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-650 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 px-8 rounded-lg shadow-xl shadow-emerald-500/15 hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
              >
                Analyze Your Resume Now <ArrowRight className="h-5 w-5" />
              </Link>
              <a 
                href="#features" 
                className="w-full sm:w-auto bg-slate-200/50 hover:bg-slate-200 dark:bg-slate-800/50 dark:hover:bg-slate-800 border border-slate-350/10 text-slate-700 dark:text-slate-300 font-semibold py-3 px-8 rounded-lg transition-all text-center"
              >
                Explore Features
              </a>
            </div>
          </div>

          {/* Feature Highlight Mockup */}
          <div className="mt-16 border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-dark-900/40 p-4 rounded-2xl backdrop-blur-md shadow-2xl max-w-5xl mx-auto animate-pulse-subtle">
            <div className="bg-slate-900/5 dark:bg-slate-950/40 border border-slate-200/40 dark:border-slate-800/40 rounded-xl overflow-hidden aspect-[16/9] flex items-center justify-center">
              <div className="text-center p-8">
                <FileText className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold">Interactive Analytics Dashboard Preview</h3>
                <p className="text-sm text-slate-500 max-w-md mt-1">Once logged in, upload your PDF resume to generate matching metrics, salary ranges, missing skills, and dynamic trends charts.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-100 dark:bg-dark-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Engineered for Complete Career Readiness
            </h2>
            <p className="mt-4 text-lg text-slate-500 dark:text-slate-400">
              Not just another parser. A comprehensive AI career tool powered by Natural Language Processing and Machine Learning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-dark-950 border border-slate-200 dark:border-slate-850 p-8 rounded-xl shadow-sm hover:shadow-md hover:border-emerald-500/30 dark:hover:border-emerald-500/20 transition-all group">
              <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-3 rounded-lg w-fit group-hover:scale-110 transition-transform">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mt-6">Deep Resume Parsing</h3>
              <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Extracts contact info, educational background, professional experience, certifications, links, and detailed skill graphs using advanced parsing techniques.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-dark-950 border border-slate-200 dark:border-slate-850 p-8 rounded-xl shadow-sm hover:shadow-md hover:border-emerald-500/30 dark:hover:border-emerald-500/20 transition-all group">
              <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-3 rounded-lg w-fit group-hover:scale-110 transition-transform">
                <Briefcase className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mt-6">Job Market Matching</h3>
              <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Compares your resume against a database of dynamically updated jobs. Identifies critical keyword gaps and computes ATS matching percentages.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-dark-950 border border-slate-200 dark:border-slate-850 p-8 rounded-xl shadow-sm hover:shadow-md hover:border-emerald-500/30 dark:hover:border-emerald-500/20 transition-all group">
              <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-3 rounded-lg w-fit group-hover:scale-110 transition-transform">
                <LineChart className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mt-6">Predictive AI Analytics</h3>
              <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Employs machine learning models to forecast your market employability index (0–100) and predicts customized minimum, expected, and maximum salary brackets.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white dark:bg-dark-950 border border-slate-200 dark:border-slate-850 p-8 rounded-xl shadow-sm hover:shadow-md hover:border-emerald-500/30 dark:hover:border-emerald-500/20 transition-all group">
              <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-3 rounded-lg w-fit group-hover:scale-110 transition-transform">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mt-6">Smart Course Curations</h3>
              <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Identifies missing skills and pulls custom learn resources including Top YouTube tutorials, GitHub repos, official docs, and practice platforms.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white dark:bg-dark-950 border border-slate-200 dark:border-slate-850 p-8 rounded-xl shadow-sm hover:shadow-md hover:border-emerald-500/30 dark:hover:border-emerald-500/20 transition-all group">
              <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-3 rounded-lg w-fit group-hover:scale-110 transition-transform">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mt-6">AI Career Coach</h3>
              <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                An interactive chatbot utilizing LLM insights to roast your resume gaps, suggest projects, generate interview questions, and script customized roadmaps.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white dark:bg-dark-950 border border-slate-200 dark:border-slate-850 p-8 rounded-xl shadow-sm hover:shadow-md hover:border-emerald-500/30 dark:hover:border-emerald-500/20 transition-all group">
              <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-3 rounded-lg w-fit group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mt-6">Secure & Robust</h3>
              <p className="mt-3 text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Role-based access controls, JWT token authorization, secure uploads, SQL injection guards, and audit logs tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-t border-slate-200 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-extrabold text-emerald-500">95%</div>
              <div className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">ATS Optimization</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-emerald-500">10k+</div>
              <div className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">Jobs Scraped</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-emerald-500">20+</div>
              <div className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">Tech Roles Classed</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-emerald-500">&lt;5s</div>
              <div className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">Inference Speeds</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-dark-950 border-t border-slate-200 dark:border-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-sm">
          <p>© 2026 CareerIntel AI. All rights reserved. Developed for Semester 4 Full Stack + AI Showcase.</p>
        </div>
      </footer>
    </div>
  );
}
