import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { storageService } from "../services/storage";
import { Service, Project, Review, Language, ServiceCategory } from "../types";
import { TRANSLATIONS } from "../constants";
import {
  Star,
  MapPin,
  ChevronRight,
  Upload,
  X,
  Shield,
  Award,
  Users,
  Hammer,
  CheckCircle,
  ShieldCheck,
  CalendarCheck,
  PenTool,
  Phone,
  Mail,
  MessageSquare,
  Check,
  MessageCircle,
} from "lucide-react";

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
    setProjects(
      storageService
        .getProjects()
        .filter((p) => p.featured)
        .slice(0, 3),
    );
    setReviews(storageService.getReviews().slice(0, 3));
  }, []);

  return (
    <div>
      {/* Hero */}
      <div className="relative h-[500px] md:h-[650px] bg-secondary flex items-center justify-center text-center px-4 overflow-hidden">
        {/* Fixed: Used a highly reliable, standard construction architectural image */}
        <img
          src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1920&q=80"
          alt="Construction background"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        {/* Added -mt-32 (increased from -mt-20) to pull content significantly higher */}
        <div className="relative z-10 max-w-4xl mx-auto space-y-6 -mt-12 md:-mt-32">
          <div className="inline-flex items-center bg-primary/20 backdrop-blur-sm border border-primary/40 rounded-full px-4 py-1 text-primary text-sm font-bold mb-4 animate-fade-in-up">
            <ShieldCheck size={16} className="mr-2" /> {t.home.trust.licensed}{" "}
            #GC-9821
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight animate-fade-in-up drop-shadow-lg">
            {t.home.heroTitle}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto drop-shadow-md">
            {t.home.heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Link
              to="/contact"
              className="bg-primary hover:bg-amber-600 text-white font-bold py-4 px-10 rounded-full text-lg transition-transform hover:scale-105 shadow-lg shadow-primary/30 flex items-center justify-center"
            >
              {t.home.cta}
            </Link>
            <a
              href="https://wa.me/15551234567"
              target="_blank"
              rel="noreferrer"
              className="bg-white/10 hover:bg-green-600/20 backdrop-blur-md text-white border border-white/30 font-bold py-4 px-10 rounded-full text-lg transition-all flex items-center justify-center"
            >
              <MessageCircle size={20} className="mr-2 text-green-400" />
              {t.home.whatsapp}
            </a>
          </div>
        </div>
      </div>

      {/* Trust Bar */}
      <div className="bg-primary text-secondary py-6 px-4 shadow-lg relative z-20 -mt-4 md:-mt-8 mx-4 md:mx-auto max-w-6xl rounded-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-secondary/20">
          <div className="flex items-center justify-center gap-3 p-2">
            <ShieldCheck size={32} />
            <div className="text-left">
              <div className="font-bold text-lg leading-tight">
                {t.home.trust.licensed}
              </div>
              <div className="text-xs opacity-80">
                General Contractor #GC-9821
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 p-2">
            <Award size={32} />
            <div className="text-left">
              <div className="font-bold text-lg leading-tight">
                {t.home.trust.warranty}
              </div>
              <div className="text-xs opacity-80">On all structural work</div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3 p-2">
            <div className="flex text-secondary">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
            </div>
            <div className="text-left">
              <div className="font-bold text-lg leading-tight">
                {t.home.trust.rating}
              </div>
              <div className="text-xs opacity-80">Based on 150+ Reviews</div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Projects */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 border-b-4 border-primary w-max mx-auto pb-2">
          Featured Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((p) => (
            <div
              key={p.id}
              className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer"
            >
              <img
                src={p.images[0]}
                alt={p.title[language]}
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6">
                <span className="text-primary text-xs font-bold uppercase tracking-wider mb-1 flex items-center">
                  <Hammer size={12} className="mr-1" /> {p.category}
                </span>
                <h3 className="text-white text-xl font-bold mt-1 leading-tight">
                  {p.title[language]}
                </h3>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            to="/portfolio"
            className="inline-flex items-center text-primary font-bold hover:underline"
          >
            {t.home.viewAllProjects} <ChevronRight size={20} />
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-100 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center mb-12 flex-col">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {t.home.testimonials}
            </h2>
            <div className="flex items-center gap-2 text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                className="w-5 h-5"
                alt="Google"
              />
              <span className="font-bold text-gray-800">4.9</span>
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <span className="text-xs text-gray-500">(152 Reviews)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow relative"
              >
                <div className="absolute top-6 right-6 text-gray-200">
                  <MessageSquare size={40} />
                </div>
                <div className="flex text-primary mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      fill={i < r.rating ? "currentColor" : "none"}
                      className={
                        i < r.rating ? "text-primary" : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic text-lg leading-relaxed">
                  "{r.text[language]}"
                </p>
                <div>
                  <div className="font-bold text-gray-800">{r.author}</div>
                  <div className="text-xs text-gray-400 flex items-center mt-1">
                    <CheckCircle size={10} className="mr-1 text-green-500" />{" "}
                    {t.home.verifiedClient} • {new Date(r.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

// --- SERVICES PAGE ---
export const ServicesPage: React.FC<PageProps> = ({
  language,
  onBookClick,
}) => {
  const [services, setServices] = useState<Service[]>([]);
  const t = TRANSLATIONS[language];

  useEffect(() => {
    setServices(storageService.getServices());
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-12 text-center">{t.services.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 flex flex-col group hover:shadow-xl transition-shadow"
          >
            <div className="h-56 overflow-hidden relative">
              <img
                src={service.imageUrl}
                alt={service.title[language]}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
            </div>
            <div className="p-6 flex-grow flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-primary uppercase bg-primary/10 px-2 py-1 rounded">
                  {service.category}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                {service.title[language]}
              </h3>
              <p className="text-gray-600 mb-6 flex-grow">
                {service.description[language]}
              </p>
              <button
                onClick={() => onBookClick?.(service.id)}
                className="w-full bg-secondary text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center justify-center"
              >
                {t.services.bookService} <ChevronRight size={16} className="ml-2" />
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
  const [firebaseJobs, setFirebaseJobs] = useState<any[]>([]);
  const [filter, setFilter] = useState<ServiceCategory | "All">("All");
  const [loading, setLoading] = useState(true);
  const t = TRANSLATIONS[language];

  useEffect(() => {
    loadAllProjects();
  }, []);

  const loadAllProjects = async () => {
    // Load static projects
    const staticProjects = storageService.getProjects();
    setProjects(staticProjects);

    // Load Firebase jobs
    try {
      const { collection, query, orderBy, getDocs } =
        await import("firebase/firestore");
      const { db } = await import("../firebase.config");

      const q = query(collection(db, "jobs"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      const jobs: any[] = [];
      querySnapshot.forEach((doc) => {
        jobs.push({ id: doc.id, ...doc.data() });
      });

      setFirebaseJobs(jobs);
    } catch (error) {
      console.error("Error fetching Firebase jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects =
    filter === "All" ? projects : projects.filter((p) => p.category === filter);

  const getCategoryLabel = (cat: string) => {
    if (cat === "All") return t.portfolio.filterAll;
    if (cat === ServiceCategory.RESIDENTIAL) return t.portfolio.filterResidential;
    if (cat === ServiceCategory.COMMERCIAL) return t.portfolio.filterCommercial;
    return cat;
  };

  return (
    <div className="max-w-7xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">
        {t.portfolio.title}
      </h1>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {["All", ...Object.values(ServiceCategory)].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat as any)}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${filter === cat ? "bg-primary text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
          >
            {getCategoryLabel(cat)}
          </button>
        ))}
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">
            {t.portfolio.loadingPortfolio}
          </p>
        </div>
      )}

      {/* Unified Grid - Static Projects + Firebase Jobs */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Static Projects */}
          {filteredProjects.map((project) => (
            <Link
              key={project.id}
              to={`/project/static-${project.id}`}
              className="group cursor-pointer rounded-xl overflow-hidden shadow-lg relative aspect-[4/3] hover:shadow-2xl transition-shadow block"
            >
              <img
                src={project.images[0]}
                alt={project.title[language]}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20"></div>

              {/* Text content - always visible */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-6">
                <h3 className="text-2xl font-bold mb-2 drop-shadow-lg">
                  {project.title[language]}
                </h3>
                <p className="text-sm opacity-90 mb-4 line-clamp-2 drop-shadow">
                  {project.description[language]}
                </p>
                <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-semibold transition-all transform group-hover:scale-105">
                  {t.portfolio.viewProject}
                </button>
              </div>
            </Link>
          ))}

          {/* Firebase Jobs - Only show if "All" filter selected */}
          {filter === "All" &&
            firebaseJobs.map((job) => {
              // Get first available image
              const firstImage =
                job.imageUrls && job.imageUrls.length > 0
                  ? job.imageUrls[0]
                  : job.imageUrl;
              const totalImages =
                (job.imageUrls?.length || 0) +
                (job.imageUrl && !job.imageUrls?.includes(job.imageUrl)
                  ? 1
                  : 0);

              return (
                <Link
                  key={`firebase-${job.id}`}
                  to={`/project/${job.id}`}
                  className="group cursor-pointer rounded-xl overflow-hidden shadow-lg relative aspect-[4/3] hover:shadow-2xl transition-shadow block"
                >
                  {firstImage ? (
                    <>
                      <img
                        src={firstImage}
                        alt={job.clientName}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                      {totalImages > 1 && (
                        <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-lg text-xs font-bold backdrop-blur-sm">
                          {totalImages}{" "}
                          {language === Language.EN ? "Photos" : "Fotos"}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <svg
                        className="w-16 h-16 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20"></div>

                  {/* Text content - always visible */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-6">
                    <h3 className="text-2xl font-bold mb-2 drop-shadow-lg">
                      {job.clientName}
                    </h3>
                    <p className="text-sm opacity-90 mb-1 drop-shadow flex items-center">
                      <MapPin size={14} className="mr-1" />
                      {job.address}
                    </p>
                    {job.description && (
                      <p className="text-xs opacity-80 mb-4 line-clamp-2 drop-shadow max-w-xs">
                        {job.description}
                      </p>
                    )}
                    <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-semibold transition-all transform group-hover:scale-105">
                      {t.portfolio.viewProject}
                    </button>
                  </div>
                </Link>
              );
            })}
        </div>
      )}

      {/* Empty State */}
      {!loading &&
        filteredProjects.length === 0 &&
        firebaseJobs.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              {language === Language.EN
                ? "No projects found."
                : "No se encontraron proyectos."}
            </p>
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
              src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80"
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
              <p className="text-gray-600 leading-relaxed text-lg">
                {t.storyText}
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="w-12 h-1 bg-primary mr-4"></span>
                {t.missionTitle}
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                {t.missionText}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="bg-secondary py-16 px-4 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: t.stats.years, val: "Local" },
            { label: t.stats.projects, val: "500+" },
            { label: t.stats.clients, val: "Free" },
            { label: t.stats.team, val: "Open" },
          ].map((stat, i) => (
            <div
              key={i}
              className="p-4 border border-gray-700/30 rounded-lg bg-white/5"
            >
              <div className="text-2xl md:text-3xl font-bold text-primary mb-2">
                {stat.val}
              </div>
              <div className="text-sm md:text-base font-medium uppercase tracking-wider opacity-80">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 px-4 max-w-7xl mx-auto bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-16 text-gray-800">
          Core Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <ValueCard
            icon={<Award size={32} />}
            title={t.values.quality.title}
            desc={t.values.quality.desc}
          />
          <ValueCard
            icon={<Shield size={32} />}
            title={t.values.integrity.title}
            desc={t.values.integrity.desc}
          />
          <ValueCard
            icon={<CheckCircle size={32} />}
            title={t.values.safety.title}
            desc={t.values.safety.desc}
          />
          <ValueCard
            icon={<Hammer size={32} />}
            title={t.values.innovation.title}
            desc={t.values.innovation.desc}
          />
        </div>
      </section>
    </div>
  );
};

const ValueCard = ({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) => (
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
  const t = TRANSLATIONS[language].contact;
  const common = TRANSLATIONS[language].common;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    zip: "",
    serviceType: "",
    timeline: "",
    preferredContact: "phone",
    message: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const inquiry = {
      id: Date.now().toString(),
      ...formData,
      attachmentUrl: file ? URL.createObjectURL(file) : undefined,
      date: new Date().toISOString(),
    };
    storageService.addInquiry(inquiry as any);
    setSubmitted(true);
    window.scrollTo(0, 0);
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4">
        <div className="bg-green-100 p-6 rounded-full text-green-600 mb-6 animate-bounce">
          <Check size={48} />
        </div>
        <h2 className="text-3xl font-bold mb-4">Request Received!</h2>
        <p className="text-gray-600 max-w-md text-lg">
          Thanks for trusting BuildRight. Our team will review your project
          details and get back to you within 2 hours.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-8 text-primary font-bold hover:underline"
        >
          Submit another inquiry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold mb-2 text-center text-gray-800">
        {t.title}
      </h1>
      <p className="text-center text-gray-500 mb-10">{t.subtitle}</p>

      {/* Contact & Form Section */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row mb-12 border border-gray-100">
        {/* Contact Info Sidebar */}
        <div className="bg-secondary text-white p-10 lg:w-1/3 flex flex-col justify-between relative overflow-hidden">
          {/* Decorative Pattern */}
          <div className="absolute top-0 right-0 p-10 opacity-5">
            <Hammer size={200} />
          </div>

          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-8 border-b border-gray-600 pb-4">
              Contact Info
            </h3>
            <div className="space-y-8">
              <div className="flex items-start">
                <MapPin className="mt-1 mr-4 shrink-0 text-primary" />
                <div>
                  <div className="font-bold text-sm text-gray-400 uppercase mb-1">
                    Office
                  </div>
                  <p>
                    225 N Cotner Blvd,
                    <br />
                    Lincoln, NE 68505
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="mt-1 mr-4 shrink-0 text-primary" />
                <div>
                  <div className="font-bold text-sm text-gray-400 uppercase mb-1">
                    Email
                  </div>
                  <p>hello@buildright.com</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="mt-1 mr-4 shrink-0 text-primary" />
                <div>
                  <div className="font-bold text-sm text-gray-400 uppercase mb-1">
                    Phone
                  </div>
                  <p className="text-xl font-bold">(555) 123-4567</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 relative z-10">
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
              <div className="flex items-center text-primary font-bold mb-2">
                <ShieldCheck size={18} className="mr-2" /> Licensed & Insured
              </div>
              <p className="text-xs text-gray-400">GC License #9821-NE</p>
            </div>
          </div>
        </div>

        {/* Detailed Form */}
        <div className="p-8 lg:p-12 lg:w-2/3 bg-gray-50/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                <Users size={16} className="mr-2 text-primary" /> Personal
                Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    {t.form.name} *
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full p-3 border border-gray-200 bg-gray-50 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    {t.form.email} *
                  </label>
                  <input
                    required
                    type="email"
                    className="w-full p-3 border border-gray-200 bg-gray-50 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    {t.form.phone} *
                  </label>
                  <input
                    required
                    type="tel"
                    className="w-full p-3 border border-gray-200 bg-gray-50 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    {t.form.zip} *
                  </label>
                  <input
                    required
                    type="text"
                    className="w-full p-3 border border-gray-200 bg-gray-50 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all"
                    value={formData.zip}
                    onChange={(e) =>
                      setFormData({ ...formData, zip: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
                  {t.form.preferred}
                </label>
                <div className="flex space-x-4">
                  {(["phone", "email", "text"] as const).map((method) => (
                    <label
                      key={method}
                      className="flex items-center cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="contactMethod"
                        value={method}
                        checked={formData.preferredContact === method}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            preferredContact: e.target.value as any,
                          })
                        }
                        className="mr-2 text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700 capitalize">
                        {method === "phone"
                          ? t.form.methodOpts.call
                          : method === "email"
                            ? t.form.methodOpts.email
                            : t.form.methodOpts.text}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Project Info */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                <Hammer size={16} className="mr-2 text-primary" /> Project
                Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    {t.form.serviceType}
                  </label>
                  <select
                    className="w-full p-3 border border-gray-200 bg-gray-50 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all"
                    value={formData.serviceType}
                    onChange={(e) =>
                      setFormData({ ...formData, serviceType: e.target.value })
                    }
                  >
                    <option value="">Select a Service...</option>
                    <option value="kitchen">Kitchen Remodel</option>
                    <option value="bathroom">Bathroom Renovation</option>
                    <option value="roofing">Roofing</option>
                    <option value="addition">Home Addition</option>
                    <option value="commercial">Commercial Project</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    {t.form.timeline}
                  </label>
                  <select
                    className="w-full p-3 border border-gray-200 bg-gray-50 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all"
                    value={formData.timeline}
                    onChange={(e) =>
                      setFormData({ ...formData, timeline: e.target.value })
                    }
                  >
                    <option value="">When do you want to start?</option>
                    <option value="asap">{t.form.timelineOpts.asap}</option>
                    <option value="month">{t.form.timelineOpts.month}</option>
                    <option value="planning">
                      {t.form.timelineOpts.planning}
                    </option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  {t.form.details} *
                </label>
                <textarea
                  required
                  rows={3}
                  className="w-full p-3 border border-gray-200 bg-gray-50 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Describe your project goals, estimated budget, and any questions you have..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Upload Photos / Plans (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center pointer-events-none">
                    <Upload className="text-gray-400 mb-2" size={24} />
                    <span className="text-sm text-gray-500">
                      {file ? file.name : "Click to upload or drag and drop"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white font-bold py-4 rounded-lg hover:bg-amber-600 transition-all shadow-lg text-lg uppercase tracking-wide"
            >
              {common.submit}
            </button>
            <p className="text-xs text-center text-gray-400 mt-4">
              By submitting this form, you agree to receive calls/texts from
              BuildRight regarding your project estimate.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
