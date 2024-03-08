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
  let openTime = body.openClose[0].toString();
  let closeTime = body.openClose[1].toString();

  const event = {
    ...body,
    date: eventDate,
    open: openTime,
    close: closeTime,
    created_at: new Date(),

    updated_at: new Date(),
  };

  const result = await db.insert(Events).values(event);
  return NextResponse.json(result);
};
