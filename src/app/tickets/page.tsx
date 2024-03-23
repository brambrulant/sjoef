'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Ticket } from '../types/ticket.ts';
import { Event } from '../types/event.ts';
import { format } from 'date-fns';
import QRCode from 'qrcode.react';
import { Button } from '@components/ui/button.tsx';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@components/ui/dialog.tsx';

async function getTickets(): Promise<Ticket[]> {
  return await fetch('/api/tickets').then((res) => res.json());
}

async function getEvents(): Promise<Event[]> {
  return await fetch('/api/events').then((res) => res.json());
}

interface TicketComponentProps {
  tickets: Ticket[];
  event?: Event;
  poss: string[];
}

function TicketComponent({ tickets, event, poss }: TicketComponentProps) {
  const [bgSize, setBgSize] = React.useState('bg-pos-0');
  const [open, setOpen] = React.useState(false);
  const [qrValue, setQRValue] = React.useState('');

  const handleClicked = React.useCallback(() => {
    setBgSize(poss[Math.floor(Math.random() * poss.length)]);
    setOpen(!open);
  }, [open, poss]);

  if (!event) return null;

  return (
    <div
      key={event.id}
      className={`md:mx-24 mt-4 text-center p-8 rounded-2xl transition-all duration-1000 animate-gradient-x bg-gradient-to-r from-blue-900 via-pink-200 to-pink-600 bg-size-200 shadow-2xl ${bgSize}`}
    >
      <p>{event.name}</p>
      <p>{event.date ? format(new Date(event.date), 'dd/MM/yyyy') : 'N/A'}</p>{' '}
      <p>qt: {tickets.length}</p>
      <Button className="mt-4" onClick={handleClicked}>
        show tickets
      </Button>
      {open && (
        <div className="flex flex-col justify-between items-center">
          {tickets.map((ticket, i) => (
            <Dialog key={i}>
              <DialogTrigger className="flex my-2 flex-row justify-center align-middle cursor-pointer border-2 border-black w-1/2 p-4 rounded-xl hover:bg-opacity-50 hover:bg-slate-950 transition-colors">
                <div
                  className="flex flex-row items-center"
                  onClick={() =>
                    setQRValue(
                      JSON.stringify({
                        ticket_id: ticket.id,
                        user_id: ticket.user_id,
                        event_id: ticket.event_id,
                      })
                    )
                  }
                >
                  <QRCode
                    value={JSON.stringify({
                      ticket_id: ticket.id,
                      user_id: ticket.user_id,
                      event_id: ticket.event_id,
                    })}
                  />
                  <p className="ml-4 font-mono">ticket id: {ticket.id}</p>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>ticket id: {ticket.id}</DialogHeader>
                <QRCode
                  size={600}
                  value={JSON.stringify({
                    ticket_id: ticket.id,
                    user_id: ticket.user_id,
                    event_id: ticket.event_id,
                  })}
                />
              </DialogContent>
            </Dialog>
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

  const { data: events, isLoading: isEventsLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => getEvents(),
  });

  const poss = ['bg-pos-0', 'bg-pos-20', 'bg-pos-40', 'bg-pos-60', 'bg-pos-80', 'bg-pos-100'];

  const eventsWithTickets = React.useMemo(
    () => events?.filter((event) => tickets?.some((ticket) => ticket.event_id === event.id)),
    [events, tickets]
  );

  if (!tickets)
    return (
      <div className="flex w-screen justify-center align-middle">
        <div className="mt-16 font-mono text-slate-200">{"you don't have any tickets yet.."}</div>
      </div>
    );

  return (
    <div className="w-full flex flex-col justify-between">
      {eventsWithTickets?.map((event) => (
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
