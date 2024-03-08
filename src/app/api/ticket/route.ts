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

  // Check if a ticket for this user and event already exists
  const existingTicket = await db
    .select()
    .from(Tickets)
    .where(and(eq(Tickets.user_id, userId), eq(Tickets.event_id, eventId)))
    .execute();

  let result;
  if (existingTicket.length > 0) {
    // Update existing ticket

    const updatedTicket = {
      amount: Number(existingTicket[0]?.amount) + Number(amount),
      updated_at: new Date(),
    };
    result = await db
      .update(Tickets)
      .set(updatedTicket)
      .where(and(eq(Tickets.user_id, userId), eq(Tickets.event_id, eventId)))
      .execute();
  } else {
    // Insert new ticket
    const newTicket = {
      event_id: eventId,
      user_id: userId,
      amount: amount,
      created_at: new Date(),
      updated_at: new Date(),
    };
    result = await db.insert(Tickets).values(newTicket).execute();
  }

  const event = await db.select().from(Events).where(eq(Events.id, eventId));

  await db
    .update(Events)
    .set({ tickets_sold: Number(event[0]?.tickets_sold) + Number(amount).toString() })
    .where(eq(Events.id, eventId));

  return NextResponse.json(result);
};
