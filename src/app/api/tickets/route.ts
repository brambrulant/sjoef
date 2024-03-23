import { NextRequest, NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import { Tickets } from '@db/tables.ts';
import { eq } from 'drizzle-orm';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export const GET = async (req: NextRequest) => {
  const db = drizzle(sql);

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return NextResponse.json({
      message: 'No user found',
    });
  }

  const result = await db.select().from(Tickets).where(eq(Tickets.user_id, user?.id));

  console.log('resultjes', result);
  return NextResponse.json(result);
};
