import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Globe, Calendar, Facebook, Instagram, Twitter } from 'lucide-react';
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

  const NavLink = ({ to, label }: { to: string; label: string }) => (
    <Link 
      to={to} 
      onClick={() => setIsMenuOpen(false)}
      className={`block py-2 px-4 hover:text-primary transition-colors ${location.pathname === to ? 'text-primary font-bold' : 'text-gray-700'}`}
    >
      {label}
    </Link>
  );

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 bg-gray-50">
      {/* Top Bar - Desktop */}
      <div className="bg-secondary text-white text-sm py-2 px-4 hidden md:flex justify-between items-center">
        <div className="flex space-x-4">
          <span className="flex items-center"><Phone size={14} className="mr-1" /> (555) 123-4567</span>
          <span className="opacity-75">Mon-Sat: 8am - 6pm</span>
        </div>
        <div className="flex space-x-4">
           <button onClick={toggleLang} className="flex items-center hover:text-primary transition-colors uppercase font-bold text-xs">
             <Globe size={14} className="mr-1" /> {language === Language.EN ? 'Español' : 'English'}
           </button>
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
                className="ml-4 bg-primary hover:bg-amber-600 text-white px-5 py-2 rounded-full font-medium transition-colors shadow-lg shadow-primary/30 flex items-center"
              >
                <Calendar size={16} className="mr-2" /> {t.common.bookNow}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-4">
               <button onClick={toggleLang} className="text-gray-600 font-bold uppercase text-sm">
                 {language}
               </button>
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
              <Link to="/admin" className="block py-2 px-4 text-gray-400 text-sm mt-4">Admin Login</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow pb-20 md:pb-0">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-secondary text-gray-300 py-12 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">BuildRight</h3>
            <p className="text-sm">Quality construction services for residential and commercial projects.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <p className="text-sm mb-2">123 Builder Lane, Cityville</p>
            <p className="text-sm mb-2">(555) 123-4567</p>
            <p className="text-sm">info@buildright.com</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/services" className="hover:text-primary">Services</Link></li>
              <li><Link to="/portfolio" className="hover:text-primary">Projects</Link></li>
              <li><Link to="/admin" className="hover:text-primary">Staff Login</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Social</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary"><Facebook size={20} /></a>
              <a href="#" className="hover:text-primary"><Instagram size={20} /></a>
              <a href="#" className="hover:text-primary"><Twitter size={20} /></a>
            </div>
          </div>
        </div>
        <div className="text-center text-xs mt-12 pt-8 border-t border-gray-700">
          © {new Date().getFullYear()} BuildRight Contractors. All rights reserved.
        </div>
      </footer>

      {/* Mobile Sticky CTA */}
      <div className="md:hidden fixed bottom-0 w-full bg-white border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] flex justify-between items-center p-3 z-50">
        <a href="tel:+15551234567" className="flex-1 flex flex-col items-center text-gray-600 active:text-primary">
          <Phone size={20} />
          <span className="text-xs font-medium mt-1">{t.common.callUs}</span>
        </a>
        <div className="w-px h-8 bg-gray-200"></div>
        <button onClick={onBookClick} className="flex-1 flex flex-col items-center text-primary font-bold">
          <Calendar size={24} className="mb-1" />
          <span className="text-xs">{t.common.bookNow}</span>
        </button>
      </div>
    </div>
  );
};

export default Layout;
