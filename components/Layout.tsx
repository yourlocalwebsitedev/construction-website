import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Globe, Calendar, Facebook, Instagram, Twitter, Clock, ShieldCheck, Award, MessageCircle, Mail, MapPin } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
  language: Language;
  setLanguage: (lang: Language) => void;
  onBookClick: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, language, setLanguage, onBookClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const t = TRANSLATIONS[language];

  const toggleLang = () => setLanguage(language === Language.EN ? Language.ES : Language.EN);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const NavLink = ({ to, label }: { to: string; label: string }) => (
    <Link 
      to={to} 
      onClick={() => {
        setIsMenuOpen(false);
        scrollToTop();
      }}
      className={`block py-2 px-4 hover:text-primary transition-colors ${location.pathname === to ? 'text-primary font-bold' : 'text-gray-700'}`}
    >
      {label}
    </Link>
  );

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 bg-gray-50">
      {/* Modern Top Bar - Desktop Only */}
      <div className="hidden md:block bg-gradient-to-r from-secondary via-secondary to-gray-800 text-white border-b border-primary/20">
        <div className="max-w-7xl mx-auto px-4 py-2 md:py-3">
          <div className="flex flex-row justify-between items-center gap-2">
            
            {/* Left Side - Contact Info (Desktop Only) */}
            <div className="hidden md:flex items-center gap-4 text-sm">
              {/* Phone */}
              <a 
                href="tel:+15551234567" 
                className="flex items-center gap-2 hover:text-primary transition-colors group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
              >
                <div className="p-1.5 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition">
                  <Phone size={16} className="text-primary" />
                </div>
                <span className="font-medium">(555) 123-4567</span>
              </a>
              
              {/* Hours */}
              <div className="hidden lg:flex items-center gap-2 text-gray-300">
                <div className="p-1.5 bg-white/5 rounded-lg">
                  <Clock size={16} className="text-gray-400" />
                </div>
                <span className="text-xs md:text-sm">{t.common.hours}</span>
              </div>
              
              {/* WhatsApp */}
              <a 
                href="https://wa.me/15551234567" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors group focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 rounded"
              >
                <div className="p-1.5 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition">
                  <MessageCircle size={16} className="text-green-400" />
                </div>
                <span className="font-medium text-sm">{t.home.whatsapp}</span>
              </a>
            </div>

            {/* Right Side - Language & License (Desktop Only) */}
            <div className="hidden md:flex items-center gap-4">
              {/* License Badge */}
              <div className="hidden lg:flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                <ShieldCheck size={14} className="text-primary" />
                <span className="text-xs font-medium text-gray-300">
                  {t.common.licenseShort} #GC-9821
                </span>
              </div>
              
              {/* Language Toggle */}
              <div className="flex items-center bg-white/5 rounded-full p-1">
                <button
                  onClick={() => setLanguage(Language.EN)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${
                    language === Language.EN
                      ? 'bg-primary text-white shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage(Language.ES)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all min-h-[44px] flex items-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 ${
                    language === Language.ES
                      ? 'bg-primary text-white shadow-md'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  ES
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">B</div>
              <span className="text-xl font-bold tracking-tight text-secondary">BuildRight</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-1 items-center">
              <NavLink to="/" label={t.nav.home} />
              <NavLink to="/services" label={t.nav.services} />
              <NavLink to="/portfolio" label={t.nav.portfolio} />
              <NavLink to="/about" label={t.nav.about} />
              <NavLink to="/contact" label={t.nav.contact} />
              <button 
                onClick={onBookClick}
                className="ml-4 bg-primary hover:bg-amber-600 text-white px-5 py-2 rounded-full font-medium transition-colors shadow-lg shadow-primary/30 flex items-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <Calendar size={16} className="mr-2" /> {t.common.bookNow}
              </button>
            </div>

            {/* Mobile Menu Button + Language Toggle */}
            <div className="md:hidden flex items-center gap-3">
              {/* Language Toggle - Mobile */}
              <div className="flex items-center bg-gray-100 rounded-full p-0.5">
                <button
                  onClick={() => setLanguage(Language.EN)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                    language === Language.EN
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-gray-600'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage(Language.ES)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                    language === Language.ES
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-gray-600'
                  }`}
                >
                  ES
                </button>
              </div>
              
              {/* Hamburger Menu */}
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600">
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-xl z-50">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <NavLink to="/" label={t.nav.home} />
              <NavLink to="/services" label={t.nav.services} />
              <NavLink to="/portfolio" label={t.nav.portfolio} />
              <NavLink to="/about" label={t.nav.about} />
              <NavLink to="/contact" label={t.nav.contact} />
              
              {/* Book Now Button in Mobile Menu */}
              <div className="px-4 py-3">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onBookClick();
                  }}
                  className="w-full bg-primary hover:bg-amber-600 text-white px-5 py-3 rounded-full font-bold transition-colors shadow-lg flex items-center justify-center"
                >
                  <Calendar size={18} className="mr-2" /> {t.common.bookNow}
                </button>
              </div>
              
              <div className="px-4 py-2 mt-2 border-t border-gray-100">
                 <div className="flex items-center text-gray-500 text-xs">
                    <ShieldCheck size={12} className="mr-1" />
                    {t.common.licenseShort} #GC-9821
                 </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow pb-16 md:pb-0">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-secondary text-gray-300 py-3 md:py-12 mt-0">
        <div className="max-w-7xl mx-auto px-4">
          {/* Mobile Footer - Compact */}
          <div className="md:hidden space-y-3 text-center pb-2">
            {/* Company Name */}
            <div>
              <h3 className="text-white text-lg font-bold">BuildRight</h3>
              <p className="text-xs text-gray-400 mt-1">Quality construction services</p>
            </div>
            
            {/* Quick Links - Single Line */}
            <div className="flex justify-center gap-4 text-xs border-y border-gray-700 py-3">
              <Link to="/services" onClick={scrollToTop} className="hover:text-primary">Services</Link>
              <Link to="/portfolio" onClick={scrollToTop} className="hover:text-primary">Portfolio</Link>
              <Link to="/about" onClick={scrollToTop} className="hover:text-primary">About</Link>
              <Link to="/contact" onClick={scrollToTop} className="hover:text-primary">Contact</Link>
            </div>

            {/* Social Icons - Larger and more visible */}
            <div className="flex justify-center gap-6 py-2">
              <a href="#" className="text-gray-300 hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook size={22} strokeWidth={1.5} />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram size={22} strokeWidth={1.5} />
              </a>
              <a href="#" className="text-gray-300 hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter size={22} strokeWidth={1.5} />
              </a>
            </div>

            {/* License + Copyright Combined */}
            <div className="text-xs text-gray-500 space-y-1 pb-1">
              <div className="flex items-center justify-center gap-1 text-primary font-semibold">
                <ShieldCheck size={12} />
                <span>Licensed & Insured #GC-9821</span>
              </div>
              <div>© {new Date().getFullYear()} BuildRight Contractors</div>
            </div>
          </div>

          {/* Desktop Footer - Full Version */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-lg font-bold mb-4">BuildRight</h3>
              <p className="text-sm">Quality construction services for residential and commercial projects.</p>
              <div className="mt-4 flex items-center text-primary text-sm font-bold">
                <ShieldCheck size={16} className="mr-2" />
                {t.common.licenseShort} & Insured
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <p className="text-sm mb-2">225 N Cotner Blvd, Lincoln, NE</p>
              <p className="text-sm mb-2">(555) 123-4567</p>
              <p className="text-sm">info@buildright.com</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/services" className="hover:text-primary">Services</Link></li>
                <li><Link to="/portfolio" className="hover:text-primary">Projects</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Social</h4>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-primary"><Facebook size={20} /></a>
                <a href="#" className="hover:text-primary"><Instagram size={20} /></a>
                <a href="#" className="hover:text-primary"><Twitter size={20} /></a>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex flex-col sm:flex-row items-start gap-3">
                  {/* Badge: Accredited Business */}
                  <div className="bg-white py-1.5 px-3 rounded shadow-sm flex items-center gap-2 select-none hover:scale-105 transition-transform duration-200">
                    <div className="bg-slate-800 text-white p-1 rounded-full">
                      <Award size={14} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] text-gray-500 uppercase font-bold leading-none">Accredited</span>
                      <span className="text-xs font-bold text-slate-900 leading-none mt-0.5">BUSINESS</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Desktop Copyright */}
          <div className="hidden md:block text-center text-xs mt-12 pt-8 border-t border-gray-700">
            © {new Date().getFullYear()} BuildRight Contractors. License #GC-9821. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Mobile Sticky CTA */}
      <div className="md:hidden fixed bottom-0 w-full bg-white border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] flex justify-between items-center p-3 z-50">
        <a href="tel:+15551234567" className="flex-1 flex flex-col items-center text-gray-600 active:text-primary min-h-[44px] justify-center">
          <Phone size={22} />
          <span className="text-[10px] font-medium mt-0.5">{language === Language.EN ? 'Call' : 'Llamar'}</span>
        </a>
        <div className="w-px h-10 bg-gray-200"></div>
        <a href="https://wa.me/15551234567" className="flex-1 flex flex-col items-center text-green-600 active:text-green-700 min-h-[44px] justify-center">
          <MessageCircle size={22} />
          <span className="text-[10px] font-medium mt-0.5 text-center leading-tight">WhatsApp</span>
        </a>
        <div className="w-px h-10 bg-gray-200"></div>
        <button onClick={onBookClick} className="flex-1 flex flex-col items-center text-primary font-bold min-h-[44px] justify-center">
          <Calendar size={24} />
          <span className="text-[10px] mt-0.5">{language === Language.EN ? 'Book' : 'Reservar'}</span>
        </button>
      </div>
    </div>
  );
};

export default Layout;