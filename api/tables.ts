const pgTable = require('drizzle-orm/pg-core').pgTable;
const serial = require('drizzle-orm/pg-core').serial;
const text = require('drizzle-orm/pg-core').text;
const timestamp = require('drizzle-orm/pg-core').timestamp;
const integer = require('drizzle-orm/pg-core').integer;

export const Events = pgTable('events', {
  id: serial('id').primaryKey(),
  name: text('name'),
  date: timestamp('date'),
  created_at: timestamp('created_at'),
  updated_at: timestamp('updated_at'),
  genre: text('genre'),
  organizer: text('organizer'),
  price: text('price'),
  allocation: text('allocation'),
  tickets_sold: text('tickets_sold'),
  is_sold_out: text('is_sold_out'),
});

export const Users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
  email: text('email'),
  created_at: timestamp('created_at'),
  updated_at: timestamp('updated_at'),
});

export const Tickets = pgTable('tickets', {
  id: serial('id').primaryKey(),
  event_id: integer('event_id').references(() => Events.id),
  user_id: text('user_id'),
  created_at: timestamp('created_at'),
  updated_at: timestamp('updated_at'),
});
