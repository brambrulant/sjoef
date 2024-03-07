import { Events } from '../../../../db/tables.ts';
import { NextRequest, NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';

export const GET = async (req: NextRequest) => {
  const db = drizzle(sql);
  const events = await db.select().from(Events);
  return NextResponse.json(events);
};
