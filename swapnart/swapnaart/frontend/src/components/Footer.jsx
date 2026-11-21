import React from 'react';
import { Link } from 'react-router-dom';
import { Paintbrush, Mail, Phone, MapPin, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-darkObsidian text-gray-300 font-poppins pt-16 pb-8 mt-20 relative overflow-hidden">
      
      {/* Decorative vector background */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-accent/5 to-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary text-white">
                <span className="font-montserrat font-bold text-sm">S</span>
              </div>
              <span className="font-montserrat font-extrabold text-xl tracking-wider text-white">
                SWAPNA<span className="text-primary">ART</span>
              </span>
            </Link>
            <p className="text-xs text-gray-400 font-inter leading-relaxed">
              Premium agency-level graphic design, custom offset printing, and high-impact digital branding. We build visual assets that transform business identity.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Navigations</h3>
            <ul className="space-y-2 text-xs">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors">Our Services</Link></li>
              <li><Link to="/portfolio" className="hover:text-primary transition-colors">Project Portfolio</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About Story</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Core Services */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Top Services</h3>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>Premium Business Cards</li>
              <li>Corporate Logo Branding</li>
              <li>Outdoor Flex Banners</li>
              <li>Digital Wedding Invitations</li>
              <li>Restaurant Menu Prints</li>
              <li>Social Media Templates</li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Contact Info</h3>
            <ul className="space-y-3 text-xs">
              <li className="flex items-center space-x-2 text-gray-400">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>101, Creative Plaza, Station Road, Gujarat, India</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400">
                <Phone className="w-4 h-4 text-secondary shrink-0" />
                <span>+91 99999 99999</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-400">
                <Mail className="w-4 h-4 text-accent shrink-0" />
                <span>contact@swapnaart.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} SWAPNAART. All Rights Reserved.</p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <a href="#" className="hover:text-gray-400">Privacy Policy</a>
            <a href="#" className="hover:text-gray-400">Terms of Service</a>
            <a href="#" className="hover:text-gray-400">Sitemap</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
