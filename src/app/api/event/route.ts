import { NextRequest, NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import { addDays, set } from 'date-fns';
import { Events } from '@db/tables.ts';

export const POST = async (req: NextRequest) => {
  const db = drizzle(sql);
  const body = await req.json();

  // Convert openClose times to separate open and close dates
  const eventDate = new Date(body.date);
  let openTime = body.openClose[0];
  let closeTime = body.openClose[1];

  // Convert times to hours and minutes
  let openHours = Math.floor(openTime);
  let openMinutes = Math.floor((openTime - openHours) * 60);
  if (openHours >= 24) {
    openHours -= 24;
  }

  let closeHours = Math.floor(closeTime);
  let closeMinutes = Math.floor((closeTime - closeHours) * 60);
  let closeDate = eventDate;

  if (closeHours >= 24) {
    closeHours -= 24;
    closeDate = addDays(eventDate, 1); // Adds one day if close time is past midnight
  }

  // Create open and close date objects
  const open = set(eventDate, { hours: openHours, minutes: openMinutes });
  const close = set(closeDate, { hours: closeHours, minutes: closeMinutes });

  const event = {
    ...body,
    date: eventDate,
    open: open,
    close: close,
    created_at: new Date(),

    updated_at: new Date(),
  };

  const result = await db.insert(Events).values(event);
  return NextResponse.json(result);
};
