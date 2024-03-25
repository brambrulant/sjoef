import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { eq } from 'drizzle-orm';
import { sql } from '@vercel/postgres';
import { Tickets, Events } from '@db/tables.ts';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { emailTicketsToUser } from '@functions/sendEmail.ts';

export const POST = async (req: NextRequest) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const db = drizzle(sql);
  const body = await req.json();

  const userId = body.userId;
  const eventId = body.eventId;
  const amount = parseInt(body.amount);

  if (!userId || !eventId || !amount) {
    console.log('Missing userId, eventId or amount');
    return NextResponse.json(
      {
        error: 'Missing userId, eventId or amount',
      },
      {
        status: 400,
      }
    );
  }

  console.log('creating tickets..');

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

  const result = await db.insert(Tickets).values(tickets).execute();

  console.log('successfully created tickets..', result);

  console.log('updating event..');

  const event = await db.select().from(Events).where(eq(Events.id, eventId));

  // update the tickets_sold count
  await db
    .update(Events)
    .set({ tickets_sold: event[0]?.tickets_sold ? event[0]?.tickets_sold + amount : amount })
    .where(eq(Events.id, eventId));

  // send email to user
  // await emailTicketsToUser(tickets, user?.email);

  return NextResponse.json(result);
};
