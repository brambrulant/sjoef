import { Users } from '@db/tables';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';

export async function GET() {
  const db = drizzle(sql);

  // check if user exists
  const { getUser, getOrganization } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id)
    return NextResponse.json({ error: 'User is not authenticated' }, { status: 401 });

  const dbUser = await db.select().from(Users).where(eq(Users.id, user.id)).execute();

  if (dbUser.length === 0) {
    console.log('no user found, inserting user in db');
    await db
      .insert(Users)
      .values({
        id: user.id,
        name: user.given_name ?? '' + user.family_name,
        email: user.email,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .execute();
  }

  return NextResponse.redirect(process.env.BASE_URL || 'https://sjoef.vercel.app');
}
