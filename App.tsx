import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import EstimateSystem from './features/booking/EstimateSystem';
import { HomePage, ServicesPage, PortfolioPage, ContactPage, AboutPage } from './pages/PublicPages';
import { ServiceDetailPage, ReviewsPage, VideosPage } from './pages/MorePages';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { AdminGate } from './pages/admin/AdminGate';
import { AdminDashboardHome } from './pages/admin/AdminDashboardHome';
import { AdminLeadsList } from './pages/admin/AdminLeadsList';
import { AdminLeadDetail } from './pages/admin/AdminLeadDetail';
import { AdminProjectsList } from './pages/admin/AdminProjectsList';
import { AdminProjectForm } from './pages/admin/AdminProjectForm';
import { AdminServicesList, AdminServiceForm } from './pages/admin/AdminServices';
import { AdminReviewsList, AdminReviewForm } from './pages/admin/AdminReviews';
import { AdminSettings } from './pages/admin/AdminSettings';
import { AdminQuickUpload, AdminQuickUploadSaved } from './pages/admin/AdminQuickUpload';
import { Language } from './types';
import { getStoredLanguage, setStoredLanguage } from './services/preferences';
import { trackEvent } from './services/analytics';

const App: React.FC = () => {
  const [language, setLanguageState] = useState<Language>(getStoredLanguage());
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<string | undefined>(undefined);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setStoredLanguage(lang);
    trackEvent('language_changed', { language: lang });
  };

  const openBooking = (serviceId?: string) => {
    setPreselectedService(serviceId);
    setIsBookingOpen(true);
  };

  return (
    <HashRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminGate />}>
          <Route index element={<AdminDashboardHome />} />
          <Route path="leads" element={<AdminLeadsList />} />
          <Route path="leads/:id" element={<AdminLeadDetail />} />
          <Route path="projects" element={<AdminProjectsList />} />
          <Route path="projects/:id" element={<AdminProjectForm />} />
          <Route path="quick-upload" element={<AdminQuickUpload />} />
          <Route path="quick-upload/saved" element={<AdminQuickUploadSaved />} />
          <Route path="services" element={<AdminServicesList />} />
          <Route path="services/:id" element={<AdminServiceForm />} />
          <Route path="reviews" element={<AdminReviewsList />} />
          <Route path="reviews/:id" element={<AdminReviewForm />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        <Route path="/jobs-admin" element={<Navigate to="/admin/quick-upload" replace />} />
        
        <Route path="*" element={
          <Layout language={language} setLanguage={setLanguage} onBookClick={() => openBooking()}>
             <Routes>
                <Route path="/" element={<HomePage language={language} onBookClick={openBooking} />} />
                <Route path="/services" element={<ServicesPage language={language} onBookClick={openBooking} />} />
                <Route path="/services/:slug" element={<ServiceDetailPage language={language} onBookClick={openBooking} />} />
                <Route path="/projects" element={<PortfolioPage language={language} />} />
                <Route path="/projects/:id" element={<ProjectDetailPage language={language} />} />
                <Route path="/before-after" element={<Navigate to="/projects" replace />} />
                <Route path="/videos" element={<VideosPage language={language} />} />
                <Route path="/reviews" element={<ReviewsPage language={language} />} />
                <Route path="/about" element={<AboutPage language={language} />} />
                <Route path="/contact" element={<ContactPage language={language} onBookClick={openBooking} />} />
                {/* Legacy route redirects */}
                <Route path="/portfolio" element={<Navigate to="/projects" replace />} />
                <Route path="/project/:id" element={<Navigate to="/projects" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
             </Routes>
          </Layout>
        } />
      </Routes>

      {/* Estimate Modal Overlay */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-black/60 backdrop-blur-sm">
          <div className="min-h-full flex items-center justify-center p-4">
            <EstimateSystem
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
