import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import BookingSystem from './components/BookingSystem';
import { HomePage, ServicesPage, PortfolioPage, ContactPage, AboutPage } from './pages/PublicPages';
import { AdminDashboard } from './pages/AdminDashboard';
import { Language } from './types';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>(Language.EN);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<string | undefined>(undefined);

  const openBooking = (serviceId?: string) => {
    setPreselectedService(serviceId);
    setIsBookingOpen(true);
  };

  return (
    <HashRouter>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        
        <Route path="*" element={
          <Layout language={language} setLanguage={setLanguage} onBookClick={() => openBooking()}>
             <Routes>
                <Route path="/" element={<HomePage language={language} onBookClick={openBooking} />} />
                <Route path="/services" element={<ServicesPage language={language} onBookClick={openBooking} />} />
                <Route path="/portfolio" element={<PortfolioPage language={language} />} />
                <Route path="/about" element={<AboutPage language={language} />} />
                <Route path="/contact" element={<ContactPage language={language} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
             </Routes>
          </Layout>
        } />
      </Routes>

      {/* Booking Modal Overlay */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/60 backdrop-blur-sm">
          <div className="min-h-full flex items-center justify-center p-4">
            <BookingSystem 
              language={language}
              preselectedServiceId={preselectedService}
              onClose={() => setIsBookingOpen(false)}
            />
          </div>
        </div>
      )}
    </HashRouter>
  );
};

export default App;