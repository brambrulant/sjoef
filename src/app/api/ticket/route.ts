import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { eq } from 'drizzle-orm';
import { sql } from '@vercel/postgres';
import { Tickets, Events, Users } from '@db/tables.ts';
import { emailTicketsToUser } from '@functions/sendEmail.tsx';

const getUserName = async (userId: string) => {
  const db = drizzle(sql);
  const user = await db.select().from(Users).where(eq(Users.id, userId));
  return user[0]?.name;
};

export const POST = async (req: NextRequest) => {
  const db = drizzle(sql);

  try {
    // search params
    const searchParams = new URLSearchParams(req.url.split('?')[1]);

    console.log('searchParams', searchParams);
    const eventIdAsString = searchParams.get('eventId');
    const amountAsString = searchParams.get('amount');
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');

    const amount = parseInt(amountAsString!);
    const eventId = parseInt(eventIdAsString!);

    if (!userId || !eventId || !amount || !email) {
      console.log('Missing userId, eventId or amount, email');
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

    return NextResponse.json({
      tickets,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      {
        error: 'Error',
      },
      {
        status: 500,
      }
    );
  }
};
