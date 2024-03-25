import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import Email from '@components/Email.tsx';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import { Events } from '@db/tables.ts';
import { eq } from 'drizzle-orm';

const getEvent = async (eventId: string) => {
  const db = drizzle(sql);
  return db
    .select()
    .from(Events)
    .where(eq(Events.id, parseInt(eventId)));
};

export const emailTicketsToUser = async (
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

  const emailHtml = render(Email({ tickets, url: 'https://wwww.sjoef.app' }));

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
