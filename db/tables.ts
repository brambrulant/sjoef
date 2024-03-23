import { integer, pgTable, text, serial, timestamp, boolean } from 'drizzle-orm/pg-core';

export const Events = pgTable('events', {
  id: serial('id').primaryKey(),
  name: text('name'),
  date: timestamp('date'),
  open: text('open'),
  close: text('close'),
  created_at: timestamp('created_at'),
  updated_at: timestamp('updated_at'),
  genre: text('genre'),
  organizer: text('organizer'),
  price: text('price'),
  allocation: integer('allocation'),
  tickets_sold: integer('tickets_sold'),
  is_sold_out: text('is_sold_out'),
  line_up: text('line_up'),
  description: text('description'),
});

export const Tickets = pgTable('tickets', {
  id: serial('id').primaryKey(),
  event_id: integer('event_id').references(() => Events.id),
  user_id: text('user_id').references(() => Users.id),
  is_used: boolean('is_used'),
  created_at: timestamp('created_at'),
  updated_at: timestamp('updated_at'),
});

export const Users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email'),
  created_at: timestamp('created_at'),
  updated_at: timestamp('updated_at'),
});
export const ConsumptionPoints = pgTable('consumption_points', {
  id: serial('id').primaryKey(),
  user_id: text('user_id').references(() => Users.id),
  total_points: integer('total_points'),
  used_points: integer('used_points'),
});
