import type { Context } from "@netlify/functions";

// Blocked time slots (in production, fetch from database)
const blockedSlots: { date: string; time: string }[] = [];

export default async (req: Request, context: Context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers }
    );
  }

  // Generate available dates (next 14 days, excluding Sundays)
  const availableDates: { date: string; label: string; slots: string[] }[] = [];
  const today = new Date();
  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

  for (let i = 1; i <= 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    // Skip Sundays
    if (date.getDay() === 0) continue;

    const dateStr = date.toISOString().split('T')[0];
    const label = date.toLocaleDateString('es-MX', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });

    // Filter out blocked slots for this date
    const availableSlots = timeSlots.filter(
      time => !blockedSlots.some(b => b.date === dateStr && b.time === time)
    );

    availableDates.push({
      date: dateStr,
      label,
      slots: availableSlots,
    });
  }

  return new Response(
    JSON.stringify({
      success: true,
      availability: availableDates,
    }),
    { status: 200, headers }
  );
};

export const config = {
  path: "/api/get-availability"
};
