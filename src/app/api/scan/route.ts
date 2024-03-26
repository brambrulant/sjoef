import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import { Tickets } from '@db/tables.ts';
import { eq } from 'drizzle-orm';
import { JWTPayload } from '../stripe/events/route.ts';

export const POST = async (req: NextRequest) => {
  const db = drizzle(sql);
  const body = await req.json();

  const decoded = jwt.verify(body.qrData.text, process.env.JWT_SECRET!) as JWTPayload;

  console.log('decoded', decoded);

  if (decoded) {
    const ticket = await db.select().from(Tickets).where(eq(Tickets.id, decoded.ticket_id));

    if (!ticket[0].is_used) {
      return NextResponse.json(
        {
          message: 'Ticket is already used',
        },
        {
          status: 409,
        }
      );
    }

    const updateTicket = await db
      .update(Tickets)
      .set({ is_used: true })
      .where(eq(Tickets.id, decoded.ticket_id))
      .returning();

    return NextResponse.json(
      {
        updateTicket,
      },
      {
        status: 200,
      }
    );
  }
  return NextResponse.json(
    {
      message: 'Invalid ticket',
    },
    {
      status: 400,
    }
  );
};
