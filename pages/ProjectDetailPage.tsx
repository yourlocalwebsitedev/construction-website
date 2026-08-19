import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { Language } from '../types';
import { ArrowLeft, MapPin, Calendar, X, Play } from 'lucide-react';

interface Job {
  id: string;
  clientName: string;
  address: string;
  description: string;
  date: string;
  imageUrl?: string;
  imageUrls?: string[]; // Multiple images
  videoUrl?: string;
  createdAt: any;
}

interface ProjectDetailPageProps {
  language: Language;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ language }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [isStaticProject, setIsStaticProject] = useState(false);

  useEffect(() => {
    if (id) {
      // Check if it's a static project (prefixed with 'static-')
      if (id.startsWith('static-')) {
        fetchStaticProject(id.replace('static-', ''));
      } else {
        fetchFirebaseJob(id);
      }
    }
  }, [id]);

  const fetchStaticProject = async (projectId: string) => {
    setIsStaticProject(true);
    try {
      const { storageService } = await import('../services/storage');
      const projects = storageService.getProjects();
      const project = projects.find(p => p.id === projectId);
      
      if (project) {
        // Convert static project to job format
        setJob({
          id: project.id,
          clientName: project.title[language],
          address: `Category: ${project.category}`,
          description: project.description[language],
          date: project.completionDate,
          imageUrls: project.images,
          createdAt: null
        } as Job);
      } else {
        navigate('/portfolio');
      }
    } catch (error) {
      console.error('Error fetching static project:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFirebaseJob = async (jobId: string) => {
    setIsStaticProject(false);
    try {
      const docRef = doc(db, 'jobs', jobId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setJob({ id: docSnap.id, ...docSnap.data() } as Job);
      } else {
        navigate('/portfolio');
      }
    } catch (error) {
      console.error('Error fetching job:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">
            {language === Language.EN ? 'Loading project...' : 'Cargando proyecto...'}
          </p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {language === Language.EN ? 'Project Not Found' : 'Proyecto No Encontrado'}
          </h2>
          <Link to="/portfolio" className="text-primary hover:underline">
            {language === Language.EN ? '← Back to Portfolio' : '← Volver al Portafolio'}
          </Link>
        </div>
      </div>
    );
  }

  // Combine all images (old single imageUrl + new multiple imageUrls)
  const allImages: string[] = [];
  if (job.imageUrl) allImages.push(job.imageUrl);
  if (job.imageUrls && job.imageUrls.length > 0) allImages.push(...job.imageUrls);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Modern Header */}
      <div className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-primary transition group"
          >
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">{language === Language.EN ? 'Back' : 'Atrás'}</span>
          </button>
          <Link
            to="/portfolio"
            className="text-sm text-primary hover:text-primary/80 font-medium"
          >
            {language === Language.EN ? 'View More Projects →' : 'Ver Más Proyectos →'}
          </Link>
        </div>
      </div>

      {/* Hero Section - Project Info */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4 leading-tight">
            {job.clientName}
          </h1>
          
          <div className="flex flex-wrap gap-6 text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MapPin size={18} className="text-primary" />
              </div>
              <span className="text-sm md:text-base">{job.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar size={18} className="text-primary" />
              </div>
              <span className="text-sm md:text-base">{job.date}</span>
            </div>
          </div>

          {job.description && (
            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
              {job.description}
            </p>
          )}
        </div>
      </div>

      {/* Modern Tile Grid - Images & Video - All Same Size */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        {(allImages.length > 0 || job.videoUrl) && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Video Tile (if exists) - Same size as others */}
            {job.videoUrl && (
              <div className="relative group overflow-hidden rounded-2xl bg-black aspect-[4/3] shadow-lg hover:shadow-2xl transition-shadow">
                <video
                  src={job.videoUrl}
                  controls
                  className="w-full h-full object-cover"
                  poster={allImages[0] || undefined}
                />
                <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Play size={12} />
                  {language === Language.EN ? 'VIDEO' : 'VIDEO'}
                </div>
              </div>
            )}

            {/* Image Tiles - All Same Size */}
            {allImages.map((img, idx) => {
              return (
                <button
                  key={idx}
                  onClick={() => setLightboxImage(img)}
                  className="relative group overflow-hidden rounded-2xl aspect-[4/3] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
                >
                  <img
                    src={img}
                    alt={`${job.clientName} - ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/600x400?text=Image+Not+Available';
                    }}
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-gray-800">
                        {language === Language.EN ? 'View Full Size' : 'Ver Tamaño Completo'}
                      </div>
                    </div>
                  </div>
                  {/* Image Number Badge */}
                  <div className="absolute top-3 right-3 bg-black/60 text-white px-2 py-1 rounded-lg text-xs font-medium backdrop-blur-sm">
                    {idx + 1}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {allImages.length === 0 && !job.videoUrl && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-500">
              {language === Language.EN ? 'No media available for this project' : 'No hay medios disponibles para este proyecto'}
            </p>
          </div>
        )}
      </div>

      {/* Lightbox for Full-Size Images */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm"
          >
            <X size={24} className="text-white" />
          </button>
          <img
            src={lightboxImage}
            alt={job.clientName}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
            {language === Language.EN ? 'Click outside to close' : 'Haz clic afuera para cerrar'}
          </div>
        </div>
      )}
    </div>
  );
};
