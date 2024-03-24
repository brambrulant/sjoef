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
    metadata: {
      eventId: event.id,
      userId: user.id,
      amount: amount,
    },
    customer_email: user.email,
    allow_promotion_codes: true,
    mode: 'payment',
    success_url: `${process.env.BASE_URL}/tickets`,
    cancel_url: `${process.env.BASE_URL}/events?id=${event.id}`,
  });

  return NextResponse.json({
    paymentIntent,
  });
};
