import express from 'express';
import { Events } from './tables';

import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import { eq } from 'drizzle-orm';
import { authenticateToken, authorizeAdmin } from './authenticationMiddleware';

const app = express();
const db = drizzle(sql);

// middleware to authenticate all requests
app.use(authenticateToken);
// middleware to authenticate admin requests
const authorizeToken = authorizeAdmin;

app.get('/api/events', async (req, res) => {
  const events = await db.select().from(Events);
  res.json(events);
});

app.get('/api/events/:id', async (req, res) => {
  try {
    const event = await db
      .select()
      .from(Events)
      .where(eq(Events.id, parseInt(req.params.id)));
    res.json(event);
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: 'Event not found' });
  }
});

app.post('/api/events', authorizeToken, async (req, res) => {
  const { date, created_at, updated_at, ...otherFields } = req.body;

  const event = await db.insert(Events).values({
    ...otherFields,
    date: new Date(date),
    created_at: new Date(created_at),
    updated_at: new Date(updated_at),
  });

  res.json(event);
});

app.put('/api/events/:id', authorizeToken, async (req, res) => {
  const event = await db
    .update(Events)
    .set(req.body)
    .where(eq(Events.id, parseInt(req.params.id)));
  res.json(event);
});

app.get('/api/admin', authorizeToken, (req, res) => {
  res.json({ message: 'Welcome to the admin page!' });
});

export default app;
