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

const ADMIN_TOKEN = "mater-dei-admin-2024-secreto-muy-largo-para-seguridad";

async function handler(req: Request, context: Context) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');
  const appointmentId = url.searchParams.get('id');

  // Verify admin token
  if (token !== ADMIN_TOKEN) {
    return new Response(
      '<html><body><h1>❌ Acceso denegado</h1><p>Token inválido</p></body></html>',
      { status: 403, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }

  if (!appointmentId) {
    return new Response(
      '<html><body><h1>❌ Error</h1><p>ID de cita no proporcionado</p></body></html>',
      { status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }

  try {
    const store = getStore("appointments");
    const appointment = await store.get(appointmentId, { type: "json" }) as Appointment | null;

    if (!appointment) {
      return new Response(
        '<html><body><h1>❌ Error</h1><p>Cita no encontrada</p></body></html>',
        { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }

    // Update status
    appointment.status = 'CONFIRMADA';
    await store.setJSON(appointmentId, appointment);

    // Generate WhatsApp message to client
    const dateFormatted = new Date(appointment.date).toLocaleDateString('es-MX', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
    
    const clientMessage = `¡Hola ${appointment.name}! 🌸

Tu cita en *Mater Dei Spa* ha sido *CONFIRMADA* ✅

📋 *Servicio:* ${appointment.service}
📅 *Fecha:* ${dateFormatted}
🕐 *Hora:* ${appointment.time}
💵 *Precio:* $100 USD

¡Te esperamos! 💜`;

    const whatsappClientUrl = `https://wa.me/52${appointment.phone.replace(/\D/g, '')}?text=${encodeURIComponent(clientMessage)}`;

    return new Response(
      `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cita Confirmada - Mater Dei Spa</title>
  <style>
    body { font-family: system-ui, sans-serif; background: linear-gradient(135deg, #F5F0FA, #E8DFF0); min-height: 100vh; display: flex; align-items: center; justify-content: center; margin: 0; }
    .card { background: white; border-radius: 20px; padding: 40px; text-align: center; box-shadow: 0 10px 40px rgba(155, 123, 184, 0.2); max-width: 400px; }
    h1 { color: #25D366; margin-bottom: 10px; }
    .info { background: #F5F0FA; padding: 20px; border-radius: 15px; margin: 20px 0; text-align: left; }
    .info p { margin: 8px 0; color: #3D3D3D; }
    .btn { display: inline-block; background: #25D366; color: white; padding: 15px 30px; border-radius: 50px; text-decoration: none; font-weight: bold; margin-top: 15px; }
    .btn:hover { background: #128C7E; }
  </style>
</head>
<body>
  <div class="card">
    <h1>✅ ¡Cita Confirmada!</h1>
    <p>La cita de <strong>${appointment.name}</strong> ha sido confirmada.</p>
    <div class="info">
      <p>🌸 <strong>Servicio:</strong> ${appointment.service}</p>
      <p>📅 <strong>Fecha:</strong> ${dateFormatted}</p>
      <p>🕐 <strong>Hora:</strong> ${appointment.time}</p>
      <p>📱 <strong>Teléfono:</strong> ${appointment.phone}</p>
    </div>
    <a href="${whatsappClientUrl}" class="btn">📱 Notificar al Cliente por WhatsApp</a>
  </div>
</body>
</html>`,
      { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  } catch (error) {
    console.error('Error confirming appointment:', error);
    return new Response(
      '<html><body><h1>❌ Error</h1><p>Error al confirmar la cita</p></body></html>',
      { status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }
}

export default handler;

export const config = {
  path: "/api/confirm-appointment"
};
