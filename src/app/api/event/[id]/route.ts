import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import { Events } from '@db/tables.ts';
import { eq } from 'drizzle-orm';
import { NextResponse, NextRequest } from 'next/server';

export const GET = async (req: NextRequest) => {
  const db = drizzle(sql);
  const id = req.nextUrl.pathname.split('/').pop();

  if (!id) {
    return NextResponse.json({ message: 'Event id is required' }, { status: 400 });
  }

  const event = await db
    .select()
    .from(Events)
    .where(eq(Events.id, parseInt(id)));

  if (!event) {
    return NextResponse.json({ message: 'Event not found' });
  }
  return NextResponse.json(event[0]);
};
