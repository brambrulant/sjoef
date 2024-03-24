import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { and, eq } from 'drizzle-orm';
import { sql } from '@vercel/postgres';
import { Tickets, Users, Events } from '@db/tables.ts';
import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { Email } from '@components/Email.tsx';

const getEvent = async (eventId: string) => {
  const db = drizzle(sql);
  return await db
    .select()
    .from(Events)
    .where(eq(Events.id, parseInt(eventId)));
};

const emailTicketsToUser = async (
  tickets: { event_id: any; user_id: any; jwt: string; created_at: Date; updated_at: Date }[],
  email?: string | null
) => {
  const event = await getEvent(tickets[0].event_id);
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'sjoefbar@gmail.com',
      pass: 'oqeo hzqs bkdr kduq',
    },
  });
  if (!email) {
    console.error('No email provided');
    return;
  }

  const emailHtml = render(Email({ tickets, url: 'https://example.com' }));

  const mailOptions = {
    from: 'sjoefbar@gmail.com',
    to: email,
    subject: `Your tickets for ${event[0]?.name}`,
    html: emailHtml,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email: ', error);
    } else {
      console.log('Email sent: ', info.response);
    }
  });
};

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

  await emailTicketsToUser(tickets, user?.email);

  console.log('successfully created tickets..', result);

  console.log('updating event..');

  const event = await db.select().from(Events).where(eq(Events.id, eventId));

  await db
    .update(Events)
    .set({ tickets_sold: event[0]?.tickets_sold ? event[0]?.tickets_sold + amount : amount })
    .where(eq(Events.id, eventId));

  return NextResponse.json(result);
};
