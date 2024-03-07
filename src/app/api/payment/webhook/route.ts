import { NextRequest, NextResponse } from 'next/server';
import { response } from 'express';

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const endpointSecret = 'whsec_949bef214c6254c6b1ca67a812c7ef49ad139cc487dc09821246b9c69578d495';

export const POST = async (req: NextRequest) => {
  const payload = await req.body;
  const sig = req.headers.get('stripe-signature');

  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err) {
    return response.status(400).send(`Webhook Error`);
  }

  if (stripeEvent.type === 'checkout.session.completed') {
    // Retrieve the session. If you require line items in the response, you may include them by expanding line_items.
    const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
      stripeEvent.data.object.id,
      {
        expand: ['line_items'],
      }
    );
    const lineItems = sessionWithLineItems.line_items;
    console.log(sessionWithLineItems);
  }

  response.status(200).end();
};
