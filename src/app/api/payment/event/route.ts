import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export const POST = async (req: NextRequest) => {
  const request = await req.json();
  const event = request.event;
  const amount = request.amount;
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: 'User is not authenticated' }, { status: 401 });
  }

  const paymentIntent = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: event.name,
          },
          unit_amount: parseInt(event.price) * 100,
        },
        quantity: amount,
      },
    ],
    mode: 'payment',
    success_url: 'http://localhost:3000/events',
    cancel_url: 'http://localhost:3000/payment-failed',
  });

  return NextResponse.json({
    paymentIntent,
  });
};