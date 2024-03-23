import { NextRequest, NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import { Tickets } from '@db/tables.ts';
import { eq } from 'drizzle-orm';

export const GET = async (req: NextRequest) => {
  const db = drizzle(sql);

  const body = await req.json();

  const userId = body?.user_id;

  if (!userId) {
    return NextResponse.json({
      message: 'No user found',
    });
  }

  const result = await db.select().from(Tickets).where(eq(Tickets.user_id, userId));

  return NextResponse.json(result);
};
