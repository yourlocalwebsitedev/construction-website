import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getServices, getProjects, getReviews, getServiceAreas, isFirestoreUnavailable, markFirestoreUnavailable } from "../services/db";
import { Service, Project, Review, Language, ServiceCategory } from "../types";
import { TRANSLATIONS, COMPANY, BEFORE_AFTER_ITEMS, SERVICE_AREAS } from "../constants";
import BeforeAfterSlider from "../components/common/BeforeAfterSlider";
import { trackEvent } from "../services/analytics";
import { getWhatsAppUrl, getTelUrl } from "../services/contactLinks";
import {
  Star,
  MapPin,
  ChevronRight,
  Shield,
  Award,
  Hammer,
  CheckCircle,
  ShieldCheck,
  Phone,
  Mail,
  MessageSquare,
  Check,
  MessageCircle,
  Image as ImageIcon,
  Video as VideoIcon,
  Sparkles,
  ClipboardCheck,
  Eye,
  MessageCircleMore,
  Brush,
  Wand2,
} from "lucide-react";

interface PageProps {
  language: Language;
  onBookClick?: (serviceId?: string) => void;
}

const SectionEyebrow: React.FC<{ children: React.ReactNode; light?: boolean; className?: string }> = ({ children, light, className }) => (
  <div className={`text-xs font-bold tracking-[0.2em] mb-3 ${light ? 'text-gold' : 'text-gold'} ${className || ''}`}>
    {children}
  </div>
);

// ============================================================
// HOME PAGE
// ============================================================
export const HomePage: React.FC<PageProps> = ({ language, onBookClick }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const t = TRANSLATIONS[language];

  useEffect(() => {
    let mounted = true;
    Promise.all([getProjects(), getReviews(), getServices()]).then(([p, r, s]) => {
      if (!mounted) return;
      setProjects(p.filter((proj) => proj.featured).slice(0, 3));
      setReviews(r.slice(0, 3));
      setServices(s.filter((svc) => svc.isPillar));
    });
    return () => { mounted = false; };
  }, []);

  return (
    <div>
      {/* ============ HERO ============ */}
      <section className="relative bg-ink flex items-center px-4 overflow-hidden py-16 sm:py-24 md:min-h-[680px] md:py-0">
        <div className="absolute inset-0 hero-animated-bg" />
        <div className="absolute inset-0 hero-light-sweep" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        <div className="relative z-10 max-w-3xl mx-auto text-center sm:py-16">
          <SectionEyebrow className="mb-5 sm:mb-3">{t.home.eyebrow}</SectionEyebrow>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-cream leading-[1.15]">
            {t.home.heroTitleLine1}
            <br />
            {t.home.heroTitleLine2}
          </h1>
          <p className="text-cream/80 text-base md:text-lg max-w-xl mx-auto mt-8 sm:mt-6 md:mt-7 leading-relaxed">
            {t.home.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-7 sm:mt-9 md:mt-10">
            <button
              onClick={() => onBookClick?.()}
              className="bg-gold hover:bg-gold-light text-ink font-bold py-3.5 px-8 rounded-md text-sm tracking-wide transition-all shadow-lg shadow-gold/20"
            >
              {t.home.ctaEstimate}
            </button>
            <Link
              to="/projects"
              className="bg-transparent border border-cream/40 hover:border-gold hover:text-gold text-cream font-bold py-3.5 px-8 rounded-md text-sm tracking-wide transition-all text-center"
            >
              {t.home.ctaViewWork}
            </Link>
          </div>
        </div>
      </section>

      {/* ============ TRUST ============ */}
      <section className="bg-cream py-8 px-4 border-b border-ink/5">
        <div className="max-w-6xl mx-auto grid grid-cols-3 gap-2 sm:gap-6">
          <TrustItem icon={<ShieldCheck size={26} />} title={t.home.trust.licensed} sub={COMPANY.licenseNumber || (language === Language.EN ? 'General Contractor' : 'Contratista General')} />
          <TrustItem icon={<Award size={26} />} title={t.home.trust.warranty} sub={COMPANY.warrantyYears ? `${COMPANY.warrantyYears}-Year` : (language === Language.EN ? 'On qualifying work' : 'En trabajos calificados')} />
          <TrustItem
            icon={<Star size={26} />}
            title={t.home.trust.rating}
            sub={COMPANY.googleRating ? `${COMPANY.googleRating}/5 · ${COMPANY.googleReviewCount}+ ${language === Language.EN ? 'reviews' : 'reseñas'}` : (language === Language.EN ? 'Read our reviews' : 'Lee nuestras reseñas')}
          />
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-3 gap-3 mt-6 text-center">
          <MiniTrust label={t.home.trust.craftsmanship} />
          <MiniTrust label={t.home.trust.service} />
          <MiniTrust label={t.home.trust.freeEstimates} />
        </div>
      </section>

      {/* ============ MORE THAN THE FINISH ============ */}
      <section className="bg-ink py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <SectionEyebrow>{t.home.moreThanFinish.eyebrow}</SectionEyebrow>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-cream">{t.home.moreThanFinish.title}</h2>
          <p className="text-cream/70 mt-5 leading-relaxed max-w-2xl mx-auto">{t.home.moreThanFinish.body}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-1 mt-10 flex-wrap">
            {t.home.moreThanFinish.diagram.map((step, i) => (
              <React.Fragment key={step}>
                <span className="text-[11px] sm:text-xs font-bold tracking-wide text-cream bg-white/5 border border-gold/30 rounded-full px-4 py-2 whitespace-nowrap">
                  {step}
                </span>
                {i < t.home.moreThanFinish.diagram.length - 1 && (
                  <ChevronRight size={16} className="text-gold shrink-0 rotate-90 sm:rotate-0" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* ============ BEFORE & AFTER ============ */}
      <section className="py-16 md:py-24 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10">
          <div>
            <SectionEyebrow>{t.home.beforeAfter.eyebrow}</SectionEyebrow>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink">{t.home.beforeAfter.title}</h2>
            <p className="text-body mt-2">{t.home.beforeAfter.subtitle}</p>
          </div>
          <Link to="/before-after" className="hidden sm:inline-flex items-center text-gold font-bold text-sm mt-4 sm:mt-0 hover:underline">
            {t.home.beforeAfter.viewAll} <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BEFORE_AFTER_ITEMS.slice(0, 3).map((item) => (
            <div key={item.id}>
              <BeforeAfterSlider beforeSrc={item.beforeImage} afterSrc={item.afterImage} onInteract={() => trackEvent('before_after_interaction', { itemId: item.id })} />
              <div className="mt-3">
                <span className="text-[10px] font-bold tracking-wider text-gold uppercase">{item.category}</span>
                <h3 className="font-serif font-bold text-ink text-lg">{item.title[language]}</h3>
                <p className="text-xs text-body/70 flex items-center gap-1 mt-1"><MapPin size={12} /> {item.location}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10 sm:hidden">
          <Link to="/before-after" className="inline-flex items-center text-gold font-bold text-sm hover:underline">
            {t.home.beforeAfter.viewAll} <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      {/* ============ SERVICES ============ */}
      <section className="bg-softcream py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10">
            <div>
              <SectionEyebrow>{t.home.services.eyebrow}</SectionEyebrow>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink">{t.home.services.title}</h2>
            </div>
            <Link to="/services" className="hidden sm:inline-flex items-center text-gold font-bold text-sm mt-4 sm:mt-0 hover:underline">
              {t.home.services.viewAll} <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {services.map((service) => (
              <Link
                key={service.id}
                to={`/services/${service.slug}`}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-ink/5"
              >
                <div className="h-24 sm:h-36 overflow-hidden">
                  <img
                    src={service.imageUrl}
                    alt={service.title[language]}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="font-serif font-bold text-ink text-sm sm:text-base leading-tight">{service.title[language]}</h3>
                  <p className="text-[11px] sm:text-xs text-body/70 mt-1 line-clamp-2 hidden sm:block">{service.shortDescription[language]}</p>
                  <span className="inline-flex items-center text-gold text-[11px] sm:text-xs font-bold mt-2">
                    {t.home.services.learnMore} <ChevronRight size={12} className="ml-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8 sm:hidden">
            <Link to="/services" className="inline-flex items-center text-gold font-bold text-sm hover:underline">
              {t.home.services.viewAll} <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ FEATURED PROJECTS ============ */}
      <section className="py-16 md:py-24 px-4 max-w-7xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink text-center mb-12">
          {t.home.featuredProjects}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((p) => (
            <Link
              key={p.id}
              to={`/projects/static-${p.id}`}
              className="group rounded-xl overflow-hidden shadow-lg border border-ink/5 bg-white block"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={p.images[0]}
                  alt={p.title[language]}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <span className="absolute top-3 left-3 bg-gold text-ink text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                  {p.category}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-serif font-bold text-lg text-ink">{p.title[language]}</h3>
                {p.location && (
                  <p className="text-xs text-body/70 flex items-center gap-1 mt-1"><MapPin size={12} /> {p.location}</p>
                )}
                <p className="text-sm text-body/80 mt-2 line-clamp-2">{p.description[language]}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-body/60">
                  <span className="flex items-center gap-1"><ImageIcon size={12} /> {p.images.length} {t.home.photos}</span>
                  {p.videoUrl && <span className="flex items-center gap-1"><VideoIcon size={12} /> 1 {t.home.videos}</span>}
                </div>
                <span className="inline-flex items-center text-gold font-bold text-sm mt-3">
                  {t.home.viewProject} <ChevronRight size={14} className="ml-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/projects" className="inline-flex items-center text-gold font-bold hover:underline">
            {t.home.viewAllProjects} <ChevronRight size={20} />
          </Link>
        </div>
      </section>

      {/* ============ WHY K&L ============ */}
      <section className="bg-ink py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <SectionEyebrow>{t.home.whyUs.eyebrow}</SectionEyebrow>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-cream mb-12">{t.home.whyUs.title}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-left">
            <WhyCard icon={<Sparkles size={22} />} label={t.home.whyUs.items.quality} />
            <WhyCard icon={<Brush size={22} />} label={t.home.whyUs.items.prep} />
            <WhyCard icon={<Eye size={22} />} label={t.home.whyUs.items.detail} />
            <WhyCard icon={<MessageCircleMore size={22} />} label={t.home.whyUs.items.comm} />
            <WhyCard icon={<ClipboardCheck size={22} />} label={t.home.whyUs.items.clean} />
            <WhyCard icon={<Wand2 size={22} />} label={t.home.whyUs.items.results} />
          </div>
        </div>
      </section>

      {/* ============ REVIEWS ============ */}
      <section className="bg-softcream py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center mb-12 flex-col">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink mb-2">{t.home.testimonials}</h2>
            <div className="flex items-center gap-2 text-body bg-white px-4 py-2 rounded-full shadow-sm">
              <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" className="w-5 h-5" alt="Google" />
              {COMPANY.googleRating ? (
                <>
                  <span className="font-bold text-ink">{COMPANY.googleRating}</span>
                  <div className="flex text-gold">
                    {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                  <span className="text-xs text-body/60">({COMPANY.googleReviewCount}+)</span>
                </>
              ) : (
                <span className="text-xs text-body/60">{language === Language.EN ? 'Google Reviews coming soon' : 'Reseñas de Google próximamente'}</span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((r) => (
              <div key={r.id} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow relative">
                <div className="absolute top-6 right-6 text-ink/10"><MessageSquare size={40} /></div>
                <div className="flex text-gold mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < r.rating ? "currentColor" : "none"} className={i < r.rating ? "text-gold" : "text-ink/20"} />
                  ))}
                </div>
                <p className="text-body mb-6 italic text-lg leading-relaxed">"{r.text[language]}"</p>
                <div>
                  <div className="font-bold text-ink">{r.author}</div>
                  <div className="text-xs text-body/50 flex items-center mt-1">
                    <CheckCircle size={10} className="mr-1 text-green-600" /> {t.home.verifiedClient} • {r.source || 'Google'}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/reviews" className="inline-flex items-center bg-ink text-cream hover:bg-charcoal font-bold text-sm px-6 py-3 rounded-md tracking-wide transition-colors">
              {t.home.viewGoogleReviews}
            </Link>
          </div>
        </div>
      </section>

      {/* ============ ABOUT PREVIEW ============ */}
      <section className="py-16 md:py-24 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-10 items-center">
          <div className="md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=800&q=80"
              alt="Craftsmanship"
              className="rounded-xl shadow-xl w-full h-[320px] object-cover"
            />
          </div>
          <div className="md:w-1/2">
            <SectionEyebrow>{language === Language.EN ? 'ABOUT US' : 'NOSOTROS'}</SectionEyebrow>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-ink mb-4">
              {TRANSLATIONS[language].about.title}<br />{TRANSLATIONS[language].about.titleLine2}
            </h2>
            <p className="text-body leading-relaxed mb-6">{TRANSLATIONS[language].about.storyText}</p>
            <Link to="/about" className="inline-flex items-center text-gold font-bold hover:underline">
              {t.nav.about} <ChevronRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ SERVICE AREA ============ */}
      <section className="bg-softcream py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-ink mb-2">{t.home.serviceArea.title}</h2>
          <p className="text-body mb-6">{t.home.serviceArea.subtitle}</p>
          <div className="flex flex-wrap justify-center gap-3">
            {SERVICE_AREAS.map((a, i) => (
              <span key={i} className="bg-white border border-gold/30 text-ink text-sm px-4 py-2 rounded-full flex items-center gap-2">
                <MapPin size={14} className="text-gold" /> {a.city}, {a.state}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="bg-ink py-16 md:py-24 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-cream leading-tight">
            {t.home.finalCta.title1}<br />{t.home.finalCta.title2}
          </h2>
          <p className="text-cream/70 mt-5 text-lg">{t.home.finalCta.subtitle}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <button
              onClick={() => onBookClick?.()}
              className="bg-gold hover:bg-gold-light text-ink font-bold py-4 px-10 rounded-md text-sm tracking-wide transition-all shadow-lg shadow-gold/20"
            >
              {t.home.finalCta.estimate}
            </button>
            <a
              href={`tel:${COMPANY.phone}`}
              className="border border-cream/40 hover:border-gold hover:text-gold text-cream font-bold py-4 px-10 rounded-md text-sm tracking-wide transition-all"
            >
              {t.home.finalCta.call}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

const TrustItem: React.FC<{ icon: React.ReactNode; title: string; sub: string }> = ({ icon, title, sub }) => (
  <div className="flex flex-col items-center text-center gap-2 p-3">
    <div className="text-gold shrink-0">{icon}</div>
    <div>
      <div className="font-bold text-xs sm:text-sm md:text-base text-ink leading-tight">{title}</div>
      <div className="text-[10px] sm:text-xs text-body/60">{sub}</div>
    </div>
  </div>
);

const MiniTrust: React.FC<{ label: string }> = ({ label }) => (
  <div className="bg-white border border-gold/20 rounded-lg py-3 px-2 text-[11px] sm:text-xs font-semibold text-ink">
    {label}
  </div>
);

const WhyCard: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex items-center gap-4 hover:border-gold/40 transition-colors">
    <div className="text-gold shrink-0">{icon}</div>
    <span className="text-cream font-medium text-sm">{label}</span>
  </div>
);

// ============================================================
// SERVICES PAGE
// ============================================================
export const ServicesPage: React.FC<PageProps> = ({ language, onBookClick }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const t = TRANSLATIONS[language];

  useEffect(() => {
    getServices().then((data) => {
      setServices(data);
      setLoading(false);
    });
  }, []);

  const pillars = services.filter((s) => s.isPillar);
  const subServicesFor = (slug: string) => services.filter((s) => s.parentSlug === slug);

  const ServiceCard: React.FC<{ service: Service; large?: boolean }> = ({ service, large }) => (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-ink/5 flex flex-col group hover:shadow-xl transition-shadow">
      <div className={`${large ? 'h-56' : 'h-40'} overflow-hidden relative`}>
        <img src={service.imageUrl} alt={service.title[language]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      </div>
      <div className="p-5 sm:p-6 flex-grow flex flex-col">
        {service.assemblySummary && (
          <p className="text-[10px] font-bold tracking-wide text-gold uppercase mb-1">{service.assemblySummary[language]}</p>
        )}
        <h3 className={`font-serif ${large ? 'text-2xl' : 'text-lg'} font-bold text-ink mb-2`}>{service.title[language]}</h3>
        <p className="text-body/80 text-sm mb-6 flex-grow">{service.shortDescription[language]}</p>
        <div className="flex gap-2">
          <Link
            to={`/services/${service.slug}`}
            className="flex-1 text-center border border-gold text-gold py-2.5 rounded-lg font-bold text-sm hover:bg-gold hover:text-ink transition-colors"
          >
            {t.home.services.learnMore}
          </Link>
          <button
            onClick={() => onBookClick?.(service.id)}
            className="flex-1 bg-ink text-cream py-2.5 rounded-lg font-bold text-sm hover:bg-charcoal transition-colors"
          >
            {t.services.bookService}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="bg-ink py-14 md:py-20 px-4 text-center">
        <SectionEyebrow>{t.home.services.eyebrow}</SectionEyebrow>
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-cream">{t.services.title}</h1>
      </div>
      <div className="max-w-7xl mx-auto py-12 md:py-16 px-4 space-y-16">
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
            <p className="mt-4 text-body">{t.common.loading}</p>
          </div>
        )}

        {!loading && pillars.map((pillar) => {
          const subs = subServicesFor(pillar.slug);
          return (
            <div key={pillar.id}>
              <div className="mb-6">
                <ServiceCard service={pillar} large />
              </div>
              {subs.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                  {subs.map((s) => <ServiceCard key={s.id} service={s} />)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================
// PROJECTS / PORTFOLIO PAGE
// ============================================================
export const PortfolioPage: React.FC<PageProps> = ({ language }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [firebaseJobs, setFirebaseJobs] = useState<any[]>([]);
  const [filter, setFilter] = useState<ServiceCategory | "All">("All");
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'projects' | 'beforeAfter'>('projects');
  const [baFilter, setBaFilter] = useState<string>('All');
  const t = TRANSLATIONS[language];

  useEffect(() => {
    loadAllProjects();
  }, []);

  const loadAllProjects = async () => {
    const staticProjects = await getProjects();
    setProjects(staticProjects);
    if (isFirestoreUnavailable()) {
      setLoading(false);
      return;
    }
    try {
      const { collection, query, orderBy, getDocs } = await import("firebase/firestore");
      const { db } = await import("../firebase.config");
      const q = query(collection(db, "jobs"), orderBy("createdAt", "desc"));
      const querySnapshot = await Promise.race([
        getDocs(q),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error('jobs fetch timed out')), 3000)),
      ]);
      const jobs: any[] = [];
      querySnapshot.forEach((doc) => jobs.push({ id: doc.id, ...doc.data() }));
      setFirebaseJobs(jobs);
    } catch (error) {
      console.error("Error fetching Firebase jobs:", error);
      markFirestoreUnavailable();
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  const getCategoryLabel = (cat: string) => {
    if (cat === "All") return t.portfolio.filterAll;
    if (cat === ServiceCategory.RESIDENTIAL) return t.portfolio.filterResidential;
    if (cat === ServiceCategory.COMMERCIAL) return t.portfolio.filterCommercial;
    if (cat === ServiceCategory.INTERIOR) return t.portfolio.filterInterior;
    return cat;
  };

  return (
    <div>
      <div className="bg-ink py-14 md:py-20 px-4 text-center">
        <SectionEyebrow>{t.portfolio.eyebrow}</SectionEyebrow>
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-cream">{t.portfolio.title}</h1>
      </div>

      {/* Projects / Before & After tabs — merged into one page/route */}
      <div className="bg-ink pb-6 px-4 flex justify-center">
        <div className="inline-flex rounded-full border border-gold/30 p-1 bg-white/5">
          <button
            onClick={() => setTab('projects')}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-colors ${tab === 'projects' ? 'bg-gold text-ink' : 'text-cream/70 hover:text-cream'}`}
          >
            {t.nav.projects}
          </button>
          <button
            onClick={() => setTab('beforeAfter')}
            className={`px-5 py-2 rounded-full text-sm font-bold transition-colors ${tab === 'beforeAfter' ? 'bg-gold text-ink' : 'text-cream/70 hover:text-cream'}`}
          >
            {t.nav.beforeAfter}
          </button>
        </div>
      </div>

      {tab === 'beforeAfter' ? (
        <div className="max-w-7xl mx-auto py-12 px-4">
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {['All', ...Array.from(new Set(BEFORE_AFTER_ITEMS.map((b) => b.category)))].map((cat) => (
              <button
                key={cat}
                onClick={() => setBaFilter(cat)}
                className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${baFilter === cat ? 'bg-gold text-ink' : 'bg-white border border-ink/10 text-body hover:border-gold'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(baFilter === 'All' ? BEFORE_AFTER_ITEMS : BEFORE_AFTER_ITEMS.filter((b) => b.category === baFilter)).map((item) => (
              <div key={item.id}>
                <BeforeAfterSlider beforeSrc={item.beforeImage} afterSrc={item.afterImage} onInteract={() => trackEvent('before_after_interaction', { itemId: item.id })} />
                <div className="mt-3">
                  <span className="text-[10px] font-bold tracking-wider text-gold uppercase">{item.category}</span>
                  <h3 className="font-serif font-bold text-ink text-lg">{item.title[language]}</h3>
                  <p className="text-xs text-body/70 flex items-center gap-1 mt-1"><MapPin size={12} /> {item.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {["All", ServiceCategory.RESIDENTIAL, ServiceCategory.COMMERCIAL, ServiceCategory.INTERIOR].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat as any)}
              className={`px-5 py-2 rounded-full font-medium text-sm transition-colors ${filter === cat ? "bg-gold text-ink" : "bg-white border border-ink/10 text-body hover:border-gold"}`}
            >
              {getCategoryLabel(cat)}
            </button>
          ))}
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
            <p className="mt-4 text-body">{t.portfolio.loadingPortfolio}</p>
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Link
                key={project.id}
                to={`/projects/static-${project.id}`}
                className="group cursor-pointer rounded-xl overflow-hidden shadow-lg relative aspect-[4/3] hover:shadow-2xl transition-shadow block"
              >
                <img src={project.images[0]} alt={project.title[language]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/10"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-cream p-6">
                  <h3 className="font-serif text-2xl font-bold mb-2 drop-shadow-lg">{project.title[language]}</h3>
                  <p className="text-sm opacity-90 mb-4 line-clamp-2 drop-shadow">{project.description[language]}</p>
                  <button className="bg-gold hover:bg-gold-light text-ink px-6 py-2 rounded-lg font-semibold transition-all transform group-hover:scale-105">
                    {t.portfolio.viewProject}
                  </button>
                </div>
              </Link>
            ))}

            {filter === "All" && firebaseJobs.map((job) => {
              const firstImage = job.imageUrls && job.imageUrls.length > 0 ? job.imageUrls[0] : job.imageUrl;
              const totalImages = (job.imageUrls?.length || 0) + (job.imageUrl && !job.imageUrls?.includes(job.imageUrl) ? 1 : 0);
              return (
                <Link
                  key={`firebase-${job.id}`}
                  to={`/projects/${job.id}`}
                  className="group cursor-pointer rounded-xl overflow-hidden shadow-lg relative aspect-[4/3] hover:shadow-2xl transition-shadow block"
                >
                  {firstImage ? (
                    <>
                      <img
                        src={firstImage}
                        alt={job.clientName}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                      {totalImages > 1 && (
                        <div className="absolute top-4 right-4 bg-ink/70 text-cream px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-sm">
                          {totalImages} {language === Language.EN ? "Photos" : "Fotos"}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gold/20 to-ink/20 flex items-center justify-center">
                      <ImageIcon className="w-16 h-16 text-body/40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/10"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-cream p-6">
                    <h3 className="font-serif text-2xl font-bold mb-2 drop-shadow-lg">{job.clientName}</h3>
                    <p className="text-sm opacity-90 mb-1 drop-shadow flex items-center"><MapPin size={14} className="mr-1" />{job.address}</p>
                    {job.description && <p className="text-xs opacity-80 mb-4 line-clamp-2 drop-shadow max-w-xs">{job.description}</p>}
                    <button className="bg-gold hover:bg-gold-light text-ink px-6 py-2 rounded-lg font-semibold transition-all transform group-hover:scale-105">
                      {t.portfolio.viewProject}
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {!loading && filteredProjects.length === 0 && firebaseJobs.length === 0 && (
          <div className="text-center py-20">
            <p className="text-body/60 text-lg">{language === Language.EN ? "No projects found." : "No se encontraron proyectos."}</p>
          </div>
        )}
      </div>
      )}
    </div>
  );
};

// ============================================================
// ABOUT PAGE
// ============================================================
export const AboutPage: React.FC<PageProps> = ({ language }) => {
  const t = TRANSLATIONS[language].about;

  return (
    <div>
      <div className="bg-ink text-cream py-16 md:py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-3xl md:text-5xl font-bold mb-3">{t.title}<br />{t.titleLine2}</h1>
          <p className="text-lg text-gold font-medium">{t.subtitle}</p>
        </div>
      </div>

      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=800&q=80"
              alt="K&L Pro-Finish craftsmanship"
              className="rounded-2xl shadow-xl w-full h-[400px] object-cover"
            />
          </div>
          <div className="md:w-1/2 space-y-8">
            <div>
              <h2 className="font-serif text-3xl font-bold text-ink mb-4 flex items-center">
                <span className="w-12 h-1 bg-gold mr-4"></span>{t.storyTitle}
              </h2>
              <p className="text-body leading-relaxed text-lg">{t.storyText}</p>
            </div>
            <div>
              <h2 className="font-serif text-3xl font-bold text-ink mb-4 flex items-center">
                <span className="w-12 h-1 bg-gold mr-4"></span>{t.missionTitle}
              </h2>
              <p className="text-body leading-relaxed text-lg">{t.missionText}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ink py-14 px-4 text-cream">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-xl p-8">
            <h3 className="font-serif text-2xl font-bold text-gold mb-3">{t.craftsmanshipTitle}</h3>
            <p className="text-cream/80 leading-relaxed">{t.craftsmanshipText}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-8">
            <h3 className="font-serif text-2xl font-bold text-gold mb-3">{t.teamTitle}</h3>
            <p className="text-cream/80 leading-relaxed">{t.teamText}</p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 max-w-7xl mx-auto bg-softcream">
        <h2 className="font-serif text-3xl font-bold text-center mb-16 text-ink">
          {language === Language.EN ? 'Our Values' : 'Nuestros Valores'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <ValueCard icon={<Award size={32} />} title={t.values.quality.title} desc={t.values.quality.desc} />
          <ValueCard icon={<Shield size={32} />} title={t.values.integrity.title} desc={t.values.integrity.desc} />
          <ValueCard icon={<CheckCircle size={32} />} title={t.values.safety.title} desc={t.values.safety.desc} />
          <ValueCard icon={<Hammer size={32} />} title={t.values.innovation.title} desc={t.values.innovation.desc} />
        </div>
      </section>

      <section className="py-14 px-4 max-w-4xl mx-auto text-center">
        <h2 className="font-serif text-2xl font-bold text-ink mb-2">{t.serviceAreaTitle}</h2>
        <p className="text-body">
          {language === Language.EN
            ? 'Proudly serving our local community — service area details available on request.'
            : 'Sirviendo con orgullo a nuestra comunidad local — detalles del área de servicio disponibles bajo petición.'}
        </p>
      </section>
    </div>
  );
};

const ValueCard = ({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) => (
  <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all hover:-translate-y-1 text-center">
    <div className="w-16 h-16 mx-auto bg-gold/10 text-gold rounded-full flex items-center justify-center mb-6">{icon}</div>
    <h3 className="font-serif text-xl font-bold text-ink mb-3">{title}</h3>
    <p className="text-body">{desc}</p>
  </div>
);

// ============================================================
// CONTACT PAGE
// ============================================================
export const ContactPage: React.FC<PageProps> = ({ language, onBookClick }) => {
  const t = TRANSLATIONS[language].contact;
  const areas = SERVICE_AREAS;

  return (
    <div className="max-w-5xl mx-auto py-16 px-4">
      <h1 className="font-serif text-4xl font-bold mb-2 text-center text-ink">{t.title}</h1>
      <p className="text-center text-body/70 mb-10">{t.subtitle}</p>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row mb-12 border border-ink/5">
        <div className="bg-ink text-cream p-10 lg:w-1/2 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 p-10 opacity-5"><Hammer size={200} /></div>
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-8 border-b border-white/20 pb-4">
              {language === Language.EN ? 'Contact Info' : 'Información de Contacto'}
            </h3>
            <div className="space-y-8">
              <div className="flex items-start">
                <Phone className="mt-1 mr-4 shrink-0 text-gold" />
                <div>
                  <div className="font-bold text-sm text-cream/50 uppercase mb-1">{t.phone}</div>
                  <a href={getTelUrl(COMPANY.phone)} onClick={() => trackEvent('call_click', { context: 'contact_page' })} className="hover:text-gold">{COMPANY.phoneDisplay}</a>
                </div>
              </div>
              <div className="flex items-start">
                <MessageCircle className="mt-1 mr-4 shrink-0 text-gold" />
                <div>
                  <div className="font-bold text-sm text-cream/50 uppercase mb-1">{t.whatsapp}</div>
                  <a href={getWhatsAppUrl(COMPANY.whatsapp)} target="_blank" rel="noreferrer" onClick={() => trackEvent('whatsapp_click', { context: 'contact_page' })} className="hover:text-gold">{COMPANY.phoneDisplay}</a>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="mt-1 mr-4 shrink-0 text-gold" />
                <div>
                  <div className="font-bold text-sm text-cream/50 uppercase mb-1">{t.email}</div>
                  <a href={`mailto:${COMPANY.email}`} className="hover:text-gold">{COMPANY.email}</a>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="mt-1 mr-4 shrink-0 text-gold" />
                <div>
                  <div className="font-bold text-sm text-cream/50 uppercase mb-1">{t.hours}</div>
                  <p>{language === Language.EN ? COMPANY.hoursEn : COMPANY.hoursEs}</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="mt-1 mr-4 shrink-0 text-gold" />
                <div>
                  <div className="font-bold text-sm text-cream/50 uppercase mb-1">{t.area}</div>
                  <p>{areas.map((a) => `${a.city}, ${a.state}`).join(' · ')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rather than a second, inconsistent form, Contact routes into the
            same unified estimate workflow used across the site. */}
        <div className="p-8 lg:w-1/2 flex flex-col items-center justify-center text-center gap-5">
          <ClipboardCheck size={48} className="text-gold" />
          <h3 className="font-serif text-2xl font-bold text-ink">{t.title}</h3>
          <p className="text-body/70 max-w-sm">{t.subtitle}</p>
          <button
            onClick={() => onBookClick?.()}
            className="w-full max-w-xs bg-gold hover:bg-gold-light text-ink font-bold py-4 rounded-lg tracking-wide uppercase"
          >
            {TRANSLATIONS[language].common.getEstimate}
          </button>
        </div>
      </div>
    </div>
  );
};

