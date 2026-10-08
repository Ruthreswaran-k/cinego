import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Twitter, Instagram, Youtube, Facebook, PhoneCall, MessageCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#050505] border-t border-white/10 pt-16 pb-8 mt-20 relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Film className="w-8 h-8 text-primary" />
              <span className="text-2xl font-display font-bold text-white tracking-wide">
                CineGo
              </span>
            </Link>
            <p className="text-gray-400 mb-6 font-medium">
              Your Movies. Your Seats. Your Experience.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: 'Movies', path: '/movies' },
                { name: 'Theatres', path: '/theatres' },
                { name: 'Offers', path: '/offers' },
                { name: 'Experiences', path: '/experiences' },
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-400 hover:text-white hover:pl-2 transition-all block">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide">Company</h4>
            <ul className="space-y-3">
              {['About Us', 'Contact', 'Terms of Service', 'Privacy Policy'].map((link) => (
                <li key={link}>
                  <Link to={`/${link.toLowerCase().replace(/ /g, '-')}`} className="text-gray-400 hover:text-white hover:pl-2 transition-all block">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Experience */}
          <div>
            <h4 className="text-white font-bold mb-6 tracking-wide">Experience</h4>
            <ul className="space-y-3">
              {[
                { name: 'IMAX Laser 3D', path: '/experiences' },
                { name: 'Dolby Atmos Sound', path: '/experiences' },
                { name: '4DX Motion Cinema', path: '/experiences' },
                { name: 'ScreenX 270° Panoramic', path: '/experiences' },
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-gray-400 hover:text-white hover:pl-2 transition-all block">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 24/7 Dedicated Support Strip with Official Helpline: 9597314692 */}
        <div className="my-8 p-4 rounded-2xl bg-zinc-950/80 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center flex-shrink-0">
              <PhoneCall className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider block">
                24/7 Dedicated Support Helpline
              </span>
              <a
                href="tel:9597314692"
                className="text-white hover:text-primary font-bold font-mono text-base transition-colors"
              >
                +91 9597314692
              </a>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <a
              href="https://wa.me/919597314692?text=Hi%20CineGo%20Support"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 font-bold transition-all flex items-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp: 9597314692</span>
            </a>
            <Link
              to="/contact"
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 font-bold transition-all"
            >
              Support & FAQs
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} CineGo. All rights reserved.</p>
          <p className="mt-4 md:mt-0 font-medium">Built for cinema lovers. 24/7 Care: 9597314692</p>
        </div>
      </div>
    </footer>
  );
};
