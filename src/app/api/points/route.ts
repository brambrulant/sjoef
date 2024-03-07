import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import { ConsumptionPoints } from '../../../../db/tables.ts';
import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

const db = drizzle(sql);

export const GET = async (req: NextRequest) => {
  const userId = req.nextUrl.searchParams.get('userId');
  if (!userId) {
    return NextResponse.json({ error: 'User id is required' }, { status: 400 });
  }
  const events = await db
    .select()
    .from(ConsumptionPoints)
    .where(eq(ConsumptionPoints.user_id, userId));
  return NextResponse.json(events);
};
