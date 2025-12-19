'use client';

import { useEffect, useState } from 'react';
import ChatWidget from '@/components/ChatWidget';

interface Service {
  id: number;
  name: string;
  description: string;
  icon: string;
  price: number;
}

const services: Service[] = [
  { id: 1, name: 'Limpieza Facial Profunda', description: 'Limpieza profunda para una piel radiante y renovada', icon: '✨', price: 280 },
  { id: 2, name: 'Limpieza con Microdermoabrasión', description: 'Exfoliación avanzada para una piel suave y rejuvenecida', icon: '💎', price: 300 },
  { id: 3, name: 'Tratamientos Antiedad', description: 'Rejuvenecimiento y cuidado especializado para tu rostro', icon: '🌸', price: 300 },
  { id: 4, name: 'Masaje Relajante Medio Cuerpo', description: 'Libera el estrés (50 minutos)', icon: '🧘', price: 250 },
  { id: 5, name: 'Masaje Relajante Cuerpo Completo', description: 'Relajación total (1 hora 20 min)', icon: '💆', price: 330 },
  { id: 6, name: 'Masaje Descontracturante', description: 'Alivio de tensiones (40 min por zona)', icon: '💪', price: 200 },
  { id: 7, name: 'Masaje Piernas Cansadas', description: 'Recupera la ligereza y vitalidad de tus piernas', icon: '🦵', price: 200 },
];

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    // Scroll animation observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.scroll-animate').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Floating decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#D4A5C9] rounded-full opacity-20 blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-48 h-48 bg-[#9B7BB8] rounded-full opacity-15 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-[#7A9E7E] rounded-full opacity-15 blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#9B7BB8] to-[#D4A5C9] flex items-center justify-center text-white text-2xl">
              🙏
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">Mater Dei</h1>
              <p className="text-xs text-[#6B6B6B]">Cabina & Spa</p>
            </div>
          </div>
          <div className="hidden md:flex gap-8 text-[#3D3D3D]">
            <a href="#servicios" className="hover:text-[#9B7BB8] transition-colors">Servicios</a>
            <a href="#nosotros" className="hover:text-[#9B7BB8] transition-colors">Nosotros</a>
            <a href="#contacto" className="hover:text-[#9B7BB8] transition-colors">Contacto</a>
          </div>
          <a href="https://wa.me/5212881198312" className="btn-primary text-sm">
            Agendar Cita
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6">
        <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="mb-6">
            <span className="inline-block px-4 py-2 rounded-full bg-[#D4A5C9]/30 text-[#9B7BB8] text-sm font-medium">
              ✨ Un spa para tu bienestar
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="gradient-text">Renueva tu</span>
            <br />
            <span className="text-[#3D3D3D]">Cuerpo y Alma</span>
          </h1>
          <p className="text-xl text-[#6B6B6B] mb-8 max-w-2xl mx-auto">
            Descubre el oasis de paz que mereces. Tratamientos faciales, corporales y masajes terapéuticos con la calidez y profesionalismo que nos caracteriza.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#servicios" className="btn-primary text-lg">
              Ver Servicios
            </a>
            <a href="https://wa.me/5212881198312" className="btn-secondary text-lg">
              WhatsApp: 288 119 8312
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 scroll-animate">
            <span className="inline-block px-4 py-2 rounded-full bg-[#9B7BB8]/20 text-[#9B7BB8] text-sm font-medium mb-4">
              NUESTROS SERVICIOS
            </span>
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              Nuestros Tratamientos
            </h2>
            <p className="text-[#6B6B6B] text-lg max-w-2xl mx-auto">
              Cada servicio está diseñado para brindarte una experiencia única de relajación y bienestar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div
                key={service.id}
                className="service-card hover-lift scroll-animate"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-[#3D3D3D] mb-2">{service.name}</h3>
                <p className="text-[#6B6B6B] mb-4">{service.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-[#9B7BB8]">${service.price} MXN</span>
                  <span className="text-sm text-[#6B6B6B]">por sesión</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="nosotros" className="py-20 px-6 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="scroll-animate">
              <span className="inline-block px-4 py-2 rounded-full bg-[#7A9E7E]/20 text-[#7A9E7E] text-sm font-medium mb-4">
                QUIÉNES SOMOS
              </span>
              <h2 className="text-4xl font-bold text-[#3D3D3D] mb-6">
                Tu espacio de bienestar en Tres Valles
              </h2>
              <p className="text-[#6B6B6B] mb-4 leading-relaxed">
                <strong className="text-[#9B7BB8]">Mater Dei - Cabina & Spa</strong> nació en Tres Valles, Veracruz, como el sueño hecho realidad de Teresita de Jesús, Licenciada en Cosmetología con pasión por el cuidado personal y el bienestar.
              </p>
              <p className="text-[#6B6B6B] mb-6 leading-relaxed">
                El nombre <em>&quot;Mater Dei&quot;</em> (Madre de Dios en latín) refleja nuestra filosofía de cuidado y dedicación hacia cada cliente que nos visita, brindando un servicio con amor y profesionalismo.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="glass p-4 rounded-xl">
                  <div className="text-3xl font-bold text-[#9B7BB8]">100+</div>
                  <div className="text-sm text-[#6B6B6B]">Clientes satisfechos</div>
                </div>
                <div className="glass p-4 rounded-xl">
                  <div className="text-3xl font-bold text-[#9B7BB8]">1000+</div>
                  <div className="text-sm text-[#6B6B6B]">Experiencias de bienestar</div>
                </div>
              </div>
            </div>
            
            <div className="scroll-animate">
              <div className="glass-strong rounded-3xl p-8">
                <h3 className="text-xl font-bold text-[#3D3D3D] mb-4">Nuestros Valores</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#D4A5C9]/30 flex items-center justify-center text-xl">💜</div>
                    <div>
                      <h4 className="font-semibold text-[#3D3D3D]">Calidez</h4>
                      <p className="text-sm text-[#6B6B6B]">Tratamos a cada cliente como parte de nuestra familia</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#9B7BB8]/30 flex items-center justify-center text-xl">🎓</div>
                    <div>
                      <h4 className="font-semibold text-[#3D3D3D]">Profesionalismo</h4>
                      <p className="text-sm text-[#6B6B6B]">Personal certificado y en constante capacitación</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#7A9E7E]/30 flex items-center justify-center text-xl">🌟</div>
                    <div>
                      <h4 className="font-semibold text-[#3D3D3D]">Calidad</h4>
                      <p className="text-sm text-[#6B6B6B]">Productos premium y técnicas de vanguardia</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center scroll-animate">
          <span className="inline-block px-4 py-2 rounded-full bg-[#D4A5C9]/30 text-[#9B7BB8] text-sm font-medium mb-4">
            CONTÁCTANOS
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#3D3D3D] mb-6">
            Agenda tu cita hoy
          </h2>
          <p className="text-[#6B6B6B] text-lg mb-8 max-w-2xl mx-auto">
            Escríbenos por WhatsApp y te confirmaremos tu cita de inmediato. ¡Tu bienestar nos espera!
          </p>
          
          <a 
            href="https://wa.me/5212881198312?text=Hola%2C%20me%20gustar%C3%ADa%20agendar%20una%20cita%20en%20Mater%20Dei%20Spa" 
            className="whatsapp-btn text-xl inline-flex animate-pulse-glow"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            288 119 8312
          </a>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass p-6 rounded-2xl">
              <div className="text-3xl mb-3">📍</div>
              <h4 className="font-semibold text-[#3D3D3D]">Ubicación</h4>
              <p className="text-sm text-[#6B6B6B]">Veracruz, México</p>
            </div>
            <div className="glass p-6 rounded-2xl">
              <div className="text-3xl mb-3">🕐</div>
              <h4 className="font-semibold text-[#3D3D3D]">Horario</h4>
              <p className="text-sm text-[#6B6B6B]">Lun-Sáb: 9am - 7pm</p>
            </div>
            <div className="glass p-6 rounded-2xl">
              <div className="text-3xl mb-3">💵</div>
              <h4 className="font-semibold text-[#3D3D3D]">Precio Único</h4>
              <p className="text-sm text-[#6B6B6B]">Desde $200 MXN</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-[#3D3D3D] text-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#9B7BB8] to-[#D4A5C9] flex items-center justify-center text-xl">
              🙏
            </div>
            <div>
              <h4 className="font-bold">Mater Dei</h4>
              <p className="text-xs text-gray-400">Cabina & Spa</p>
            </div>
          </div>
          <p className="text-sm text-gray-400">
            © 2024 Mater Dei Spa. Todos los derechos reservados.
          </p>
          <a href="https://wa.me/5212881198312" className="text-[#25D366] hover:underline">
            WhatsApp: 288 119 8312
          </a>
        </div>
      </footer>

      {/* Chat Widget for Appointments */}
      <ChatWidget />
    </div>
  );
}
