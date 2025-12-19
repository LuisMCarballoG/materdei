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
  const token = url.searchParams.get('adminToken');

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  if (token !== ADMIN_TOKEN) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 403, headers }
    );
  }

  try {
    const store = getStore("appointments");
    const list = await store.list();
    
    const appointments: Appointment[] = [];
    for (const item of list.blobs) {
      const appointment = await store.get(item.key, { type: "json" }) as Appointment;
      if (appointment) {
        appointments.push(appointment);
      }
    }

    // Sort by date and time
    appointments.sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    });

    return new Response(
      JSON.stringify({ success: true, appointments }),
      { status: 200, headers }
    );
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return new Response(
      JSON.stringify({ error: 'Error fetching appointments' }),
      { status: 500, headers }
    );
  }
}

export default handler;

export const config = {
  path: "/api/appointments"
};
