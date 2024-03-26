import { NextRequest, NextResponse } from 'next/server';

const makeTicketCallToDatabase = async (
  eventId: string,
  amount: string,
  userId: string,
  email: string
) => {
  try {
    await fetch(
      `https://www.sjoef.app/api/ticket` +
        new URLSearchParams({
          eventId: eventId,
          amount: amount,
          userId: userId,
          email: email,
        }),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.log('error', error);
  }
};

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  let eventId;
  let amount;
  let email;
  let userId;

  switch (body.type) {
    case 'checkout.session.completed':
      console.log('metadata', body.data.object.metadata);
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
