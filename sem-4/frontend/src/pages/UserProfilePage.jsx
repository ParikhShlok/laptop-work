import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, CheckCircle, Github, Linkedin, Save } from 'lucide-react';

export default function UserProfilePage() {
  const { user, updateProfile } = useAuth();
  const [profileData, setProfileData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    targetRole: user?.target_role || 'Software Engineer',
    github: user?.github_link || '',
    linkedin: user?.linkedin_link || '',
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    const payload = {
      first_name: profileData.firstName,
      last_name: profileData.lastName,
      email: profileData.email,
      target_role: profileData.targetRole,
      github_link: profileData.github,
      linkedin_link: profileData.linkedin,
    };
    const res = await updateProfile(payload);
    setLoading(false);
    if (res.success) {
      setMsg('Profile updated successfully.');
    } else {
      setMsg('Failed to update profile.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">User Profile Settings</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Manage your personal details, career targets, and linked platforms.
        </p>
      </div>

      <div className="bg-white dark:bg-dark-900 border border-slate-200 dark:border-slate-850 rounded-2xl p-8 shadow-sm">
        {msg && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-450 text-sm rounded-xl flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            <span>{msg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350">First Name</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  name="firstName"
                  type="text"
                  value={profileData.firstName}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 bg-transparent sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350">Last Name</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  name="lastName"
                  type="text"
                  value={profileData.lastName}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-slate-300 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 bg-transparent sm:text-sm"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350">Email Address</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                name="email"
                type="email"
                value={profileData.email}
                onChange={handleInputChange}
                className="appearance-none block w-full px-3 py-2 border border-slate-300 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 bg-transparent sm:text-sm"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-850 pt-6 space-y-6">
            <h3 className="text-lg font-bold">Career & Links</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350">Target Job Role</label>
                <select
                  name="targetRole"
                  value={profileData.targetRole}
                  onChange={handleInputChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 dark:border-slate-800 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-lg bg-transparent"
                >
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Full Stack Developer">Full Stack Developer</option>
                  <option value="Data Analyst">Data Analyst</option>
                  <option value="AI Engineer">AI Engineer</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350">GitHub URL</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Github className="h-4.5 w-4.5" />
                  </div>
                  <input
                    name="github"
                    type="url"
                    value={profileData.github}
                    onChange={handleInputChange}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 bg-transparent sm:text-sm"
                    placeholder="https://github.com/username"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-350">LinkedIn URL</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Linkedin className="h-4.5 w-4.5" />
                </div>
                <input
                  name="linkedin"
                  type="url"
                  value={profileData.linkedin}
                  onChange={handleInputChange}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 bg-transparent sm:text-sm"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-lg shadow-emerald-500/15 hover:shadow-emerald-500/30 transition-all flex items-center gap-2 text-sm disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {loading ? 'Saving Changes...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
