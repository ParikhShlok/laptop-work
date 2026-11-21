import React from 'react';
import { motion } from 'framer-motion';
import { Award, Compass, Heart, Users, Target, Shield } from 'lucide-react';

const About = () => {
  const timeline = [
    { year: '2011', title: 'The Spark', desc: 'SWAPNAART was founded as a small creative studio in Gujarat with a single digital printer and a passion for design.' },
    { year: '2015', title: 'Expansion & Offset Press', desc: 'Introduced high-speed offset printing presses, enlarging our capabilities to print large catalogs, brochures, and wholesale orders.' },
    { year: '2020', title: 'Going Digital First', desc: 'Built video invitation capabilities, social media templates, and full brand identity kits for digital-first startups.' },
    { year: '2026', title: 'Creative Agency Portal', desc: 'Launched the SWAPNAART online portal, integrating our custom Canva-like canvas tool and interactive dashboard tracker.' }
  ];

  const team = [
    { name: 'Swapnil Mehta', role: 'Founder & Principal Designer', icon: '👨‍🎨', bio: 'Over 15 years in print production and creative typography design.' },
    { name: 'Aarav Shah', role: 'Lead Brand Strategist', icon: '👨‍💻', bio: 'Specialist in modern identity packaging designs and corporate stationery manuals.' },
    { name: 'Nisha Patel', role: 'Motion Illustrator', icon: '👩‍🎨', bio: 'Expert in creative video invites, high-impact banners, and social posts.' }
  ];

  return (
    <div className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-poppins">
      
      {/* Background blobs */}
      <div className="blob-container">
        <div className="blob blob-primary" />
        <div className="blob blob-accent animate-delay-10" />
      </div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center space-x-2 bg-secondary/10 border border-secondary/20 px-3 py-1 rounded-full text-secondary text-xs font-semibold">
          <span>🎨 About SWAPNAART</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-darkObsidian tracking-tight">
          Where Creative Vision <br/>
          Meets Precision Printing
        </h1>
        <p className="text-sm text-gray-500 font-inter leading-relaxed">
          We combine the artistry of a high-end graphic design studio with the technical power of an advanced printing house.
        </p>
      </div>

      {/* Vision & Mission Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24 text-left">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-white/40 shadow-premium space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Our Mission</h3>
          <p className="text-xs text-gray-500 font-inter leading-relaxed">
            To empower local and global brands by delivering tailored high-impact graphic layouts, state-of-the-art print files, and digital invitation designs that captivate and build trust. We eliminate the generic to create custom identity assets.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-white/40 shadow-premium space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Our Vision</h3>
          <p className="text-xs text-gray-500 font-inter leading-relaxed">
            To become India’s most premium and reliable full-service digital-first graphic design and printing agency, blending custom creative canvas interfaces with express logistics delivery systems.
          </p>
        </div>
      </div>

      {/* Timeline Achievements */}
      <div className="mb-28">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
          <h2 className="text-3xl font-extrabold text-darkObsidian tracking-tight">Our Timeline Journey</h2>
          <p className="text-xs text-gray-500 font-inter">Tracking the milestones that define our growth and creative focus.</p>
        </div>

        <div className="relative border-l border-gray-200 ml-4 md:ml-32 md:mr-32 space-y-12 text-left">
          {timeline.map((milestone, idx) => (
            <div key={idx} className="relative pl-8 md:pl-16">
              
              {/* Circle Marker */}
              <div className="absolute left-[-11px] top-1.5 w-6 h-6 rounded-full bg-gradient-to-tr from-primary to-secondary text-white border-4 border-white flex items-center justify-center shadow-premium" />
              
              <div className="space-y-2">
                <span className="inline-block text-lg font-extrabold text-primary font-montserrat">{milestone.year}</span>
                <h4 className="font-bold text-sm text-gray-800">{milestone.title}</h4>
                <p className="text-xs text-gray-400 font-inter leading-relaxed max-w-xl">{milestone.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Designers Section */}
      <div>
        <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
          <h2 className="text-3xl font-extrabold text-darkObsidian tracking-tight">Our Creative Minds</h2>
          <p className="text-xs text-gray-500 font-inter">Meet the designers and printing specialists shaping your designs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-6 shadow-premium border border-gray-50 text-center space-y-4">
              <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-primary/10 to-secondary/10 rounded-full flex items-center justify-center text-4xl shadow-inner">
                {member.icon}
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-gray-800">{member.name}</h4>
                <p className="text-[11px] font-medium text-primary uppercase tracking-wider">{member.role}</p>
              </div>
              <p className="text-xs text-gray-400 font-inter leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default About;
