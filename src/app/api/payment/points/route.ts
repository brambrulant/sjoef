import { NextRequest, NextResponse } from 'next/server';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export const POST = async (req: NextRequest) => {
  const request = await req.json();
  const items = request.items;
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  console.log('request', request);

  if (!user) {
    return NextResponse.json({ error: 'User is not authenticated' }, { status: 401 });
  }

  const paymentIntent = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'sjoef_points',
          },
          unit_amount: 200,
        },
        quantity: items[0].amount,
      },
    ],
    mode: 'payment',
    success_url: 'http://localhost:3000/points',
    cancel_url: 'http://localhost:3000/points',
  });

  return NextResponse.json({
    paymentIntent,
  });
};
