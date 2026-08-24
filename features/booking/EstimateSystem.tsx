import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Language, PreferredContact, Service } from '../../types';
import { TRANSLATIONS, COMPANY } from '../../constants';
import { getServices } from '../../services/db';
import { submitInquiry, isLikelySpam } from '../../services/inquiries';
import { trackEvent } from '../../services/analytics';
import { getWhatsAppUrl, getTelUrl } from '../../services/contactLinks';
import { Check, ChevronRight, ChevronLeft, X, Phone, MessageCircle, Loader2, AlertTriangle } from 'lucide-react';

interface EstimateSystemProps {
  language: Language;
  preselectedServiceId?: string;
  onClose: () => void;
}

const ZIP_REGEX = /^\d{5}(-\d{4})?$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]?[\d\s().-]{7,20}$/;

const TOTAL_STEPS = 4;

const EstimateSystem: React.FC<EstimateSystemProps> = ({ language, preselectedServiceId, onClose }) => {
  const t = TRANSLATIONS[language].estimate;
  const formOpenedAt = useRef(Date.now());
  const startedTracked = useRef(false);

  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);

  // Step 1
  const [serviceId, setServiceId] = useState<string | null>(preselectedServiceId || null);
  // Step 2
  const [zip, setZip] = useState('');
  const [city, setCity] = useState('');
  // Step 3
  const [description, setDescription] = useState('');
  // Step 4
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredContact, setPreferredContact] = useState<PreferredContact>('call');
  const [bestTime, setBestTime] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<{ referenceNumber: string } | null>(null);

  useEffect(() => {
    let mounted = true;
    getServices().then((s) => {
      if (mounted) {
        setServices(s);
        setServicesLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const selectedService = useMemo(() => services.find((s) => s.id === serviceId), [services, serviceId]);

  const trackStarted = () => {
    if (!startedTracked.current) {
      startedTracked.current = true;
      trackEvent('estimate_started');
    }
  };

  const goNext = (currentStep: number) => {
    trackStarted();
    trackEvent('estimate_step_completed', { step: currentStep });
    setErrors({});
    setStep(currentStep + 1);
  };
  const goBack = () => {
    setErrors({});
    setStep((s) => Math.max(1, s - 1));
  };

  // ---------------- Step validation ----------------
  const validateStep1 = () => {
    if (!serviceId) {
      setErrors({ service: t.errors.selectService });
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!zip.trim()) e.zip = t.errors.required;
    else if (!ZIP_REGEX.test(zip.trim())) e.zip = t.errors.invalidZip;
    if (!city.trim()) e.city = t.errors.required;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep3 = () => {
    const e: Record<string, string> = {};
    if (!description.trim()) e.description = t.errors.required;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep4 = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = t.errors.required;
    if (!phone.trim()) e.phone = t.errors.required;
    else if (!PHONE_REGEX.test(phone.trim())) e.phone = t.errors.invalidPhone;
    if (!email.trim()) e.email = t.errors.required;
    else if (!EMAIL_REGEX.test(email.trim())) e.email = t.errors.invalidEmail;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ---------------- Submit ----------------
  const handleSubmit = () => {
    if (!validateStep4()) return;

    if (isLikelySpam(honeypot, formOpenedAt.current)) {
      setSubmitError(t.errors.spam);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const serviceLabel = selectedService?.title[language] || t.serviceOther;
      const res = submitInquiry({
        customerName: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        preferredContact,
        bestTimeToContact: bestTime.trim(),
        serviceLabel,
        zip: zip.trim(),
        city: city.trim(),
        description: description.trim(),
        language,
      });

      trackEvent('estimate_completed', { serviceId, referenceNumber: res.referenceNumber });
      setResult({ referenceNumber: res.referenceNumber });
      // Open the pre-filled email in the customer's mail client.
      window.open(res.whatsappUrl, '_blank', 'noopener,noreferrer');
      setStep(5); // success
    } catch (err) {
      console.error('Estimate submission failed:', err);
      setSubmitError(t.errors.generic);
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------- Renderers ----------------
  const renderProgress = () => {
    const labels = [t.steps.service, t.steps.location, t.steps.project, t.steps.contact];
    const currentLabel = labels[Math.min(step, TOTAL_STEPS) - 1];
    return (
      <div className="mb-6 mt-1 pr-8 sm:pr-9">
        {/* Compact mobile view: avoids label overflow colliding with close button */}
        <div className="sm:hidden mb-2 text-[11px] font-bold uppercase tracking-wider text-primary">
          Step {Math.min(step, TOTAL_STEPS)} of {TOTAL_STEPS}: {currentLabel}
        </div>
        {/* Full label row on larger screens */}
        <div className="hidden sm:flex justify-between items-center mb-2 gap-1">
          {labels.map((label, i) => (
            <span
              key={label}
              className={`text-xs font-bold uppercase tracking-wider whitespace-nowrap ${
                step >= i + 1 ? 'text-primary' : 'text-gray-400'
              }`}
            >
              {i + 1}. {label}
            </span>
          ))}
        </div>
        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300 ease-in-out"
            style={{ width: `${(Math.min(step, TOTAL_STEPS) / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>
    );
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-2xl font-serif font-bold text-ink">{t.step1Title}</h3>
        <p className="text-sm text-gray-500 mt-1">{t.step1Sub}</p>
      </div>
      {servicesLoading ? (
        <div className="flex items-center justify-center py-12 text-gray-400">
          <Loader2 className="animate-spin mr-2" size={20} /> {TRANSLATIONS[language].common.loading}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 max-h-[48vh] overflow-y-auto p-1 no-scrollbar">
          {services.map((s) => (
            <button
              type="button"
              key={s.id}
              onClick={() => setServiceId(s.id)}
              className={`text-left rounded-xl border-2 p-3 transition-all ${
                serviceId === s.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-gray-100 hover:border-primary/40'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-bold text-sm text-ink leading-snug">{s.title[language]}</span>
                {serviceId === s.id && (
                  <span className="bg-primary text-white rounded-full p-0.5 shrink-0">
                    <Check size={12} />
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-500 line-clamp-2 mt-1 block">{s.shortDescription[language]}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => setServiceId('other')}
            className={`text-left rounded-xl border-2 p-3 flex items-center justify-center font-bold text-sm transition-all ${
              serviceId === 'other' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 hover:border-primary/40 text-gray-600'
            }`}
          >
            {t.serviceOther}
          </button>
        </div>
      )}
      {errors.service && <p className="text-red-600 text-xs font-medium">{errors.service}</p>}
      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={() => validateStep1() && goNext(1)}
          className="bg-ink text-white px-8 py-3 rounded-xl font-bold flex items-center shadow-lg hover:shadow-xl transition-all"
        >
          {t.next} <ChevronRight size={18} className="ml-2" />
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-5">
      <div>
        <h3 className="text-2xl font-serif font-bold text-ink">{t.step2Title}</h3>
        <p className="text-sm text-gray-500 mt-1">{t.step2Sub}</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">{t.zip}</label>
          <input
            type="text"
            inputMode="numeric"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none ${errors.zip ? 'border-red-400' : 'border-gray-200'}`}
            placeholder="90210"
          />
          {errors.zip && <p className="text-red-600 text-xs mt-1">{errors.zip}</p>}
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">{t.city}</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none ${errors.city ? 'border-red-400' : 'border-gray-200'}`}
          />
          {errors.city && <p className="text-red-600 text-xs mt-1">{errors.city}</p>}
        </div>
      </div>
      <div className="flex justify-between pt-4 border-t border-gray-100">
        <button type="button" onClick={goBack} className="text-gray-500 hover:text-ink font-medium px-2 flex items-center">
          <ChevronLeft size={18} className="mr-1" /> {t.back}
        </button>
        <button
          type="button"
          onClick={() => validateStep2() && goNext(2)}
          className="bg-ink text-white px-8 py-3 rounded-xl font-bold flex items-center shadow-lg hover:shadow-xl transition-all"
        >
          {t.next} <ChevronRight size={18} className="ml-2" />
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-5">
      <div>
        <h3 className="text-2xl font-serif font-bold text-ink">{t.step3Title}</h3>
        <p className="text-sm text-gray-500 mt-1">{t.step3Sub}</p>
      </div>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder={t.descriptionPlaceholder}
        rows={6}
        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none resize-none ${
          errors.description ? 'border-red-400' : 'border-gray-200'
        }`}
      />
      {errors.description && <p className="text-red-600 text-xs">{errors.description}</p>}
      <div className="flex justify-between pt-4 border-t border-gray-100">
        <button type="button" onClick={goBack} className="text-gray-500 hover:text-ink font-medium px-2 flex items-center">
          <ChevronLeft size={18} className="mr-1" /> {t.back}
        </button>
        <button
          type="button"
          onClick={() => validateStep3() && goNext(3)}
          className="bg-ink text-white px-8 py-3 rounded-xl font-bold flex items-center shadow-lg hover:shadow-xl transition-all"
        >
          {t.next} <ChevronRight size={18} className="ml-2" />
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-5">
      <div>
        <h3 className="text-2xl font-serif font-bold text-ink">{t.step5Title}</h3>
        <p className="text-sm text-gray-500 mt-1">{t.step5Sub}</p>
      </div>

      {/* Honeypot field — hidden from real users, bots often fill every field. */}
      <input
        type="text"
        name="company_website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <div className="space-y-4">
        <div>
          <input
            type="text"
            placeholder={t.name}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none ${errors.name ? 'border-red-400' : 'border-gray-200'}`}
          />
          {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <input
            type="tel"
            placeholder={t.phone}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none ${errors.phone ? 'border-red-400' : 'border-gray-200'}`}
          />
          {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
        </div>
        <div>
          <input
            type="email"
            placeholder={t.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-primary focus:outline-none ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
          />
          {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">{t.preferredContact}</label>
          <div className="grid grid-cols-4 gap-2">
            {(['call', 'text', 'email', 'whatsapp'] as PreferredContact[]).map((opt) => (
              <button
                type="button"
                key={opt}
                onClick={() => setPreferredContact(opt)}
                className={`py-2 px-1 rounded-lg text-xs font-bold border transition-all ${
                  preferredContact === opt ? 'bg-primary border-primary text-white' : 'bg-gray-50 border-transparent text-gray-600 hover:border-primary'
                }`}
              >
                {t.contactOpts[opt]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <input
            type="text"
            placeholder={t.bestTime}
            value={bestTime}
            onChange={(e) => setBestTime(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>
      </div>

      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
          <AlertTriangle size={16} className="text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{submitError}</p>
        </div>
      )}

      <div className="flex justify-between pt-4 border-t border-gray-100">
        <button type="button" onClick={goBack} disabled={submitting} className="text-gray-500 hover:text-ink font-medium px-2 flex items-center disabled:opacity-50">
          <ChevronLeft size={18} className="mr-1" /> {t.back}
        </button>
        <button
          type="button"
          disabled={submitting}
          onClick={handleSubmit}
          className="bg-primary text-white text-base px-8 py-3.5 rounded-xl font-extrabold disabled:opacity-60 shadow-xl hover:shadow-2xl transition-all uppercase tracking-wide flex items-center gap-2"
        >
          {submitting && <Loader2 size={18} className="animate-spin" />}
          {submitting ? t.submitting : t.submit}
        </button>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center py-8 px-2 space-y-6">
      <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
        <Check size={48} />
      </div>
      <div>
        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-ink mb-1">{t.successTitle}</h3>
        <p className="font-bold text-ink uppercase text-sm tracking-wide mb-3">{t.successSubtitle}</p>
        <p className="text-gray-600 max-w-sm mx-auto">{t.successBody}</p>
        {result?.referenceNumber && (
          <p className="text-xs text-gray-400 mt-3">
            {t.reference}: <span className="font-mono font-bold text-gray-600">{result.referenceNumber}</span>
          </p>
        )}
        <p className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mt-3 max-w-sm mx-auto">
          {language === Language.EN
            ? "We've opened WhatsApp with your request pre-filled — just hit send! Have photos of the project? Attach them right in the chat."
            : 'Abrimos WhatsApp con tu solicitud lista — ¡solo envíala! ¿Tienes fotos del proyecto? Adjúntalas directamente en el chat.'}
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        <a
          href={getTelUrl(COMPANY.phone)}
          onClick={() => trackEvent('call_click', { context: 'estimate_success' })}
          className="bg-ink text-white px-6 py-3 rounded-full font-bold hover:bg-charcoal transition-colors shadow-lg flex items-center justify-center gap-2"
        >
          <Phone size={16} /> {TRANSLATIONS[language].common.call.toUpperCase()}
        </a>
        <a
          href={getWhatsAppUrl(COMPANY.whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('whatsapp_click', { context: 'estimate_success' })}
          className="bg-green-600 text-white px-6 py-3 rounded-full font-bold hover:bg-green-700 transition-colors shadow-lg flex items-center justify-center gap-2"
        >
          <MessageCircle size={16} /> WhatsApp
        </a>
        <button
          type="button"
          onClick={onClose}
          className="border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-full font-bold hover:bg-gray-50 transition-colors"
        >
          {t.returnHome}
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-5 sm:p-8 max-w-2xl w-full mx-auto relative overflow-hidden flex flex-col max-h-[92vh]">
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors z-10"
      >
        <X size={22} />
      </button>

      {step <= TOTAL_STEPS && renderProgress()}

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
        {step === 5 && renderSuccess()}
      </div>
    </div>
  );
};

export default EstimateSystem;
