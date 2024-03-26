import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { eq } from 'drizzle-orm';
import { sql } from '@vercel/postgres';
import { Tickets, Events } from '@db/tables.ts';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { emailTicketsToUser } from '@functions/sendEmail.tsx';

export const POST = async (req: NextRequest) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const db = drizzle(sql);

  console.log('req', req);

  const body = await req.json();

  const eventId = body.eventId;
  const amount = parseInt(body.amount);

  if (!user?.id || !eventId || !amount) {
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

  const secret = process.env.JWT_SECRET as unknown as jwt.Secret;

  const tickets = Array.from({ length: amount }, () => {
    const payload = {
      event_id: eventId,
      user_id: user?.id,
    };

    const token = jwt.sign(payload, secret);

    return {
      event_id: eventId,
      user_id: user?.id,
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

  await emailTicketsToUser(tickets, user?.email);

  return NextResponse.json({
    tickets,
  });
};
