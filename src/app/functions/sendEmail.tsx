import * as React from 'react';
import nodemailer from 'nodemailer';
import { render } from 'jsx-email';

import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import { eq } from 'drizzle-orm';

import { Events } from '@db/tables.ts';
import TicketEmail from '@components/Email.tsx';

const getEvent = async (eventId: number) => {
  const db = drizzle(sql);
  return db.select().from(Events).where(eq(Events.id, eventId));
};

export const emailTicketsToUser = async (tickets: any, userName: string, email?: string | null) => {
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

  console.log('Sending email to: ', email, 'with event', event[0]);

  const mailOptions = {
    from: 'sjoefbar@gmail.com',
    to: email,
    subject: `Your tickets for ${event[0]?.name}`,
    html: await render(<TicketEmail userFirstname={userName} tickets={tickets} event={event[0]} />),
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email: ', error);
    } else {
      console.log('Email sent: ', info.response);
    }
  });
};
