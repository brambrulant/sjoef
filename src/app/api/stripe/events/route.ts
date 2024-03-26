import { NextRequest, NextResponse } from 'next/server';

const makeTicketCallToDatabase = async (
  eventId: string,
  amount: string,
  userId: string,
  email: string
) => {
  console.log('making ticket call to database');
  console.log('eventId', eventId);
  await fetch(`${process.env.BASE_URL}/api/ticket`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ eventId: eventId, amount: amount, userId: userId, email: email }),
  });
};

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  let eventId;
  let amount;
  let email;
  let userId;

  switch (body.type) {
    case 'checkout.session.completed':
      eventId = body.data.object.metadata.eventId;
      amount = body.data.object.metadata.amount;
      email = body.data.object.metadata.email;
      userId = body.data.object.metadata.userId;

      console.log('event from stripe, checkout.session.completed', eventId, amount);
      await makeTicketCallToDatabase(eventId, amount, userId, email);
      break;
    default:
      console.log('event from stripe, unimportant');
  }

  return NextResponse.json('hello stripe');
};
