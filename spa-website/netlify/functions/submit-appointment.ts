import type { Context } from "@netlify/functions";

interface Appointment {
  id: string;
  service: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  status: 'PENDIENTE' | 'CONFIRMADA' | 'NO_DISPONIBLE';
  createdAt: string;
}

// In production, this would use Netlify Blobs or a database
// For now, we'll use a simple in-memory store (resets on cold start)
const appointments: Appointment[] = [];

export default async (req: Request, context: Context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle preflight
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

    // Validate required fields
    if (!service || !date || !time || !name || !phone) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers }
      );
    }

    // Create appointment
    const appointment: Appointment = {
      id: `APT-${Date.now()}`,
      service,
      date,
      time,
      name,
      phone,
      status: 'PENDIENTE',
      createdAt: new Date().toISOString(),
    };

    appointments.push(appointment);

    // In production, you would:
    // 1. Save to Netlify Blobs: await context.blobs.set(appointment.id, JSON.stringify(appointment))
    // 2. Send notification email/webhook
    // 3. Log to analytics

    console.log('New appointment created:', appointment);

    return new Response(
      JSON.stringify({
        success: true,
        message: '¡Cita agendada! Te contactaremos por WhatsApp para confirmar.',
        appointment: {
          id: appointment.id,
          status: appointment.status,
        },
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
};

export const config = {
  path: "/api/submit-appointment"
};
