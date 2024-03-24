import { NextRequest, NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import { Tickets } from '@db/tables.ts';
import { eq } from 'drizzle-orm';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export const GET = async (req: NextRequest) => {
  const { getUser, getOrganization } = getKindeServerSession();
  const db = drizzle(sql);

  const user = await getUser();

  if (!user?.id) {
    console.log('No user found');
    return NextResponse.json({
      message: 'No user found',
    });
  }

  const result = await db.select().from(Tickets).where(eq(Tickets.user_id, user?.id));

  return NextResponse.json(result);
};
