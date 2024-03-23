import { NextRequest, NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { and, eq } from 'drizzle-orm';
import { sql } from '@vercel/postgres';
import { Tickets, Users, Events } from '@db/tables.ts';

export const POST = async (req: NextRequest) => {
  const db = drizzle(sql);
  const body = await req.json();

  const userId = body.userId;
  const eventId = body.eventId;
  const amount = parseInt(body.amount);

  console.log('creating tickets..');

  const result = await db
    .insert(Tickets)
    .values(
      Array.from({ length: amount }, () => ({
        event_id: eventId,
        user_id: userId,
        created_at: new Date(),
        updated_at: new Date(),
      }))
    )
    .execute();

  console.log('successfully created tickets..', result);

  console.log('updating event..');

  const event = await db.select().from(Events).where(eq(Events.id, eventId));

  await db
    .update(Events)
    .set({ tickets_sold: event[0]?.tickets_sold ? event[0]?.tickets_sold + amount : amount })
    .where(eq(Events.id, eventId));

  return NextResponse.json(result);
};
