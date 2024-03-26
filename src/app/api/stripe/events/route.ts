import { NextRequest, NextResponse } from 'next/server';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const makeTicketCallToDatabase = async (eventId: string, amount: string) => {
  await fetch(`${process.env.BASE_URL}/api/ticket`, {
    method: 'POST',
    body: JSON.stringify({ eventId: eventId, amount: amount }),
  });
};

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  let eventId;
  let amount;

  switch (body.type) {
    case 'checkout.session.completed':
      eventId = body.data.object.metadata.eventId;
      amount = body.data.object.metadata.amount;
      console.log('event from stripe, checkout.session.completed', eventId, amount);
      await makeTicketCallToDatabase(eventId, amount);
      break;
    default:
      console.log('event from stripe, unimportant');
  }

  return NextResponse.json('hello stripe');
};
