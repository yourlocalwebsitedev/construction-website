import React, { useState } from "react";
import { SimpleJobUpload } from "../components/SimpleJobUpload";
import { SimpleJobGallery } from "../components/SimpleJobGallery";
import { BookingsView } from "../components/BookingsView";
import { Language } from "../types";

export const JobsAdmin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [language, setLanguage] = useState<Language>(Language.EN);
  const [activeTab, setActiveTab] = useState<"bookings" | "add" | "view">("bookings");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      setIsAuthenticated(true);
    } else {
      alert("Invalid password (hint: admin123)");
    }
  };

  const handleJobAdded = () => {
    setRefreshKey((prev) => prev + 1); // Trigger gallery refresh
    setActiveTab("view"); // Switch to view tab
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded-xl shadow-2xl w-96"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-secondary">
            {language === Language.EN ? "Admin Login" : "Acceso Admin"}
          </h2>
          <input
            type="password"
            placeholder={language === Language.EN ? "Password" : "Contraseña"}
            className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-primary focus:border-transparent"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary/90 transition">
            {language === Language.EN ? "Login" : "Ingresar"}
          </button>
          <p className="text-xs text-gray-500 mt-4 text-center">
            {language === Language.EN ? "Hint: admin123" : "Pista: admin123"}
          </p>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-secondary">
              {language === Language.EN
                ? "Jobs Management"
                : "Gestión de Trabajos"}
            </h1>
            <p className="text-sm text-gray-600">
              {language === Language.EN
                ? "Manage completed projects"
                : "Gestionar proyectos completados"}
            </p>
          </div>
          <div className="flex gap-4 items-center">
            {/* Language Toggle */}
            <button
              onClick={() =>
                setLanguage(
                  language === Language.EN ? Language.ES : Language.EN,
                )
              }
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition text-sm font-medium"
            >
              {language === Language.EN ? "🇪🇸 Español" : "🇺🇸 English"}
            </button>

            {/* Logout */}
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium"
            >
              {language === Language.EN ? "Logout" : "Cerrar Sesión"}
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6 border-b overflow-x-auto">
          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-6 py-3 font-medium transition whitespace-nowrap ${
              activeTab === "bookings"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {language === Language.EN ? "📅 Bookings" : "📅 Reservas"}
          </button>
          <button
            onClick={() => setActiveTab("view")}
            className={`px-6 py-3 font-medium transition whitespace-nowrap ${
              activeTab === "view"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {language === Language.EN ? "📋 View Jobs" : "📋 Ver Trabajos"}
          </button>
          <button
            onClick={() => setActiveTab("add")}
            className={`px-6 py-3 font-medium transition whitespace-nowrap ${
              activeTab === "add"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {language === Language.EN
              ? "➕ Add New Job"
              : "➕ Agregar Nuevo Trabajo"}
          </button>
        </div>

        {/* Content */}
        <div className="mt-6">
          {activeTab === "bookings" && (
            <BookingsView language={language} />
          )}
          
          {activeTab === "add" && (
            <SimpleJobUpload language={language} onSuccess={handleJobAdded} />
          )}

          {activeTab === "view" && (
            <SimpleJobGallery
              key={refreshKey}
              language={language}
              showDelete={true}
            />
          )}
        </div>
      </div>
    </div>
  );
};
