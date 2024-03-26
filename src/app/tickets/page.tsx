'use client';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Ticket } from '../types/ticket.ts';
import { Event } from '../types/event.ts';
import { format } from 'date-fns';
import QRCode from 'qrcode.react';
import { Button } from '@components/ui/button.tsx';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@components/ui/dialog.tsx';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import Loader from '@components/Loader';

import { PDFDownloadLink } from '@react-pdf/renderer';
import TicketPDF from '@components/PDF.tsx';
import QRCodeGenerator from '@components/QRCodeGenerator.tsx';

async function getTickets(): Promise<Ticket[] | null> {
  try {
    return await fetch('/api/tickets').then((res) => res.json());
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getEvents(): Promise<Event[] | null> {
  try {
    return await fetch('/api/events').then((res) => res.json());
  } catch (error) {
    console.error(error);
    return null;
  }
}

interface TicketComponentProps {
  tickets: Ticket[];
  event?: Event;
  poss: string[];
}

function TicketComponent({ tickets, event, poss }: TicketComponentProps) {
  const [bgSize, setBgSize] = React.useState('bg-pos-0');
  const [open, setOpen] = React.useState(true);
  const [qrCodes, setQrCodes] = React.useState<string[]>([]);

  const handleClicked = React.useCallback(() => {
    setBgSize(poss[Math.floor(Math.random() * poss.length)]);
    setOpen(!open);
  }, [open, poss]);

  React.useEffect(() => {
    const qrCodes = tickets.map((ticket) => {
      const element = document.getElementById(ticket.id) as HTMLCanvasElement;
      return element?.toDataURL();
    });
    setQrCodes(qrCodes);
  }, [tickets]);

  if (!event) return null;
  if (!tickets) return null;
  if (!qrCodes) return null;

  return (
    <div className="w-screen h-screen z-20 bg-slate-950">
      <div
        className={`md:mx-24 mt-4 text-center p-8 rounded-2xl transition-all duration-1000 animate-gradient-x bg-gradient-to-r from-blue-900 via-pink-200 to-pink-600 bg-size-200 shadow-2xl ${bgSize}`}
      >
        <p>{event.name}</p>
        <p>{event.date ? format(new Date(event.date), 'dd/MM/yyyy') : 'N/A'}</p>{' '}
        <p>qt: {tickets.length}</p>
        <div>
          <Button className="mt-4 mr-4" onClick={handleClicked}>
            {open ? 'Hide Tickets' : 'Show Tickets'}
          </Button>
          <Button className="mt-4">
            <PDFDownloadLink
              document={
                <TicketPDF
                  tickets={tickets}
                  event={event}
                  url="https://www.sjoef.app/tickets"
                  qrCodeStrings={qrCodes}
                />
              }
              fileName={`${event.id}-${tickets[0].id}-${Date.now()}.pdf`}
            >
              {({ blob, url, loading, error }) =>
                loading ? 'Loading document...' : 'Download tickets'
              }
            </PDFDownloadLink>
          </Button>
        </div>
        {open && (
          <div className="flex z-40 flex-col justify-between items-center">
            {tickets.map((ticket, i) => (
              <Dialog key={i}>
                <DialogTrigger className="flex my-2 flex-row justify-center align-middle cursor-pointer border-2 border-black p-4 rounded-xl hover:bg-opacity-50 hover:bg-slate-950 transition-colors">
                  <div className="flex flex-row items-center">
                    <QRCodeGenerator value={ticket.jwt} id={ticket.id} />
                    <p className="ml-4 font-mono">ticket id: {ticket.id}</p>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>ticket id: {ticket.id}</DialogHeader>
                  <QRCodeGenerator size={600} value={ticket.jwt} id={ticket.id} />
                </DialogContent>
              </Dialog>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  const { user, isLoading: isUserLoading } = useKindeBrowserClient();
  const { data: allTickets, isLoading: isAllTicketsLoading } = useQuery({
    queryKey: ['allTickets'],
    queryFn: () => getTickets(),
  });

  const { data: events, isLoading: isEventsLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => getEvents(),
    enabled: !isUserLoading,
  });

  const poss = ['bg-pos-0', 'bg-pos-20', 'bg-pos-40', 'bg-pos-60', 'bg-pos-80', 'bg-pos-100'];

  if (isEventsLoading || isAllTicketsLoading)
    return (
      <div className="w-screen h-screen flex justify-center items-baseline">
        <Loader className="text-pink-600 mt-24" size={48} />
      </div>
    );

  if (!allTickets)
    return (
      <div className="flex w-screen justify-center align-middle">
        <div className="mt-16 font-mono text-slate-200">{"you don't have any tickets yet.."}</div>
      </div>
    );

  return (
    <div className="w-full flex flex-col justify-between">
      {events?.map(
        (event) =>
          allTickets?.filter((ticket) => ticket.event_id === event?.id).length > 0 && (
            <TicketComponent
              key={event?.id}
              tickets={allTickets?.filter((ticket) => ticket.event_id === event?.id)}
              event={event}
              poss={poss}
            />
          )
      )}
    </div>
  );
}
