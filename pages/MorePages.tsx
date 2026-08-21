import React, { useEffect, useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { getServices, getProjects, getReviews } from "../services/db";
import { Language, Service, Project } from "../types";
import { TRANSLATIONS, COMPANY, BEFORE_AFTER_ITEMS, INITIAL_VIDEOS } from "../constants";
import BeforeAfterSlider from "../components/common/BeforeAfterSlider";
import { trackEvent } from "../services/analytics";
import { ChevronRight, MapPin, Star, Play, X, ChevronDown } from "lucide-react";

interface PageProps {
  language: Language;
  onBookClick?: (serviceId?: string) => void;
}

const SectionEyebrow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="text-xs font-bold tracking-[0.2em] mb-3 text-gold">{children}</div>
);

// ============================================================
// INDIVIDUAL SERVICE DETAIL PAGE — /services/:slug
// ============================================================
export const ServiceDetailPage: React.FC<PageProps> = ({ language, onBookClick }) => {
  const { slug } = useParams<{ slug: string }>();
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const t = TRANSLATIONS[language];

  useEffect(() => {
    getServices().then(setServices);
    getProjects().then(setProjects);
  }, []);

  const service = services.find((s) => s.slug === slug);

  useEffect(() => {
    if (service) trackEvent('service_view', { serviceId: service.id, slug: service.slug });
  }, [service?.id]);
  const relatedBA = BEFORE_AFTER_ITEMS.filter((b) => service && b.service.en.toLowerCase().includes(service.title.en.split(' ')[0].toLowerCase())).slice(0, 2);
  const relatedProjects = projects.slice(0, 3);

  if (services.length > 0 && !service) {
    return <Navigate to="/services" replace />;
  }
  if (!service) return null;

  return (
    <div>
      {/* Hero */}
      <div className="relative bg-ink py-16 md:py-20 px-4 text-center overflow-hidden">
        <img src={service.imageUrl} alt={service.title[language]} className="absolute inset-0 w-full h-full object-cover opacity-25" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <Link to="/services" className="text-cream/60 text-sm hover:text-gold">{t.services.title} /</Link>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-cream mt-2">{service.title[language]}</h1>
          <p className="text-cream/80 mt-4 text-lg">{service.shortDescription[language]}</p>
          <button
            onClick={() => onBookClick?.(service.id)}
            className="mt-8 bg-gold hover:bg-gold-light text-ink font-bold py-3.5 px-8 rounded-md text-sm tracking-wide"
          >
            {t.common.getEstimate}
          </button>
        </div>
      </div>

      {/* Explanation */}
      <section className="max-w-4xl mx-auto py-14 px-4">
        <p className="text-body text-lg leading-relaxed">{service.description[language]}</p>
        {service.assemblySummary && (
          <p className="mt-4 text-sm font-bold tracking-wide text-gold uppercase">{service.assemblySummary[language]}</p>
        )}
      </section>

      {/* Our Process — technical steps */}
      {!!service.processSteps?.length && (
        <section className="bg-ink py-14 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-cream mb-8 text-center">
              {language === Language.EN ? 'Our Process' : 'Nuestro Proceso'}
            </h2>
            <div className="space-y-6">
              {service.processSteps.map((step, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 sm:p-6">
                  <h3 className="font-serif font-bold text-gold text-lg mb-2">{step.title[language]}</h3>
                  <p className="text-cream/70 text-sm leading-relaxed">{step.description[language]}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Problems & Benefits */}
      {(service.problems?.length || service.benefits?.length) ? (
        <section className="bg-softcream py-14 px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
            {!!service.problems?.length && (
              <div>
                <h2 className="font-serif text-2xl font-bold text-ink mb-5">{t.services.commonProblems}</h2>
                <ul className="space-y-3">
                  {service.problems.map((p, i) => (
                    <li key={i} className="flex items-start gap-3 text-body">
                      <span className="w-1.5 h-1.5 mt-2 rounded-full bg-gold shrink-0" /> {p[language]}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {!!service.benefits?.length && (
              <div>
                <h2 className="font-serif text-2xl font-bold text-ink mb-5">{t.services.benefits}</h2>
                <ul className="space-y-3">
                  {service.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-3 text-body">
                      <span className="w-1.5 h-1.5 mt-2 rounded-full bg-gold shrink-0" /> {b[language]}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      ) : null}

      {/* Before/After */}
      {relatedBA.length > 0 && (
        <section className="max-w-6xl mx-auto py-14 px-4">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-ink mb-8 text-center">
            {TRANSLATIONS[language].home.beforeAfter.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedBA.map((item) => (
              <div key={item.id}>
                <BeforeAfterSlider beforeSrc={item.beforeImage} afterSrc={item.afterImage} onInteract={() => trackEvent('before_after_interaction', { itemId: item.id })} />
                <p className="mt-2 text-sm text-body/70">{item.title[language]}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related projects */}
      <section className="bg-softcream py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-ink mb-8 text-center">{t.services.relatedProjects}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProjects.map((p) => (
              <Link key={p.id} to={`/projects/static-${p.id}`} className="group rounded-xl overflow-hidden shadow-md bg-white block">
                <div className="h-40 overflow-hidden">
                  <img src={p.images[0]} alt={p.title[language]} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="p-4">
                  <h3 className="font-serif font-bold text-ink">{p.title[language]}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      {!!service.faqs?.length && (
        <section className="max-w-3xl mx-auto py-14 px-4">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-ink mb-8 text-center">{t.services.faq}</h2>
          <div className="space-y-3">
            {service.faqs.map((f, i) => (
              <div key={i} className="border border-ink/10 rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center px-5 py-4 text-left font-medium text-ink"
                >
                  {f.question[language]}
                  <ChevronDown size={18} className={`transition-transform ${openFaq === i ? 'rotate-180 text-gold' : ''}`} />
                </button>
                {openFaq === i && <div className="px-5 pb-4 text-body/80 text-sm">{f.answer[language]}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="bg-ink py-14 px-4 text-center">
        <p className="text-cream text-lg mb-6">{t.services.getEstimateCta}</p>
        <button onClick={() => onBookClick?.(service.id)} className="bg-gold hover:bg-gold-light text-ink font-bold py-4 px-10 rounded-md text-sm tracking-wide">
          {t.common.getEstimate}
        </button>
      </section>
    </div>
  );
};

// ============================================================
// REVIEWS PAGE — /reviews
// ============================================================
export const ReviewsPage: React.FC<PageProps> = ({ language }) => {
  const [reviews, setReviews] = useState<import("../types").Review[]>([]);
  const t = TRANSLATIONS[language];

  useEffect(() => { getReviews().then(setReviews); }, []);

  return (
    <div>
      <div className="bg-ink py-14 md:py-20 px-4 text-center">
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-cream">{t.home.testimonials}</h1>
      </div>
      <div className="max-w-5xl mx-auto py-14 px-4">
        <div className="flex items-center justify-center gap-2 text-body bg-white px-5 py-3 rounded-full shadow-sm w-fit mx-auto mb-12">
          <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" className="w-6 h-6" alt="Google" />
          {COMPANY.googleRating ? (
            <>
              <span className="font-bold text-ink">{COMPANY.googleRating}</span>
              <div className="flex text-gold">{[1, 2, 3, 4, 5].map((i) => <Star key={i} size={14} fill="currentColor" />)}</div>
              <span className="text-xs text-body/60">({COMPANY.googleReviewCount}+ {language === Language.EN ? 'reviews' : 'reseñas'})</span>
            </>
          ) : (
            <span className="text-sm text-body/60">{language === Language.EN ? 'Google Reviews coming soon' : 'Reseñas de Google próximamente'}</span>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white p-8 rounded-xl shadow-sm relative">
              <div className="flex text-gold mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill={i < r.rating ? "currentColor" : "none"} className={i < r.rating ? "text-gold" : "text-ink/20"} />)}
              </div>
              <p className="text-body mb-6 italic text-lg leading-relaxed">"{r.text[language]}"</p>
              <div className="font-bold text-ink">{r.author}</div>
              <div className="text-xs text-body/50 mt-1">{r.source || 'Google'} {r.isPlaceholder && `· ${language === Language.EN ? 'Placeholder' : 'Ejemplo'}`}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// VIDEOS PAGE — /videos
// ============================================================
export const VideosPage: React.FC<PageProps> = ({ language }) => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const t = TRANSLATIONS[language];

  return (
    <div>
      <div className="bg-ink py-14 md:py-20 px-4 text-center">
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-cream">{t.home.videosSection.title}</h1>
      </div>
      <div className="max-w-7xl mx-auto py-14 px-4">
        {INITIAL_VIDEOS.length === 0 ? (
          <p className="text-center text-body/60 py-16">
            {language === Language.EN ? 'Project videos coming soon.' : 'Videos de proyectos próximamente.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {INITIAL_VIDEOS.map((v) => (
              <button key={v.id} onClick={() => { setActiveVideo(v.videoUrl); trackEvent('video_play', { videoId: v.id }); }} className="relative group rounded-xl overflow-hidden aspect-video block">
                <img src={v.thumbnail} alt={v.title[language]} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-ink/30 group-hover:bg-ink/50 transition-colors flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-cream/90 flex items-center justify-center"><Play size={22} className="text-ink ml-1" /></div>
                </div>
                <span className="absolute bottom-2 right-2 bg-ink/70 text-cream text-xs px-2 py-1 rounded">{v.duration}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-ink/95 flex items-center justify-center p-4" onClick={() => setActiveVideo(null)}>
          <button className="absolute top-4 right-4 text-cream" onClick={() => setActiveVideo(null)}><X size={28} /></button>
          <video src={activeVideo} controls autoPlay className="max-w-full max-h-full rounded-lg" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
};
