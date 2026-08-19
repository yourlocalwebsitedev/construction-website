import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { Language } from '../types';
import { Calendar, Clock, User, Mail, Phone, FileText, Check, X, Trash2, AlertCircle } from 'lucide-react';

interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: any;
}

interface BookingsViewProps {
  language: Language;
}

export const BookingsView: React.FC<BookingsViewProps> = ({ language }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const bookingsData: Booking[] = [];
      querySnapshot.forEach((doc) => {
        bookingsData.push({ id: doc.id, ...doc.data() } as Booking);
      });
      
      setBookings(bookingsData);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: Booking['status']) => {
    try {
      await updateDoc(doc(db, 'bookings', bookingId), {
        status: newStatus
      });
      
      setBookings(bookings.map(b => 
        b.id === bookingId ? { ...b, status: newStatus } : b
      ));
      
      alert(language === Language.EN 
        ? `Booking ${newStatus}!` 
        : `¡Reserva ${newStatus === 'confirmed' ? 'confirmada' : newStatus === 'completed' ? 'completada' : 'cancelada'}!`
      );
    } catch (error) {
      console.error('Error updating booking:', error);
      alert(language === Language.EN ? 'Error updating booking!' : '¡Error al actualizar!');
    }
  };

  const deleteBooking = async (bookingId: string) => {
    if (!confirm(language === Language.EN ? 'Delete this booking?' : '¿Eliminar esta reserva?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'bookings', bookingId));
      setBookings(bookings.filter(b => b.id !== bookingId));
      alert(language === Language.EN ? 'Booking deleted!' : '¡Reserva eliminada!');
    } catch (error) {
      console.error('Error deleting booking:', error);
      alert(language === Language.EN ? 'Error deleting booking!' : '¡Error al eliminar!');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(language === Language.EN ? 'en-US' : 'es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString(language === Language.EN ? 'en-US' : 'es-ES', {
        hour: 'numeric',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Booking['status']) => {
    switch (status) {
      case 'pending': return <AlertCircle size={16} />;
      case 'confirmed': return <Check size={16} />;
      case 'completed': return <Check size={16} />;
      case 'cancelled': return <X size={16} />;
      default: return null;
    }
  };

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-gray-600">
          {language === Language.EN ? 'Loading bookings...' : 'Cargando reservas...'}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-yellow-600 font-medium uppercase">
                {language === Language.EN ? 'Pending' : 'Pendientes'}
              </p>
              <p className="text-2xl font-bold text-yellow-800">
                {bookings.filter(b => b.status === 'pending').length}
              </p>
            </div>
            <AlertCircle className="text-yellow-500" size={32} />
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-600 font-medium uppercase">
                {language === Language.EN ? 'Confirmed' : 'Confirmadas'}
              </p>
              <p className="text-2xl font-bold text-blue-800">
                {bookings.filter(b => b.status === 'confirmed').length}
              </p>
            </div>
            <Check className="text-blue-500" size={32} />
          </div>
        </div>

        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-green-600 font-medium uppercase">
                {language === Language.EN ? 'Completed' : 'Completadas'}
              </p>
              <p className="text-2xl font-bold text-green-800">
                {bookings.filter(b => b.status === 'completed').length}
              </p>
            </div>
            <Check className="text-green-500" size={32} />
          </div>
        </div>

        <div className="bg-gray-50 border-l-4 border-gray-500 p-4 rounded">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 font-medium uppercase">
                {language === Language.EN ? 'Total' : 'Total'}
              </p>
              <p className="text-2xl font-bold text-gray-800">{bookings.length}</p>
            </div>
            <Calendar className="text-gray-500" size={32} />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 border-b overflow-x-auto">
        {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 font-medium whitespace-nowrap transition ${
              filter === status
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {language === Language.EN 
              ? status.charAt(0).toUpperCase() + status.slice(1)
              : status === 'all' ? 'Todas' 
              : status === 'pending' ? 'Pendientes'
              : status === 'confirmed' ? 'Confirmadas'
              : status === 'completed' ? 'Completadas'
              : 'Canceladas'
            }
            {status === 'all' && ` (${bookings.length})`}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Calendar className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-500">
            {language === Language.EN ? 'No bookings found.' : 'No se encontraron reservas.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 border-l-4 border-primary"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                {/* Left Side - Customer Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <User size={20} className="text-primary" />
                        {booking.customerName}
                      </h3>
                      <p className="text-sm font-medium text-primary mt-1">
                        {booking.serviceName}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      {booking.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail size={16} className="text-gray-400" />
                      <a href={`mailto:${booking.customerEmail}`} className="hover:text-primary">
                        {booking.customerEmail}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-gray-400" />
                      <a href={`tel:${booking.customerPhone}`} className="hover:text-primary">
                        {booking.customerPhone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      {formatDate(booking.date)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-400" />
                      {formatTime(booking.date)}
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded flex items-start gap-2">
                      <FileText size={16} className="text-gray-400 mt-0.5" />
                      <p className="text-sm text-gray-700">{booking.notes}</p>
                    </div>
                  )}
                </div>

                {/* Right Side - Actions */}
                <div className="flex lg:flex-col gap-2">
                  {booking.status === 'pending' && (
                    <button
                      onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm font-medium flex items-center gap-1"
                    >
                      <Check size={16} />
                      {language === Language.EN ? 'Confirm' : 'Confirmar'}
                    </button>
                  )}
                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => updateBookingStatus(booking.id, 'completed')}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm font-medium flex items-center gap-1"
                    >
                      <Check size={16} />
                      {language === Language.EN ? 'Complete' : 'Completar'}
                    </button>
                  )}
                  {(booking.status === 'pending' || booking.status === 'confirmed') && (
                    <button
                      onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium flex items-center gap-1"
                    >
                      <X size={16} />
                      {language === Language.EN ? 'Cancel' : 'Cancelar'}
                    </button>
                  )}
                  <button
                    onClick={() => deleteBooking(booking.id)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-sm font-medium flex items-center gap-1"
                  >
                    <Trash2 size={16} />
                    {language === Language.EN ? 'Delete' : 'Eliminar'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
