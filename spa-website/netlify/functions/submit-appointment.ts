import type { Context } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

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

// Secret token for admin actions (in production, use environment variable)
const ADMIN_TOKEN = "mater-dei-admin-2024-secreto-muy-largo-para-seguridad";
const ADMIN_PHONE = "5212881198312";
const SITE_URL = process.env.URL || "https://mater-dei.netlify.app";

async function handler(req: Request, context: Context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers }
    );
  }

  try {
    const body = await req.json();
    const { service, date, time, name, phone } = body;

    if (!service || !date || !time || !name || !phone) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers }
      );
    }

    // Get appointments store
    const store = getStore("appointments");
    
    // Check for conflicts (same date and time)
    const existingAppointments = await store.list();
    for (const item of existingAppointments.blobs) {
      const existing = await store.get(item.key, { type: "json" }) as Appointment;
      if (existing && existing.date === date && existing.time === time && existing.status !== 'RECHAZADA') {
        return new Response(
          JSON.stringify({ 
            error: 'Horario no disponible',
            message: 'Este horario ya está reservado. Por favor selecciona otro.'
          }),
          { status: 409, headers }
        );
      }
    }

    // Create appointment
    const appointmentId = `APT-${Date.now()}`;
    const appointment: Appointment = {
      id: appointmentId,
      service,
      date,
      time,
      name,
      phone,
      status: 'PENDIENTE',
      createdAt: new Date().toISOString(),
    };

    // Save to Netlify Blobs
    await store.setJSON(appointmentId, appointment);

    // Generate confirm/reject URLs
    const confirmUrl = `${SITE_URL}/api/confirm-appointment?token=${ADMIN_TOKEN}&id=${appointmentId}`;
    const rejectUrl = `${SITE_URL}/api/reject-appointment?token=${ADMIN_TOKEN}&id=${appointmentId}`;
    const calendarUrl = `${SITE_URL}/admin/${ADMIN_TOKEN}`;

    // Build WhatsApp message for admin
    const dateFormatted = new Date(date).toLocaleDateString('es-MX', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    const whatsappMessage = `🔔 *NUEVA CITA EN MATER DEI SPA*

📋 *Servicio:* ${service}
📅 *Fecha:* ${dateFormatted}
🕐 *Hora:* ${time}
👤 *Cliente:* ${name}
📱 *Teléfono:* ${phone}
💵 *Precio:* Ver precios en web (MXN)

✅ *Confirmar:*
${confirmUrl}

❌ *Rechazar:*
${rejectUrl}

📅 *Ver Calendario:*
${calendarUrl}`;

    const whatsappUrl = `https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent(whatsappMessage)}`;

    console.log('New appointment created:', appointment);
    console.log('Admin WhatsApp URL:', whatsappUrl);

    return new Response(
      JSON.stringify({
        success: true,
        message: '¡Cita agendada! Te contactaremos por WhatsApp para confirmar.',
        appointment: {
          id: appointment.id,
          status: appointment.status,
        },
        // Return WhatsApp URL so frontend can optionally open it
        adminNotification: whatsappUrl,
      }),
      { status: 201, headers }
    );
  } catch (error) {
    console.error('Error creating appointment:', error);
    return new Response(
      JSON.stringify({ error: 'Error processing request' }),
      { status: 500, headers }
    );
  }
}

export default handler;

export const config = {
  path: "/api/submit-appointment"
};
