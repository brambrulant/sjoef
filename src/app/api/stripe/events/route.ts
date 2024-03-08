import { NextRequest, NextResponse } from 'next/server';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const makeTicketCallToDatabase = async (userId: string, eventId: string, amount: string) => {
  await fetch('https://sjoef.vercel.app/api/ticket', {
    method: 'POST',
    body: JSON.stringify({ userId: userId, eventId: eventId, amount: amount }),
  });
};

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  let sessionId;
  let eventId;
  let userId;
  let amount;

  switch (body.type) {
    case 'checkout.session.completed':
      if (body.data.object.id.startsWith('cs')) sessionId = body.data.object.id;

      eventId = body.data.object.metadata.eventId;
      userId = body.data.object.metadata.userId;
      amount = body.data.object.metadata.amount;
      await makeTicketCallToDatabase(userId, eventId, amount);
      break;
    default:
      console.log('event from stripe, unimportant');
  }

  // const result = await db.insert(Events).values(event);
  return NextResponse.json('hoi');
};
