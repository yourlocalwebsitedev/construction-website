import React, { useState, useEffect } from 'react';
import { Service, Booking, Language } from '../types';
import { storageService } from '../services/storage';
import { TRANSLATIONS } from '../constants';
import { Check, Calendar, Clock, ChevronRight, ChevronLeft, User, Mail, Phone, FileText, X } from 'lucide-react';

interface BookingSystemProps {
  language: Language;
  preselectedServiceId?: string;
  onClose: () => void;
}

const BookingSystem: React.FC<BookingSystemProps> = ({ language, preselectedServiceId, onClose }) => {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<string | null>(preselectedServiceId || null);
  
  // Date Selection State
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(new Date());

  const [selectedTime, setSelectedTime] = useState<string>('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', notes: '' });
  const t = TRANSLATIONS[language];

  // Time slots for the grid
  // We store them in 24h format for logic, but display based on locale
  const timeSlots = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  useEffect(() => {
    setServices(storageService.getServices());
  }, []);

  const handleNext = () => setStep(p => p + 1);
  const handleBack = () => setStep(p => p - 1);

  const handleSubmit = () => {
    if (!selectedService || !selectedDate || !selectedTime) return;

    const newBooking: Booking = {
      id: Date.now().toString(),
      serviceId: selectedService,
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      date: `${selectedDate}T${selectedTime}`,
      status: 'pending',
      notes: formData.notes
    };

    storageService.addBooking(newBooking);
    setStep(4); // Success step
  };

  const getSelectedServiceDetails = () => services.find(s => s.id === selectedService);

  // Helper to format time based on language
  const formatTimeDisplay = (time24: string) => {
    const [hours, minutes] = time24.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    
    // Use proper locale formatting
    return date.toLocaleTimeString(language, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: language === Language.EN // 12h for EN, 24h for ES often preferred, or 12h with p.m.
    });
  };

  // Calendar Helpers
  const changeMonth = (offset: number) => {
    const newDate = new Date(currentCalendarMonth);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentCalendarMonth(newDate);
  };

  const renderCalendarDays = () => {
    const year = currentCalendarMonth.getFullYear();
    const month = currentCalendarMonth.getMonth();
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday
    
    const days = [];
    const today = new Date();
    today.setHours(0,0,0,0);

    // Empty slots for start of week
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
    }

    // Days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month, d);
      // Format as YYYY-MM-DD manually to avoid UTC shifts
      const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
      
      const isPast = dateObj < today;
      const isSelected = selectedDate === dateStr;

      days.push(
        <button
          key={d}
          disabled={isPast}
          onClick={() => setSelectedDate(dateStr)}
          className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200
            ${isSelected ? 'bg-primary text-white shadow-md transform scale-110 font-bold' : ''}
            ${!isSelected && !isPast ? 'hover:bg-primary/20 text-gray-700 hover:text-primary' : ''}
            ${isPast ? 'text-gray-300 cursor-not-allowed' : ''}
          `}
        >
          {d}
        </button>
      );
    }
    return days;
  };

  // --- RENDERERS ---

  const renderProgress = () => (
    <div className="mb-8 mt-1">
      <div className="flex justify-between items-center mb-2 px-1 pr-12">
        <span className={`text-xs font-bold uppercase tracking-wider ${step >= 1 ? 'text-primary' : 'text-gray-400'}`}>1. Service</span>
        <span className={`text-xs font-bold uppercase tracking-wider ${step >= 2 ? 'text-primary' : 'text-gray-400'}`}>2. Time</span>
        <span className={`text-xs font-bold uppercase tracking-wider ${step >= 3 ? 'text-primary' : 'text-gray-400'}`}>3. Details</span>
      </div>
      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-300 ease-in-out" 
          style={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }}
        ></div>
      </div>
    </div>
  );

  const renderStep1_Service = () => (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-gray-800">{t.booking.selectService}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto p-2 no-scrollbar">
        {services.map(s => (
          <div 
            key={s.id} 
            onClick={() => setSelectedService(s.id)}
            className={`group relative rounded-xl border-2 overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md flex flex-col
              ${selectedService === s.id ? 'border-primary ring-1 ring-primary' : 'border-gray-100 hover:border-primary/50'}
            `}
          >
            <div className="h-40 overflow-hidden shrink-0">
               <img src={s.imageUrl} alt={s.title[language]} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
            </div>
            <div className={`p-4 flex-1 flex flex-col ${selectedService === s.id ? 'bg-primary/5' : 'bg-white'}`}>
              <div className="flex justify-between items-start mb-2">
                <div className="font-bold text-gray-800 line-clamp-1">{s.title[language]}</div>
                {selectedService === s.id && <div className="bg-primary text-white rounded-full p-0.5 shrink-0 ml-2"><Check size={12}/></div>}
              </div>
              <div className="text-xs text-gray-500 line-clamp-2">{s.description[language]}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button 
          disabled={!selectedService}
          onClick={handleNext}
          className="bg-secondary text-white px-8 py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg hover:shadow-xl hover:bg-gray-800 transition-all"
        >
          Next Step <ChevronRight size={18} className="ml-2" />
        </button>
      </div>
    </div>
  );

  const renderStep2_DateTime = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-800">{t.booking.selectDate}</h3>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Custom Calendar Section */}
        <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-4 px-2">
             <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-gray-100 rounded-full text-gray-600"><ChevronLeft size={20}/></button>
             <span className="font-bold text-lg text-gray-800">
               {currentCalendarMonth.toLocaleString(language, { month: 'long', year: 'numeric' })}
             </span>
             <button onClick={() => changeMonth(1)} className="p-1 hover:bg-gray-100 rounded-full text-gray-600"><ChevronRight size={20}/></button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 mb-2">
             {weekDays.map(d => (
               <div key={d} className="text-center text-xs font-bold text-gray-400 uppercase">{d}</div>
             ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1 place-items-center">
             {renderCalendarDays()}
          </div>
          
          {selectedDate && (
             <div className="mt-4 text-center text-sm font-medium text-primary bg-primary/10 py-2 rounded-lg">
                Selected: {new Date(selectedDate + 'T12:00:00').toLocaleDateString(language, {weekday: 'short', month: 'long', day: 'numeric'})}
             </div>
          )}
        </div>

        {/* Time Slots Section */}
        <div className="flex-[0.8] flex flex-col">
          <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
            <Clock className="mr-2 text-primary" size={16} /> Available Time Slots
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {timeSlots.map(time => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`py-3 px-2 rounded-xl text-sm font-bold transition-all border
                  ${selectedTime === time 
                    ? 'bg-primary border-primary text-white shadow-md transform scale-105' 
                    : 'bg-gray-50 border-transparent text-gray-600 hover:bg-white hover:border-primary hover:text-primary'
                  }
                `}
              >
                {formatTimeDisplay(time)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t border-gray-100">
        <button onClick={handleBack} className="text-gray-500 hover:text-gray-800 font-medium px-4 flex items-center">
          <ChevronLeft size={18} className="mr-2"/> Back
        </button>
        <button 
          disabled={!selectedDate || !selectedTime}
          onClick={handleNext}
          className="bg-secondary text-white px-8 py-3 rounded-xl font-bold disabled:opacity-50 flex items-center shadow-lg hover:shadow-xl hover:bg-gray-800 transition-all"
        >
          Next Step <ChevronRight size={18} className="ml-2" />
        </button>
      </div>
    </div>
  );

  const renderStep3_Info = () => {
    const service = getSelectedServiceDetails();
    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-gray-800">{t.booking.yourInfo}</h3>

        {/* Summary Card */}
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-start gap-4">
           {/* Fixed: Replaced generic Calendar icon with the actual service image */}
           <div className="hidden sm:block h-20 w-20 shrink-0 rounded-lg overflow-hidden shadow-sm border border-gray-200">
             {service?.imageUrl ? (
               <img src={service.imageUrl} alt="Service" className="w-full h-full object-cover" />
             ) : (
               <div className="w-full h-full bg-white flex items-center justify-center text-primary"><Calendar size={32} /></div>
             )}
           </div>
           
           <div>
             <div className="text-xs font-bold text-primary uppercase tracking-wide">Booking Summary</div>
             <div className="font-bold text-gray-800 text-lg">{service?.title[language]}</div>
             <div className="text-sm text-gray-600 mt-1 flex items-center">
               <Calendar size={14} className="mr-1"/>
               {selectedDate && new Date(selectedDate + 'T12:00:00').toLocaleDateString(language)} at {selectedTime && formatTimeDisplay(selectedTime)}
             </div>
             <div className="text-xs text-gray-500 mt-1 line-clamp-1">{service?.description[language]}</div>
           </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" placeholder="Full Name" 
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="email" placeholder="Email Address" 
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>
          
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="tel" placeholder="Phone Number" 
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none"
              value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
            />
          </div>

          <div className="relative">
            <FileText className="absolute left-4 top-4 text-gray-400" size={18} />
            <textarea 
              placeholder="Any special requests or details?" 
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:outline-none h-24 resize-none"
              value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}
            />
          </div>
        </div>

        <div className="flex justify-between pt-6 border-t border-gray-100">
          <button onClick={handleBack} className="text-gray-500 hover:text-gray-800 font-medium px-4 flex items-center">
            <ChevronLeft size={18} className="mr-2"/> Back
          </button>
          <button 
            disabled={!formData.name || !formData.email || !formData.phone}
            onClick={handleSubmit}
            className="bg-primary text-white text-lg px-10 py-4 rounded-xl font-extrabold disabled:opacity-50 shadow-xl hover:shadow-2xl hover:scale-105 hover:bg-amber-500 transition-all uppercase tracking-wide"
          >
            {t.booking.confirm}
          </button>
        </div>
      </div>
    );
  };

  const renderStep4_Success = () => (
    <div className="text-center py-12 px-4 space-y-6">
      <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
        <Check size={48} />
      </div>
      <div>
        <h3 className="text-3xl font-bold text-gray-800 mb-2">Booking Confirmed!</h3>
        <p className="text-gray-600 max-w-xs mx-auto">We've sent a confirmation email to <b>{formData.email}</b>.</p>
      </div>
      <div className="pt-4">
        <button 
          onClick={onClose} 
          className="bg-gray-800 text-white px-8 py-3 rounded-full font-bold hover:bg-gray-900 transition-colors shadow-lg"
        >
          Close & Return to Home
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-3xl w-full mx-auto relative overflow-hidden flex flex-col max-h-[90vh]">
      {/* Header Close Button */}
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors z-10"
      >
        <X size={24} />
      </button>

      {/* Progress Bar (Only for steps 1-3) */}
      {step < 4 && renderProgress()}

      {/* Step Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {step === 1 && renderStep1_Service()}
        {step === 2 && renderStep2_DateTime()}
        {step === 3 && renderStep3_Info()}
        {step === 4 && renderStep4_Success()}
      </div>
    </div>
  );
};

export default BookingSystem;