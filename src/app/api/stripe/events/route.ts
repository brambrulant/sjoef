import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { Events, Tickets, Users } from '@db/tables.ts';
import { eq } from 'drizzle-orm';
import { emailTicketsToUser } from '@functions/sendEmail.tsx';
import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';

const getUserName = async (userId: string) => {
  const db = drizzle(sql);
  const user = await db.select().from(Users).where(eq(Users.id, userId));
  return user[0]?.name;
};

const createTickets = async (eventId: number, amount: number, userId: string, email: string) => {
  const db = drizzle(sql);
  const secret = process.env.JWT_SECRET as unknown as jwt.Secret;

  const tickets = Array.from({ length: amount }, () => {
    const payload = {
      event_id: eventId,
      user_id: userId,
    };

    const token = jwt.sign(payload, secret);

    return {
      event_id: eventId,
      user_id: userId,
      jwt: token,
      created_at: new Date(),
      updated_at: new Date(),
    };
  });

  await db.insert(Tickets).values(tickets).execute();

  const event = await db.select().from(Events).where(eq(Events.id, eventId));

  // update the tickets_sold count
  await db
    .update(Events)
    .set({ tickets_sold: event[0]?.tickets_sold ? event[0]?.tickets_sold + amount : amount })
    .where(eq(Events.id, eventId));

  console.log('updated event');

  const userName = await getUserName(userId);

  await emailTicketsToUser(tickets, userName!, email!);
};

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  let eventId;
  let amount;
  let email;
  let userId;

  switch (body.type) {
    case 'checkout.session.completed':
      console.log('metadata', body.data.object.metadata);
      eventId = parseInt(body.data.object.metadata.eventId);
      amount = parseInt(body.data.object.metadata.amount);
      email = body.data.object.metadata.email;
      userId = body.data.object.metadata.userId;

      console.log('event from stripe, checkout.session.completed', eventId, amount);
      await createTickets(eventId, amount, userId, email);
      break;
    default:
      console.log('event from stripe, unimportant');
  }

  return NextResponse.json('hello stripe');
};
