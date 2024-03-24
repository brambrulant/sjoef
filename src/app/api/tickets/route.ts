import { NextApiResponse, NextApiRequest } from 'next';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import { Tickets } from '@db/tables.ts';
import { eq } from 'drizzle-orm';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { NextResponse } from 'next/server';

export const GET = async (req: NextApiRequest, res: NextApiResponse) => {
  const { getUser, getOrganization } = getKindeServerSession();
  const db = drizzle(sql);

  const user = await getUser();

  if (!user?.id) {
    console.log('No user found');
    return res.status(401).json({ error: 'No user found' });
  }

  const result = await db.select().from(Tickets).where(eq(Tickets.user_id, user?.id));

  return NextResponse.json(result);
};
