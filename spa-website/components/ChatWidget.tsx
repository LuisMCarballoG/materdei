'use client';

import { useState } from 'react';

interface AppointmentData {
  service: string;
  date: string;
  time: string;
  name: string;
  phone: string;
}

const services = [
  'Limpiezas Faciales',
  'Tratamientos Faciales',
  'Tratamientos Corporales',
  'Masajes Relajantes',
  'Masajes Terapéuticos',
  'Masajes Reductivos',
  'Masaje Piernas Cansadas',
];

const timeSlots = [
  '09:00', '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
];

type ChatStep = 'welcome' | 'service' | 'date' | 'time' | 'name' | 'phone' | 'confirm' | 'success';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<ChatStep>('welcome');
  const [appointment, setAppointment] = useState<AppointmentData>({
    service: '',
    date: '',
    time: '',
    name: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleServiceSelect = (service: string) => {
    setAppointment({ ...appointment, service });
    setStep('date');
  };

  const handleDateSelect = (date: string) => {
    setAppointment({ ...appointment, date });
    setStep('time');
  };

  const handleTimeSelect = (time: string) => {
    setAppointment({ ...appointment, time });
    setStep('name');
  };

  const handleNameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    if (name.trim()) {
      setAppointment({ ...appointment, name: name.trim() });
      setStep('phone');
    }
  };

  const handlePhoneSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const phone = formData.get('phone') as string;
    if (phone.trim()) {
      setAppointment({ ...appointment, phone: phone.trim() });
      setStep('confirm');
    }
  };

  const handleConfirm = async () => {
    setIsSubmitting(true);
    
    // Simulate API call (in production, this would go to Netlify Functions)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Store locally for now (in production, send to Netlify Blobs/Forms)
    const appointments = JSON.parse(localStorage.getItem('spa_appointments') || '[]');
    appointments.push({
      ...appointment,
      status: 'PENDIENTE',
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem('spa_appointments', JSON.stringify(appointments));
    
    setIsSubmitting(false);
    setStep('success');
  };

  const resetChat = () => {
    setStep('welcome');
    setAppointment({ service: '', date: '', time: '', name: '', phone: '' });
  };

  // Generate next 14 days for date selection
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      // Skip Sundays
      if (date.getDay() !== 0) {
        dates.push({
          value: date.toISOString().split('T')[0],
          label: date.toLocaleDateString('es-MX', { weekday: 'short', month: 'short', day: 'numeric' }),
        });
      }
    }
    return dates;
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-[#9B7BB8] to-[#D4A5C9] text-white text-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50 flex items-center justify-center"
        aria-label="Abrir chat para agendar"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[350px] max-w-[calc(100vw-48px)] h-[500px] max-h-[calc(100vh-120px)] bg-white rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden border border-[#E8DFF0]">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#9B7BB8] to-[#D4A5C9] text-white p-4">
            <h3 className="font-bold text-lg">Mater Dei Spa</h3>
            <p className="text-sm opacity-90">Agenda tu cita 🌸</p>
          </div>

          {/* Chat Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Welcome */}
            {step === 'welcome' && (
              <div className="animate-fade-in-up">
                <div className="bg-[#F5F0FA] rounded-2xl rounded-tl-none p-4 mb-4">
                  <p className="text-[#3D3D3D]">
                    ¡Hola! 👋 Soy tu asistente de Mater Dei Spa. 
                    ¿Te gustaría agendar una cita?
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setStep('service')}
                    className="bg-[#9B7BB8] text-white py-3 px-4 rounded-full hover:bg-[#8A6AA6] transition-colors"
                  >
                    ✨ Agendar Cita
                  </button>
                  <a
                    href="https://wa.me/5212881198312"
                    className="bg-[#25D366] text-white py-3 px-4 rounded-full text-center hover:bg-[#128C7E] transition-colors"
                  >
                    📱 Contactar por WhatsApp
                  </a>
                </div>
              </div>
            )}

            {/* Select Service */}
            {step === 'service' && (
              <div className="animate-fade-in-up">
                <div className="bg-[#F5F0FA] rounded-2xl rounded-tl-none p-4 mb-4">
                  <p className="text-[#3D3D3D]">
                    ¿Qué servicio te gustaría? 
                    <span className="block text-sm text-[#9B7BB8] mt-1">Todos: $100 USD por sesión</span>
                  </p>
                </div>
                <div className="grid gap-2 max-h-[200px] overflow-y-auto">
                  {services.map((service) => (
                    <button
                      key={service}
                      onClick={() => handleServiceSelect(service)}
                      className="bg-white border-2 border-[#E8DFF0] text-[#3D3D3D] py-2 px-4 rounded-xl hover:border-[#9B7BB8] hover:bg-[#F5F0FA] transition-all text-left text-sm"
                    >
                      {service}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Select Date */}
            {step === 'date' && (
              <div className="animate-fade-in-up">
                <div className="bg-[#F5F0FA] rounded-2xl rounded-tl-none p-4 mb-4">
                  <p className="text-[#3D3D3D]">
                    Excelente elección: <strong>{appointment.service}</strong> ✨
                    <span className="block mt-2">¿Qué día te gustaría venir?</span>
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
                  {getAvailableDates().map((date) => (
                    <button
                      key={date.value}
                      onClick={() => handleDateSelect(date.value)}
                      className="bg-white border-2 border-[#E8DFF0] text-[#3D3D3D] py-2 px-3 rounded-xl hover:border-[#9B7BB8] hover:bg-[#F5F0FA] transition-all text-sm"
                    >
                      {date.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Select Time */}
            {step === 'time' && (
              <div className="animate-fade-in-up">
                <div className="bg-[#F5F0FA] rounded-2xl rounded-tl-none p-4 mb-4">
                  <p className="text-[#3D3D3D]">
                    📅 {new Date(appointment.date).toLocaleDateString('es-MX', { weekday: 'long', month: 'long', day: 'numeric' })}
                    <span className="block mt-2">¿A qué hora te viene mejor?</span>
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => handleTimeSelect(time)}
                      className="bg-white border-2 border-[#E8DFF0] text-[#3D3D3D] py-2 px-3 rounded-xl hover:border-[#9B7BB8] hover:bg-[#F5F0FA] transition-all text-sm"
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Enter Name */}
            {step === 'name' && (
              <div className="animate-fade-in-up">
                <div className="bg-[#F5F0FA] rounded-2xl rounded-tl-none p-4 mb-4">
                  <p className="text-[#3D3D3D]">
                    Perfecto! 🎉 Ahora necesito algunos datos.
                    <span className="block mt-2">¿Cuál es tu nombre?</span>
                  </p>
                </div>
                <form onSubmit={handleNameSubmit} className="space-y-3">
                  <input
                    type="text"
                    name="name"
                    placeholder="Tu nombre completo"
                    className="w-full border-2 border-[#E8DFF0] rounded-xl py-3 px-4 focus:border-[#9B7BB8] focus:outline-none transition-colors"
                    required
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="w-full bg-[#9B7BB8] text-white py-3 rounded-full hover:bg-[#8A6AA6] transition-colors"
                  >
                    Continuar →
                  </button>
                </form>
              </div>
            )}

            {/* Enter Phone */}
            {step === 'phone' && (
              <div className="animate-fade-in-up">
                <div className="bg-[#F5F0FA] rounded-2xl rounded-tl-none p-4 mb-4">
                  <p className="text-[#3D3D3D]">
                    Gracias, {appointment.name.split(' ')[0]}! 💜
                    <span className="block mt-2">¿A qué número te contactamos por WhatsApp?</span>
                  </p>
                </div>
                <form onSubmit={handlePhoneSubmit} className="space-y-3">
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Ej: 288 123 4567"
                    className="w-full border-2 border-[#E8DFF0] rounded-xl py-3 px-4 focus:border-[#9B7BB8] focus:outline-none transition-colors"
                    required
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="w-full bg-[#9B7BB8] text-white py-3 rounded-full hover:bg-[#8A6AA6] transition-colors"
                  >
                    Confirmar →
                  </button>
                </form>
              </div>
            )}

            {/* Confirm */}
            {step === 'confirm' && (
              <div className="animate-fade-in-up">
                <div className="bg-[#F5F0FA] rounded-2xl rounded-tl-none p-4 mb-4">
                  <p className="text-[#3D3D3D] font-semibold mb-3">Confirma tu cita:</p>
                  <div className="space-y-2 text-sm">
                    <p>🌸 <strong>Servicio:</strong> {appointment.service}</p>
                    <p>📅 <strong>Fecha:</strong> {new Date(appointment.date).toLocaleDateString('es-MX', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                    <p>🕐 <strong>Hora:</strong> {appointment.time}</p>
                    <p>👤 <strong>Nombre:</strong> {appointment.name}</p>
                    <p>📱 <strong>WhatsApp:</strong> {appointment.phone}</p>
                    <p>💵 <strong>Precio:</strong> $100 USD</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={handleConfirm}
                    disabled={isSubmitting}
                    className="w-full bg-[#25D366] text-white py-3 rounded-full hover:bg-[#128C7E] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin">⏳</span> Enviando...
                      </>
                    ) : (
                      '✅ Confirmar Cita'
                    )}
                  </button>
                  <button
                    onClick={resetChat}
                    className="w-full text-[#6B6B6B] py-2 text-sm hover:text-[#9B7BB8] transition-colors"
                  >
                    ← Empezar de nuevo
                  </button>
                </div>
              </div>
            )}

            {/* Success */}
            {step === 'success' && (
              <div className="animate-fade-in-up text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h4 className="text-xl font-bold text-[#9B7BB8] mb-2">¡Solicitud Recibida!</h4>
                <p className="text-[#6B6B6B] mb-4 text-sm">
                  Te contactaremos por WhatsApp al <strong>{appointment.phone}</strong> para confirmar tu cita.
                </p>
                <div className="bg-[#FFF3CD] border border-[#FFECB5] rounded-xl p-3 text-sm text-[#856404] mb-4">
                  ⚠️ Si no recibes confirmación, significa que el horario no está disponible.
                </div>
                <a
                  href={`https://wa.me/5212881198312?text=Hola%2C%20acabo%20de%20agendar%20una%20cita%20para%20${encodeURIComponent(appointment.service)}%20el%20${encodeURIComponent(appointment.date)}%20a%20las%20${encodeURIComponent(appointment.time)}`}
                  className="inline-block bg-[#25D366] text-white py-3 px-6 rounded-full hover:bg-[#128C7E] transition-colors text-sm"
                >
                  📱 Enviar WhatsApp ahora
                </a>
                <button
                  onClick={resetChat}
                  className="block w-full mt-4 text-[#9B7BB8] text-sm hover:underline"
                >
                  Agendar otra cita
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
