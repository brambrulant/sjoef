'use client';

import React from 'react';
import { useQueries, useQuery } from '@tanstack/react-query';
import { Ticket } from '../types/ticket.ts';
import { Event } from '../types/event.ts';
import { format } from 'date-fns';
import QRCode from 'qrcode.react';

async function getTickets(): Promise<Ticket[]> {
  return await fetch('/api/tickets').then((res) => res.json());
}

async function getEvents(): Promise<Event[]> {
  return await fetch('/api/events').then((res) => res.json());
}

async function getEventById(id: number): Promise<Event> {
  return await fetch(`/api/event/${id}`).then((res) => res.json());
}

interface TicketComponentProps {
  tickets: Ticket[];
  event?: Event;
  poss: string[];
}

function TicketComponent({ tickets, event, poss }: TicketComponentProps) {
  const [bgSize, setBgSize] = React.useState('bg-pos-0');
  // group the tickets by event

  const [open, setOpen] = React.useState(false);

  const handleClicked = React.useCallback(() => {
    setBgSize(poss[Math.floor(Math.random() * poss.length)]);
    setOpen(!open);
  }, [open, poss]);

  const handleQRClick = React.useCallback((e: any) => {
    e.stopPropagation();
  }, []);

  if (!event) return null;

  return (
    <div
      key={event.id}
      className={`cursor-pointer md:mx-24 mt-4 text-center p-8 rounded-2xl transition-all duration-1000 animate-gradient-x bg-gradient-to-r from-blue-900 via-pink-200 to-pink-600 bg-size-200 shadow-2xl ${bgSize}`}
      onClick={handleClicked}
    >
      <p>{event.name}</p>
      <p>{event.date ? format(new Date(event.date), 'dd/MM/yyyy') : 'N/A'}</p>{' '}
      <p>qt: {tickets.length}</p>
      {open && (
        <div className="flex flex-col justify-between">
          {tickets.map((ticket, i) => (
            <div key={i} className="flex my-2" onClick={() => handleQRClick}>
              <QRCode
                value={JSON.stringify({
                  ticket_id: ticket.id,
                  user_id: ticket.user_id,
                  event_id: ticket.event_id,
                })}
              />
              <p>ticket id: {ticket.id}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Page() {
  const { data: tickets, isLoading: isTicketsLoading } = useQuery({
    queryKey: ['tickets'],
    queryFn: () => getTickets(),
  });

  const eventQueries = {
    queries:
      tickets?.map((ticket) => ({
        queryKey: ['event', ticket.event_id],
        queryFn: () => getEventById(ticket.event_id),
      })) || [],
  };

  const eventResults = useQueries(eventQueries);

  if (!tickets)
    return (
      <div className="flex w-screen justify-center align-middle">
        <div className="mt-16 font-mono text-slate-200">{"you don't have any tickets yet.."}</div>
      </div>
    );

  const poss = ['bg-pos-0', 'bg-pos-20', 'bg-pos-40', 'bg-pos-60', 'bg-pos-80', 'bg-pos-100'];

  const events = eventResults.map((event) => event.data);

  return (
    <div className="w-full flex flex-col justify-between">
      {events.map((event) => (
        <TicketComponent
          key={event?.id}
          tickets={tickets.filter((ticket) => ticket.event_id === event?.id)}
          event={event}
          poss={poss}
        />
      ))}
    </div>
  );
}
