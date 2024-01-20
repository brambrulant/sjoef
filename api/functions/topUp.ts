import { ConsumptionPoints, Users } from '../tables';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { eq } from 'drizzle-orm';
import { sql } from '@vercel/postgres';
import { KindeUser } from '@kinde-oss/kinde-auth-react/dist/types/state/types';

const db = drizzle(sql);

export interface ITopUp {
  user: KindeUser;
  points: number;
}

export const topUp = async ({ user, points }: ITopUp) => {
  // check if user exists in postgres db
  const userRecords = await db.select().from(Users).where(eq(Users.id, user.id));

  // If the user does not exist, create a new user
  if (userRecords.length === 0) {
    console.log('creating new user');
    await db.insert(Users).values({
      id: user.id,
      name: `${user.given_name} ${user.family_name}`,
      email: user.email,
      created_at: new Date(),
      updated_at: new Date(),
    });
  }

  const currentRecords = await db
    .select()
    .from(ConsumptionPoints)
    .where(eq(ConsumptionPoints.user_id, user.id));

  let currentRecord = currentRecords[0] || null;

  if (!currentRecord) {
    console.log(`no current record for userid: ${user.id} , creating one`);
    await db.insert(ConsumptionPoints).values({
      user_id: user.id,
      total_points: points,
      used_points: 0,
    });
  }

  const newTotalPoints = currentRecord.total_points + points;

  // Update the record with the new total points
  return db
    .update(ConsumptionPoints)
    .set({
      total_points: newTotalPoints,
    })
    .where(eq(ConsumptionPoints.user_id, user.id));
};
