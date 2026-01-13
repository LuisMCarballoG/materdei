'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface Appointment {
  id: string;
  service: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  status: 'PENDIENTE' | 'CONFIRMADA' | 'RECHAZADA';
  createdAt: string;
}

const VALID_TOKEN = "mater-dei-admin-2024-secreto-muy-largo-para-seguridad";

export default function AdminCalendar() {
  const params = useParams();
  const token = params.token as string;
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (token !== VALID_TOKEN) {
      setError('Acceso denegado: Token inválido');
      setLoading(false);
      return;
    }

    fetchAppointments();
  }, [token]);

  const fetchAppointments = async () => {
    try {
      const response = await fetch(`/api/appointments?adminToken=${token}`);
      const data = await response.json();
      
      if (data.success) {
        setAppointments(data.appointments);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Error al cargar citas');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDIENTE': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'CONFIRMADA': return 'bg-green-100 text-green-800 border-green-300';
      case 'RECHAZADA': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'PENDIENTE': return '⏳';
      case 'CONFIRMADA': return '✅';
      case 'RECHAZADA': return '❌';
      default: return '❓';
    }
  };

  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
  
  const getAppointmentForSlot = (date: string, time: string) => {
    return appointments.find(apt => apt.date === date && apt.time === time && apt.status !== 'RECHAZADA');
  };

  // Generate week dates
  const getWeekDates = () => {
    const dates = [];
    const startDate = new Date(selectedDate);
    startDate.setDate(startDate.getDate() - startDate.getDay() + 1); // Start from Monday
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('es-MX', { weekday: 'short' }),
        dayNumber: date.getDate(),
        isToday: date.toISOString().split('T')[0] === new Date().toISOString().split('T')[0],
      });
    }
    return dates;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F0FA] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-spin">⏳</div>
          <p className="text-[#6B6B6B]">Cargando calendario...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F0FA] flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
          <div className="text-4xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
          <p className="text-[#6B6B6B]">{error}</p>
        </div>
      </div>
    );
  }

  const weekDates = getWeekDates();
  const pendingCount = appointments.filter(a => a.status === 'PENDIENTE').length;
  const confirmedCount = appointments.filter(a => a.status === 'CONFIRMADA').length;

  return (
    <div className="min-h-screen bg-[#F5F0FA]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#9B7BB8] to-[#D4A5C9] text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">📅 Calendario Admin</h1>
              <p className="text-white/80">Mater Dei Spa - Gestión de Citas</p>
            </div>
            <div className="flex gap-4">
              <div className="bg-white/20 rounded-xl px-4 py-2 text-center">
                <div className="text-2xl font-bold">{pendingCount}</div>
                <div className="text-xs">Pendientes</div>
              </div>
              <div className="bg-white/20 rounded-xl px-4 py-2 text-center">
                <div className="text-2xl font-bold">{confirmedCount}</div>
                <div className="text-xs">Confirmadas</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Week Navigation */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <button 
              onClick={() => {
                const d = new Date(selectedDate);
                d.setDate(d.getDate() - 7);
                setSelectedDate(d.toISOString().split('T')[0]);
              }}
              className="px-4 py-2 bg-[#F5F0FA] rounded-lg hover:bg-[#E8DFF0] transition-colors"
            >
              ← Semana anterior
            </button>
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-[#E8DFF0] rounded-lg"
            />
            <button 
              onClick={() => {
                const d = new Date(selectedDate);
                d.setDate(d.getDate() + 7);
                setSelectedDate(d.toISOString().split('T')[0]);
              }}
              className="px-4 py-2 bg-[#F5F0FA] rounded-lg hover:bg-[#E8DFF0] transition-colors"
            >
              Semana siguiente →
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-2 border-b border-[#E8DFF0] text-left text-sm text-[#6B6B6B] w-20">Hora</th>
                  {weekDates.map(date => (
                    <th 
                      key={date.value} 
                      className={`p-2 border-b border-[#E8DFF0] text-center ${date.isToday ? 'bg-[#9B7BB8] text-white rounded-t-lg' : ''}`}
                    >
                      <div className="text-sm font-medium">{date.dayName}</div>
                      <div className="text-lg font-bold">{date.dayNumber}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map(time => (
                  <tr key={time} className="hover:bg-[#F5F0FA]/50">
                    <td className="p-2 border-b border-[#E8DFF0] text-sm font-medium text-[#6B6B6B]">{time}</td>
                    {weekDates.map(date => {
                      const apt = getAppointmentForSlot(date.value, time);
                      return (
                        <td 
                          key={`${date.value}-${time}`} 
                          className={`p-1 border-b border-l border-[#E8DFF0] ${date.isToday ? 'bg-[#9B7BB8]/5' : ''}`}
                        >
                          {apt ? (
                            <div className={`p-2 rounded-lg border text-xs ${getStatusColor(apt.status)}`}>
                              <div className="font-bold truncate">{getStatusEmoji(apt.status)} {apt.name}</div>
                              <div className="truncate opacity-75">{apt.service}</div>
                              {apt.status === 'PENDIENTE' && (
                                <div className="flex gap-1 mt-1">
                                  <a 
                                    href={`/api/confirm-appointment?token=${token}&id=${apt.id}`}
                                    className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                                  >
                                    ✓
                                  </a>
                                  <a 
                                    href={`/api/reject-appointment?token=${token}&id=${apt.id}`}
                                    className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                                  >
                                    ✗
                                  </a>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="h-12 flex items-center justify-center text-[#E8DFF0]">
                              -
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Appointments List */}
        {pendingCount > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-[#3D3D3D] mb-4">⏳ Citas Pendientes</h2>
            <div className="space-y-3">
              {appointments.filter(a => a.status === 'PENDIENTE').map(apt => (
                <div key={apt.id} className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl border border-yellow-200">
                  <div>
                    <div className="font-bold text-[#3D3D3D]">{apt.name}</div>
                    <div className="text-sm text-[#6B6B6B]">
                      {apt.service} • {new Date(apt.date).toLocaleDateString('es-MX')} {apt.time}
                    </div>
                    <div className="text-sm text-[#9B7BB8]">📱 {apt.phone}</div>
                  </div>
                  <div className="flex gap-2">
                    <a 
                      href={`/api/confirm-appointment?token=${token}&id=${apt.id}`}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    >
                      ✅ Confirmar
                    </a>
                    <a 
                      href={`/api/reject-appointment?token=${token}&id=${apt.id}`}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      ❌ Rechazar
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
