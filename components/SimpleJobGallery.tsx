import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { Language } from '../types';
import { Link } from 'react-router-dom';

interface Job {
  id: string;
  clientName: string;
  address: string;
  description: string;
  date: string;
  imageUrl?: string; // Old single image URL (backwards compatibility)
  imageUrls?: string[]; // New multiple image URLs
  videoUrl?: string; // Video URL
  createdAt: any;
}

interface SimpleJobGalleryProps {
  language: Language;
  showDelete?: boolean;
}

export const SimpleJobGallery: React.FC<SimpleJobGalleryProps> = ({ language, showDelete = false }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const q = query(collection(db, 'jobs'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const jobsData: Job[] = [];
      querySnapshot.forEach((doc) => {
        jobsData.push({ id: doc.id, ...doc.data() } as Job);
      });
      
      setJobs(jobsData);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm(language === Language.EN ? 'Delete this job?' : '¿Eliminar este trabajo?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'jobs', jobId));
      setJobs(jobs.filter(job => job.id !== jobId));
      alert(language === Language.EN ? 'Job deleted!' : '¡Trabajo eliminado!');
    } catch (error) {
      console.error('Error deleting job:', error);
      alert(language === Language.EN ? 'Error deleting job!' : '¡Error al eliminar!');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-lg mt-4">
          {language === Language.EN ? 'Loading projects...' : 'Cargando proyectos...'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-center text-secondary">
        {language === Language.EN ? 'Completed Projects' : 'Proyectos Completados'}
      </h2>

      {jobs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">
            {language === Language.EN ? 'No projects yet. Add your first project!' : '¡Aún no hay proyectos. Agrega tu primer proyecto!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <Link 
              to={`/project/${job.id}`}
              key={job.id} 
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition block"
            >
              {/* Image or Placeholder */}
              <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 relative">
                {(() => {
                  // Get the first available image (backwards compatible)
                  const firstImage = job.imageUrls && job.imageUrls.length > 0 
                    ? job.imageUrls[0] 
                    : job.imageUrl;
                  
                  const totalImages = (job.imageUrls?.length || 0) + (job.imageUrl && !job.imageUrls?.includes(job.imageUrl) ? 1 : 0);
                  
                  return firstImage ? (
                    <>
                      <img 
                        src={firstImage} 
                        alt={job.clientName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // If image fails to load, show placeholder
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      {totalImages > 1 && (
                        <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs">
                          +{totalImages - 1} {language === Language.EN ? 'more' : 'más'}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  );
                })()}
              </div>

              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 text-secondary">{job.clientName}</h3>
                <p className="text-gray-600 text-sm mb-2 flex items-start">
                  <svg className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {job.address}
                </p>
                
                {job.description && (
                  <p className="text-gray-700 text-sm mb-2 line-clamp-2">{job.description}</p>
                )}
                
                <p className="text-sm text-gray-500 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {job.date}
                </p>

                {showDelete && (
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="mt-3 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition text-sm"
                  >
                    {language === Language.EN ? 'Delete' : 'Eliminar'}
                  </button>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
