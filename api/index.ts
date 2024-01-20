import express from 'express';
import { ConsumptionPoints, Events } from './tables';

import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import { eq } from 'drizzle-orm';
import { authenticateToken, authorizeAdmin } from './authenticationMiddleware';
import { buffer } from 'micro';
import { topUp } from './functions/topUp';
import { KindeUser } from '@kinde-oss/kinde-auth-react/dist/types/state/types';

const api = express();
const db = drizzle(sql);
const stripe = require('stripe')(process.env.VITE_STRIPE_SECRET_KEY_TEST);
const endpointSecret = 'whsec_949bef214c6254c6b1ca67a812c7ef49ad139cc487dc09821246b9c69578d495';

// middleware to authenticate all requests
api.use(authenticateToken);

// middleware to authenticate admin requests
const authorizeToken = authorizeAdmin;

api.get('/api/events', async (req, res) => {
  const events = await db.select().from(Events);
  res.json(events);
});

api.get('/api/events/:id', async (req, res) => {
  try {
    const event = await db
      .select()
      .from(Events)
      .where(eq(Events.id, parseInt(req.params.id)));
    res.json(event);
  } catch (error) {
    res.status(404).json({ message: 'Event not found' });
  }
});

api.post('/api/events', authorizeToken, async (req, res) => {
  const { date, created_at, updated_at, ...otherFields } = req.body;

  const event = await db.insert(Events).values({
    ...otherFields,
    date: new Date(date),
    created_at: new Date(),
    updated_at: new Date(),
  });

  res.json(event);
});

api.put('/api/events/:id', authorizeToken, async (req, res) => {
  const event = await db
    .update(Events)
    .set(req.body)
    .where(eq(Events.id, parseInt(req.params.id)));
  res.json(event);
});

api.get('/api/admin', authorizeToken, (req, res) => {
  res.json({ message: 'Welcome to the admin page!' });
});

api.post('/api/create-ticket-payment-intent', async (req, res) => {
  const { items } = req.body;
  const user = req.body.user as KindeUser;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: '1500',
    currency: 'eur',
    metadata: { user },
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

api.post('/api/top-up', async (req, res) => {
  const { user, points } = req.body;

  const result = await topUp({ user, points });

  res.json({ status: 200, message: result.toString() });
});

api.get('/api/consumption-points-user/:id', async (req, res) => {
  const records = await db
    .select()
    .from(ConsumptionPoints)
    .where(eq(ConsumptionPoints.user_id, req.params.id));

  res.json(records);
});

api.post('/api/create-consumption-payment-intent', async (req, res) => {
  const { items } = req.body;
  const user = req.body.user as KindeUser;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: items[0].amount * 200,
    currency: 'eur',
    metadata: {
      id: user.id,
      email: user.email,
      given_name: user.given_name,
      family_name: user.family_name,
      picture: user.picture,
    },
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

api.post('/api/webhook', async (req, res) => {
  const rawBody = await buffer(req);

  const sig = req.headers['stripe-signature'];
  let eventSecure;
  try {
    eventSecure = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err) {
    console.log(err);
    return;
  }

  // Handle the event
  switch (eventSecure.type) {
    case 'charge.succeeded':
      console.log('charge was successful!');
      await topUp({
        user: {
          id: eventSecure.data.object.metadata.id,
          email: eventSecure.data.object.metadata.email,
          given_name: eventSecure.data.object.metadata.given_name,
          family_name: eventSecure.data.object.metadata.family_name,
          picture: eventSecure.data.object.metadata.picture,
        },
        points: eventSecure.data.object.amount / 200,
      });
      break;
    default:
      console.log(`Unhandled event type ${eventSecure.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
});

export default api;
