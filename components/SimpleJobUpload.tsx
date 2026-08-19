import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { Language } from "../types";

interface SimpleJobUploadProps {
  language: Language;
  onSuccess?: () => void;
}

export const SimpleJobUpload: React.FC<SimpleJobUploadProps> = ({
  language,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [jobData, setJobData] = useState({
    clientName: "",
    address: "",
    description: "",
    date: "",
    imageUrls: [""], // Array of image URLs
    videoUrl: "", // Video URL
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!jobData.clientName || !jobData.address || !jobData.date) {
      alert(
        language === Language.EN
          ? "Please fill required fields"
          : "Por favor complete los campos requeridos",
      );
      return;
    }

    setLoading(true);

    try {
      // Filter out empty image URLs
      const filteredImageUrls = jobData.imageUrls.filter(url => url.trim() !== '');
      
      await addDoc(collection(db, "jobs"), {
        clientName: jobData.clientName,
        address: jobData.address,
        description: jobData.description,
        date: jobData.date,
        imageUrls: filteredImageUrls,
        videoUrl: jobData.videoUrl || "",
        createdAt: serverTimestamp(),
        status: "completed",
      });

      alert(
        language === Language.EN
          ? "Job added successfully!"
          : "¡Trabajo agregado exitosamente!",
      );

      // Reset form
      setJobData({
        clientName: "",
        address: "",
        description: "",
        date: "",
        imageUrls: [""],
        videoUrl: "",
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error adding job:", error);
      alert(
        language === Language.EN
          ? "Error adding job!"
          : "¡Error al agregar trabajo!",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-secondary">
        {language === Language.EN
          ? "Add Completed Job"
          : "Agregar Trabajo Completado"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            {language === Language.EN
              ? "Client Name *"
              : "Nombre del Cliente *"}
          </label>
          <input
            type="text"
            required
            value={jobData.clientName}
            onChange={(e) =>
              setJobData({ ...jobData, clientName: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder={language === Language.EN ? "John Doe" : "Juan Pérez"}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {language === Language.EN ? "Address *" : "Dirección *"}
          </label>
          <input
            type="text"
            required
            value={jobData.address}
            onChange={(e) =>
              setJobData({ ...jobData, address: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder={
              language === Language.EN
                ? "123 Main St, City"
                : "123 Calle Principal, Ciudad"
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {language === Language.EN
              ? "Completion Date *"
              : "Fecha de Finalización *"}
          </label>
          <input
            type="date"
            required
            value={jobData.date}
            onChange={(e) => setJobData({ ...jobData, date: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {language === Language.EN ? "Description" : "Descripción"}
          </label>
          <textarea
            value={jobData.description}
            onChange={(e) =>
              setJobData({ ...jobData, description: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg h-24 focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder={
              language === Language.EN
                ? "Interior painting, 3 bedrooms, neutral colors..."
                : "Pintura interior, 3 habitaciones, colores neutros..."
            }
          />
        </div>

        {/* Multiple Image URLs */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {language === Language.EN
              ? "Image URLs (optional)"
              : "URLs de Imágenes (opcional)"}
          </label>
          {jobData.imageUrls.map((url, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="url"
                value={url}
                onChange={(e) => {
                  const newUrls = [...jobData.imageUrls];
                  newUrls[index] = e.target.value;
                  setJobData({ ...jobData, imageUrls: newUrls });
                }}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder={`https://example.com/image${index + 1}.jpg`}
              />
              {jobData.imageUrls.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    const newUrls = jobData.imageUrls.filter((_, i) => i !== index);
                    setJobData({ ...jobData, imageUrls: newUrls });
                  }}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              setJobData({ ...jobData, imageUrls: [...jobData.imageUrls, ''] });
            }}
            className="mt-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm"
          >
            + {language === Language.EN ? 'Add Another Image' : 'Agregar Otra Imagen'}
          </button>
          <p className="text-xs text-gray-500 mt-2">
            {language === Language.EN
              ? "Paste image URLs (from imgur, unsplash, google photos, etc.)"
              : "Pegue URLs de imágenes (de imgur, unsplash, google fotos, etc.)"}
          </p>
        </div>

        {/* Video URL */}
        <div>
          <label className="block text-sm font-medium mb-2">
            {language === Language.EN
              ? "Video URL (optional)"
              : "URL de Video (opcional)"}
          </label>
          <input
            type="url"
            value={jobData.videoUrl}
            onChange={(e) =>
              setJobData({ ...jobData, videoUrl: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="https://example.com/video.mp4"
          />
          <p className="text-xs text-gray-500 mt-1">
            {language === Language.EN
              ? "Paste a video URL (MP4 format recommended)"
              : "Pegue una URL de video (formato MP4 recomendado)"}
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading
            ? language === Language.EN
              ? "Adding..."
              : "Agregando..."
            : language === Language.EN
              ? "Add Job"
              : "Agregar Trabajo"}
        </button>
      </form>
    </div>
  );
};
