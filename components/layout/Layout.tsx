import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, MessageCircle, ClipboardList, Facebook, Instagram, Youtube, Clock, MapPin, Mail } from 'lucide-react';
import { Language } from '../../types';
import { TRANSLATIONS, COMPANY } from '../../constants';
import { getWhatsAppUrl, getTelUrl } from '../../services/contactLinks';
import { trackEvent } from '../../services/analytics';
import Logo from './Logo';

interface LayoutProps {
  children: React.ReactNode;
  language: Language;
  setLanguage: (lang: Language) => void;
  onBookClick: () => void;
}

const NAV_ITEMS = (t: any) => [
  { to: '/', label: t.nav.home },
  { to: '/services', label: t.nav.services },
  { to: '/projects', label: t.nav.projects },
  { to: '/about', label: t.nav.about },
  { to: '/contact', label: t.nav.contact },
];

const Layout: React.FC<LayoutProps> = ({ children, language, setLanguage, onBookClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const t = TRANSLATIONS[language];
  const navItems = NAV_ITEMS(t);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const closeMenu = () => setIsMenuOpen(false);

  const LangToggle = ({ compact = false }: { compact?: boolean }) => (
    <div className={`flex items-center rounded-full border border-gold/40 ${compact ? 'p-0.5' : 'p-1'}`}>
      <button
        onClick={() => setLanguage(Language.EN)}
        className={`rounded-full font-bold transition-all ${compact ? 'px-2 py-1 text-[10px]' : 'px-3 py-1.5 text-xs'} ${
          language === Language.EN ? 'bg-gold text-ink' : 'text-cream/70'
        }`}
      >
        EN
      </button>
      <span className={`text-gold/40 ${compact ? 'text-[10px]' : 'text-xs'}`}>|</span>
      <button
        onClick={() => setLanguage(Language.ES)}
        className={`rounded-full font-bold transition-all ${compact ? 'px-2 py-1 text-[10px]' : 'px-3 py-1.5 text-xs'} ${
          language === Language.ES ? 'bg-gold text-ink' : 'text-cream/70'
        }`}
      >
        ES
      </button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col font-sans text-body bg-cream">
      {/* Header — compact sticky on mobile, full nav on desktop */}
      <header className="bg-ink sticky top-0 z-40 border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[4.5rem] md:h-20">
            <Link to="/" onClick={scrollToTop} className="flex items-center shrink-0">
              <Logo variant="light" size="lg" />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={scrollToTop}
                  className={`px-3 py-2 text-sm font-medium tracking-wide transition-colors ${
                    location.pathname === item.to ? 'text-gold' : 'text-cream/80 hover:text-gold'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              <a
                href={getTelUrl(COMPANY.phone)}
                onClick={() => trackEvent('call_click', { context: 'header' })}
                aria-label={language === Language.EN ? 'Call us' : 'Llámanos'}
                title={COMPANY.phoneDisplay}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-gold/40 text-cream/80 hover:text-gold hover:border-gold transition-colors"
              >
                <Phone size={16} />
              </a>
              <a
                href={getWhatsAppUrl(COMPANY.whatsapp)}
                target="_blank"
                rel="noreferrer"
                onClick={() => trackEvent('whatsapp_click', { context: 'header' })}
                aria-label="WhatsApp"
                title="WhatsApp"
                className="w-9 h-9 flex items-center justify-center rounded-full border border-gold/40 text-cream/80 hover:text-gold hover:border-gold transition-colors"
              >
                <MessageCircle size={16} />
              </a>
              <LangToggle />
              <button
                onClick={onBookClick}
                className="bg-gold hover:bg-gold-light text-ink font-bold text-sm tracking-wide px-5 py-2.5 rounded-md transition-colors shadow-lg shadow-gold/20"
              >
                {t.common.getEstimate}
              </button>
            </div>

            {/* Mobile: EN|ES + Hamburger (language stays visible, not hidden in menu) */}
            <div className="lg:hidden flex items-center gap-3">
              <LangToggle compact />
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Menu"
                className="text-cream p-1"
              >
                {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {isMenuOpen && (
          <div className="lg:hidden bg-ink border-t border-gold/20 absolute w-full shadow-2xl z-50 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => { closeMenu(); scrollToTop(); }}
                  className={`block py-3 px-3 rounded-lg font-medium transition-colors ${
                    location.pathname === item.to ? 'text-gold bg-gold/10' : 'text-cream/90 hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main content — extra bottom padding on mobile for sticky bar */}
      <main className="flex-grow pb-20 lg:pb-0">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-ink text-cream/70">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <Logo variant="light" size="md" />
              <p className="text-sm mt-4 leading-relaxed">
                {COMPANY.name}
              </p>
            </div>
            <div>
              <h4 className="text-cream font-serif font-bold mb-4">{language === Language.EN ? 'Navigation' : 'Navegación'}</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/services" className="hover:text-gold transition-colors">{t.nav.services}</Link></li>
                <li><Link to="/projects" className="hover:text-gold transition-colors">{t.nav.projects}</Link></li>
                <li><Link to="/about" className="hover:text-gold transition-colors">{t.nav.about}</Link></li>
                <li><Link to="/reviews" className="hover:text-gold transition-colors">{t.nav.reviews}</Link></li>
                <li><Link to="/contact" className="hover:text-gold transition-colors">{t.nav.contact}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-cream font-serif font-bold mb-4">{language === Language.EN ? 'Contact' : 'Contacto'}</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2"><Phone size={14} className="text-gold shrink-0" /> <a href={getTelUrl(COMPANY.phone)} onClick={() => trackEvent('call_click', { context: 'footer' })} className="hover:text-gold transition-colors">{COMPANY.phoneDisplay}</a></li>
                <li className="flex items-center gap-2"><Mail size={14} className="text-gold shrink-0" /> <a href={`mailto:${COMPANY.email}`} className="hover:text-gold transition-colors">{COMPANY.email}</a></li>
                <li className="flex items-center gap-2"><MessageCircle size={14} className="text-gold shrink-0" /> <a href={getWhatsAppUrl(COMPANY.whatsapp)} target="_blank" rel="noreferrer" onClick={() => trackEvent('whatsapp_click', { context: 'footer' })} className="hover:text-gold transition-colors">WhatsApp</a></li>
                <li className="flex items-center gap-2"><Clock size={14} className="text-gold shrink-0" /> {language === Language.EN ? COMPANY.hoursEn : COMPANY.hoursEs}</li>
              </ul>
            </div>
            <div>
              <h4 className="text-cream font-serif font-bold mb-4">{language === Language.EN ? 'Follow Us' : 'Síguenos'}</h4>
              <div className="flex gap-4 mb-6">
                <a href={COMPANY.social.instagram} className="hover:text-gold transition-colors" aria-label="Instagram"><Instagram size={20} /></a>
                <a href={COMPANY.social.facebook} className="hover:text-gold transition-colors" aria-label="Facebook"><Facebook size={20} /></a>
                {COMPANY.social.youtube && (
                  <a href={COMPANY.social.youtube} className="hover:text-gold transition-colors" aria-label="YouTube"><Youtube size={20} /></a>
                )}
              </div>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
            <span>© {new Date().getFullYear()} {COMPANY.name}. {language === Language.EN ? 'All rights reserved.' : 'Todos los derechos reservados.'}</span>
            <Link to="/privacy" className="hover:text-gold transition-colors">{language === Language.EN ? 'Privacy Policy' : 'Política de Privacidad'}</Link>
          </div>
        </div>
      </footer>

      {/* Mobile sticky action bar: Call | WhatsApp | Get Quote */}
      <div className="lg:hidden fixed bottom-0 w-full bg-ink border-t border-gold/20 shadow-[0_-4px_12px_-2px_rgba(0,0,0,0.3)] flex items-stretch z-50">
        <a
          href={getTelUrl(COMPANY.phone)}
          onClick={() => trackEvent('call_click', { context: 'sticky_bar' })}
          className="flex-1 flex flex-col items-center justify-center text-cream/80 active:text-gold py-2.5 min-h-[56px]"
        >
          <Phone size={20} />
          <span className="text-[10px] font-medium mt-0.5">{language === Language.EN ? 'Call' : 'Llamar'}</span>
        </a>
        <div className="w-px bg-white/10" />
        <a
          href={getWhatsAppUrl(COMPANY.whatsapp)}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackEvent('whatsapp_click', { context: 'sticky_bar' })}
          className="flex-1 flex flex-col items-center justify-center text-cream/80 active:text-green-400 py-2.5 min-h-[56px]"
        >
          <MessageCircle size={20} />
          <span className="text-[10px] font-medium mt-0.5">WhatsApp</span>
        </a>
        <button
          onClick={onBookClick}
          className="flex-[1.4] flex flex-col items-center justify-center bg-gold text-ink font-bold py-2.5 min-h-[56px]"
        >
          <ClipboardList size={20} />
          <span className="text-[10px] mt-0.5">{language === Language.EN ? 'Get Quote' : 'Presupuesto'}</span>
        </button>
      </div>
    </div>
  );
};

export default Layout;
