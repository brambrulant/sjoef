import { NextRequest, NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import { Tickets } from '@db/tables.ts';
import { eq, and } from 'drizzle-orm';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export const GET = async (req: NextRequest) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const db = drizzle(sql);
  const eventId = req.nextUrl.pathname.split('/').pop();

  if (!eventId) {
    return NextResponse.json({ message: 'Event id is required' }, { status: 400 });
  }

  if (!user?.id) {
    return NextResponse.json({ message: 'No user id found' }, { status: 400 });
  }

  const tickets = await db
    .select()
    .from(Tickets)
    .where(and(eq(Tickets.event_id, parseInt(eventId)), eq(Tickets.user_id, user?.id)));

  if (!tickets) {
    return NextResponse.json({ message: 'No tickets for this event found' }, { status: 404 });
  }

  return NextResponse.json(tickets);
};
