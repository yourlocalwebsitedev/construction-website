import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storage';
import { Service, Project, Review, Language, ServiceCategory } from '../types';
import { TRANSLATIONS } from '../constants';
import { Star, MapPin, ChevronRight, Upload, X, Shield, Award, Users, Hammer, CheckCircle } from 'lucide-react';

interface PageProps {
  language: Language;
  onBookClick?: (serviceId?: string) => void;
}

// --- HOME PAGE ---
export const HomePage: React.FC<PageProps> = ({ language, onBookClick }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const t = TRANSLATIONS[language];

  useEffect(() => {
    setProjects(storageService.getProjects().filter(p => p.featured).slice(0, 3));
    setReviews(storageService.getReviews().slice(0, 3));
  }, []);

  return (
    <div>
      {/* Hero */}
      <div className="relative h-[600px] bg-secondary flex items-center justify-center text-center px-4 overflow-hidden">
        {/* Fixed: Used a highly reliable, standard construction architectural image */}
        <img 
          src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1920&q=80" 
          alt="Construction background" 
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight animate-fade-in-up">
            {t.home.heroTitle}
          </h1>
          <p className="text-xl text-gray-300">
            {t.home.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <button 
              onClick={() => onBookClick?.()}
              className="bg-primary hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform hover:scale-105"
            >
              {t.home.cta}
            </button>
          </div>
        </div>
      </div>

      {/* Featured Projects */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 border-b-4 border-primary w-max mx-auto pb-2">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map(p => (
            <div key={p.id} className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer">
              <img src={p.images[0]} alt={p.title[language]} className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                <span className="text-primary text-xs font-bold uppercase tracking-wider">{p.category}</span>
                <h3 className="text-white text-xl font-bold mt-1">{p.title[language]}</h3>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <a href="#/portfolio" className="inline-flex items-center text-primary font-bold hover:underline">
            View All Projects <ChevronRight size={20} />
          </a>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-100 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Client Reviews</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map(r => (
              <div key={r.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex text-primary mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill={i < r.rating ? "currentColor" : "none"} className={i < r.rating ? "text-primary" : "text-gray-300"} />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{r.text[language]}"</p>
                <div className="font-bold text-gray-800">{r.author}</div>
                <div className="text-xs text-gray-400">{new Date(r.date).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// --- SERVICES PAGE ---
export const ServicesPage: React.FC<PageProps> = ({ language, onBookClick }) => {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    setServices(storageService.getServices());
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-12 text-center">Our Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map(service => (
          <div key={service.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 flex flex-col">
            <div className="h-48 overflow-hidden">
              <img src={service.imageUrl} alt={service.title[language]} className="w-full h-full object-cover" />
            </div>
            <div className="p-6 flex-grow flex flex-col">
              <div className="flex items-center justify-between mb-2">
                 <span className="text-xs font-bold text-primary uppercase bg-primary/10 px-2 py-1 rounded">{service.category}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">{service.title[language]}</h3>
              <p className="text-gray-600 mb-6 flex-grow">{service.description[language]}</p>
              <button 
                onClick={() => onBookClick?.(service.id)}
                className="w-full bg-secondary text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Book This Service
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- PORTFOLIO PAGE ---
export const PortfolioPage: React.FC<PageProps> = ({ language }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<ServiceCategory | 'All'>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    setProjects(storageService.getProjects());
  }, []);

  const filteredProjects = filter === 'All' ? projects : projects.filter(p => p.category === filter);

  return (
    <div className="max-w-7xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Our Portfolio</h1>
      
      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {['All', ...Object.values(ServiceCategory)].map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat as any)}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${filter === cat ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map(project => (
          <div 
            key={project.id} 
            onClick={() => setSelectedProject(project)}
            className="group cursor-pointer rounded-xl overflow-hidden shadow-md relative aspect-[4/3]"
          >
            <img src={project.images[0]} alt={project.title[language]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="text-center text-white p-4">
                <h3 className="text-xl font-bold mb-2">{project.title[language]}</h3>
                <p className="text-sm line-clamp-2">{project.description[language]}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90" onClick={() => setSelectedProject(null)}>
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto no-scrollbar" onClick={e => e.stopPropagation()}>
            <div className="relative h-64 sm:h-96">
              <img src={selectedProject.images[0]} className="w-full h-full object-cover" />
              <button onClick={() => setSelectedProject(null)} className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-white text-black"><X /></button>
            </div>
            <div className="p-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                   <span className="text-primary font-bold text-sm uppercase tracking-wider">{selectedProject.category}</span>
                   <h2 className="text-3xl font-bold mt-1">{selectedProject.title[language]}</h2>
                </div>
                <div className="text-gray-500 text-sm">{selectedProject.completionDate}</div>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg mb-8">{selectedProject.description[language]}</p>
              
              <h4 className="font-bold mb-4 text-gray-800">Project Gallery</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {selectedProject.images.map((img, i) => (
                  <img key={i} src={img} className="rounded-lg h-24 w-full object-cover cursor-pointer hover:opacity-80" />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- ABOUT PAGE ---
export const AboutPage: React.FC<PageProps> = ({ language }) => {
  const t = TRANSLATIONS[language].about;

  return (
    <div>
      {/* Hero */}
      <div className="bg-secondary text-white py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{t.title}</h1>
          <p className="text-xl text-primary font-medium">{t.subtitle}</p>
        </div>
      </div>

      {/* Story & Mission */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80" 
              alt="Construction planning" 
              className="rounded-2xl shadow-xl w-full h-[400px] object-cover" 
            />
          </div>
          <div className="md:w-1/2 space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="w-12 h-1 bg-primary mr-4"></span>
                {t.storyTitle}
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">{t.storyText}</p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="w-12 h-1 bg-primary mr-4"></span>
                {t.missionTitle}
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">{t.missionText}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="bg-secondary py-16 px-4 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: t.stats.years, val: '18+' },
            { label: t.stats.projects, val: '500+' },
            { label: t.stats.clients, val: '100%' },
            { label: t.stats.team, val: '45' },
          ].map((stat, i) => (
            <div key={i} className="p-4">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.val}</div>
              <div className="text-sm md:text-base font-medium uppercase tracking-wider opacity-80">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 px-4 max-w-7xl mx-auto bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-16 text-gray-800">Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <ValueCard icon={<Award size={32} />} title={t.values.quality.title} desc={t.values.quality.desc} />
          <ValueCard icon={<Shield size={32} />} title={t.values.integrity.title} desc={t.values.integrity.desc} />
          <ValueCard icon={<CheckCircle size={32} />} title={t.values.safety.title} desc={t.values.safety.desc} />
          <ValueCard icon={<Hammer size={32} />} title={t.values.innovation.title} desc={t.values.innovation.desc} />
        </div>
      </section>
    </div>
  );
};

const ValueCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all hover:-translate-y-1 text-center">
    <div className="w-16 h-16 mx-auto bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
    <p className="text-gray-600">{desc}</p>
  </div>
);

// --- CONTACT PAGE ---
export const ContactPage: React.FC<PageProps> = ({ language }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    const inquiry = {
      id: Date.now().toString(),
      ...formData,
      attachmentUrl: file ? URL.createObjectURL(file) : undefined,
      date: new Date().toISOString()
    };
    storageService.addInquiry(inquiry as any);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
        <div className="bg-green-100 p-6 rounded-full text-green-600 mb-6"><Check size={48} /></div>
        <h2 className="text-3xl font-bold mb-4">Message Sent!</h2>
        <p className="text-gray-600 max-w-md">Thanks for reaching out. Our team will review your inquiry and photo(s) and get back to you within 24 hours.</p>
        <button onClick={() => setSubmitted(false)} className="mt-8 text-primary font-bold hover:underline">Send another message</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Contact Us & Get a Quote</h1>
      
      {/* Contact & Form Section */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row mb-12">
        
        {/* Contact Info */}
        <div className="bg-secondary text-white p-10 md:w-1/3 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-6">Contact Info</h3>
            <div className="space-y-6">
              <div className="flex items-start">
                <MapPin className="mt-1 mr-4 shrink-0 text-primary" />
                <p>225 N Cotner Blvd,<br/>Lincoln, NE 68505</p>
              </div>
              <div className="flex items-center">
                 <div className="w-6 mr-4 flex justify-center text-primary font-bold">@</div>
                 <p>hello@buildright.com</p>
              </div>
              <div className="flex items-center">
                 <div className="w-6 mr-4 flex justify-center text-primary font-bold">#</div>
                 <p>(555) 123-4567</p>
              </div>
            </div>
          </div>
          <div className="mt-12">
            <h4 className="font-bold mb-4 text-primary">Service Areas</h4>
            <div className="flex flex-wrap gap-2">
              {['Downtown', 'Westside', 'North Hills', 'Suburbs'].map(area => (
                <span key={area} className="bg-white/10 px-3 py-1 rounded-full text-xs">{area}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-10 md:w-2/3">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Name</label>
                <input required type="text" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none" 
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                <input required type="email" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none" 
                   value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Project Details</label>
              <textarea required rows={4} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary outline-none" 
                 value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
                 placeholder="Describe your project, timeline, and budget..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Upload Photos (Optional)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors relative">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center pointer-events-none">
                  <Upload className="text-gray-400 mb-2" size={32} />
                  <span className="text-sm text-gray-500">{file ? file.name : "Click to upload or drag and drop"}</span>
                </div>
              </div>
            </div>

            <button type="submit" className="w-full bg-primary text-white font-bold py-4 rounded-lg hover:bg-amber-600 transition-all shadow-lg">
              Send Request
            </button>
          </form>
        </div>
      </div>

      {/* Google Maps Section */}
      <div>
         <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Find Us on the Map</h2>
         <div className="w-full h-96 bg-gray-200 rounded-2xl overflow-hidden shadow-lg relative">
           <iframe 
             src="https://maps.google.com/maps?q=225+N+Cotner+Blvd,+Lincoln,+NE+68505&t=&z=15&ie=UTF8&iwloc=&output=embed"
             width="100%" 
             height="100%" 
             style={{ border: 0 }} 
             allowFullScreen 
             loading="lazy" 
             referrerPolicy="no-referrer-when-downgrade"
             className="absolute inset-0"
           ></iframe>
         </div>
      </div>

    </div>
  );
};

// Import Check icon for success state
import { Check } from 'lucide-react';