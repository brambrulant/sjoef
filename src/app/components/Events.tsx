'use client';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { formatDate, isAfter, isBefore } from 'date-fns';
import { useSearchParams, useRouter } from 'next/navigation';

import { Event } from '../types/event';
import { Ticket } from '../types/ticket';

import { Skeleton } from '@components/ui/skeleton.tsx';
import { Drawer, DrawerDescription, DrawerHeader, DrawerTrigger } from '@components/ui/drawer.tsx';
import { DrawerContent } from '@components/ui/drawer-vertical.tsx';
import EventTicketCheckoutForm from '@components/CheckoutForm/EventTicketCheckoutForm.tsx';
import { Button } from '@components/ui/button.tsx';
import { ScrollArea } from '@components/ui/scroll-area.tsx';
import { ExternalLinkIcon, InstagramLogoIcon } from '@radix-ui/react-icons';

async function getEvents(): Promise<Event[]> {
  return await fetch('/api/events').then((res) => res.json());
}

async function getEventById(id: string): Promise<Event> {
  return await fetch(`/api/event/${id}`).then((res) => res.json());
}

async function getTicketsByEventId(id: string): Promise<Ticket[]> {
  return await fetch(`/api/tickets/${id}`).then((res) => res.json());
}

export default function Events() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get('id');
  const router = useRouter();

  const { data: events, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: () => getEvents(),
    staleTime: 5 * 1000,
  });

  const { data: currentEvent, isLoading: isEventLoading } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => getEventById(eventId!),
    enabled: !!eventId, // Only run this query if eventId is not null or undefined
  });

  const { data: tickets, isLoading: isTicketsLoading } = useQuery({
    queryKey: ['tickets'],
    queryFn: () => getTicketsByEventId(eventId!),
    enabled: !!eventId,
  });

  let upcomingEvents: Event[] = [];
  let pastEvents: Event[] = [];
  if (events) {
    const currentDate = new Date().setHours(0, 0, 0, 0);

    // first sort them, newest first
    upcomingEvents = events.filter((event) => isAfter(event?.date!, currentDate));
    pastEvents = events.filter((event) => isBefore(event?.date!, currentDate));
  }

  upcomingEvents.sort((a, b) => (isAfter(a?.date!, b.date!) ? 1 : -1));
  pastEvents.sort((a, b) => (isAfter(a?.date!, b.date!) ? -1 : 1));

  const handleEventClick = (id: number) => {
    // Update the URL without navigating away from the page
    router.push(`/events?id=${id}`, undefined);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.push('/events', undefined);
    }
    return;
  };

  return (
    <div className="p-4 w-screen mt-12">
      <p className="text-slate-400 font-abc text-2xl md:text-9xl ml-[-12px]">UPCOMING</p>
      <div className="w-full">
        {isLoading ? (
          <SkeletonUI />
        ) : (
          <Drawer
            onOpenChange={(open) => handleOpenChange(open)}
            direction="right"
            shouldScaleBackground
            open={eventId !== null}
          >
            {upcomingEvents?.map((event: Event) => (
              <DrawerTrigger
                key={event.id}
                className="flex flex-col items-baseline cursor-pointer w-full border-white border-b-2 h-24 bg-slate-950 hover:bg-slate-800 transition-colors"
                onClick={() => handleEventClick(event.id)}
              >
                <div key={event.id} className="flex flex-col items-baseline">
                  <div className="text-slate-400 font-abc font-light mt-2">{event.name}</div>
                  <div className="text-pink-600 font-abc">
                    {formatDate(event?.date!, 'eeee dd-MM-yyyy')}
                  </div>
                </div>
              </DrawerTrigger>
            ))}
            <DrawerContent className="bg-slate-800/40 flex flex-row w2/3 md:w-1/2">
              <ScrollArea>
                {isEventLoading ? (
                  <SkeletonDrawerUI />
                ) : (
                  <EventDetails event={currentEvent} tickets={tickets} />
                )}
              </ScrollArea>
            </DrawerContent>
          </Drawer>
        )}
      </div>
      <p className="text-slate-400 font-abc text-2xl md:text-9xl ml-[-12px] mt-56">PAST</p>
      <div className="w-full">
        <div>
          {pastEvents?.map((event: Event) => (
            <div
              key={event.id}
              className="flex flex-col items-baseline cursor-pointer w-full border-white border-b-2 h-24 bg-slate-950 hover:bg-slate-800 transition-colors"
              onClick={() => handleEventClick(event.id)}
            >
              <div className="text-slate-400 font-abc font-light mt-2">{event.name}</div>
              <div className="text-pink-600 font-abc">
                {formatDate(event?.date!, 'eeee dd-MM-yyyy')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EventDetails({ event, tickets }: { event?: Event; tickets?: Ticket[] }) {
  const router = useRouter();
  if (!event) return <div>no event </div>;

  const handleRedirectToTickets = () => {
    router.push('/tickets', undefined);
  };

  const currentDate = new Date();

  const getButton = (event: Event) => {
    if (event.is_sold_out) {
      return (
        <Button disabled variant="secondary" className="mt-4">
          Sold out
        </Button>
      );
    }
    if (event.price === '0.00') {
      return (
        <Button disabled variant="secondary" className="mt-4">
          Free event
        </Button>
      );
    }
    if (event.external_ticketing) {
      return (
        <Button
          onClick={() => window.open(event?.external_link!, '_blank')}
          variant="secondary"
          className="mt-4"
        >
          Buy tickets (external)
        </Button>
      );
    }
    return 'Tickets not available';
  };

  return (
    <div className="flex flex-col items-baseline p-8">
      <DrawerHeader className="text-slate-400 font-abc font-bold text-2xl my-2 mx-0 p-0">
        {event.name}
      </DrawerHeader>
      <DrawerHeader className="text-pink-600 font-abc mx-0 p-0 mb-8">
        {formatDate(event?.date!, 'eeee dd-MM-yyyy')}
      </DrawerHeader>
      <DrawerDescription className="text-slate-400 font-abc font-light my-2">
        {event.genre}
      </DrawerDescription>
      <DrawerDescription className="text-pink-600 font-abc">
        Organized by {event.organizer}
      </DrawerDescription>
      <DrawerDescription className="text-slate-400 font-abc font-light my-2">
        Price: {event.price === '0.00' ? 'Free' : event.price}
      </DrawerDescription>
      <DrawerDescription className="text-pink-600 font-abc">
        {event.external_link ? (
          <a href={event.external_link} target="_blank" rel="noreferrer" className="underline">
            <ExternalLinkIcon />
          </a>
        ) : (
          <a
            href="https://www.instagram.com/shouf.shouf/"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            <InstagramLogoIcon fontSize={48} />
          </a>
        )}
      </DrawerDescription>
      <DrawerDescription className="text-slate-400 font-abc font-light my-2">
        {event.description}
      </DrawerDescription>
      {event.line_up && (
        <DrawerDescription className="text-pink-600 font-abc">
          Artists: {event.line_up}
        </DrawerDescription>
      )}
      <DrawerDescription className="text-pink-600 font-abc mt-12">
        <div className="font-bold text-slate-400">From</div> {event.open}
        <div className="font-bold text-slate-400">until</div> {event.close}
      </DrawerDescription>
      {!event.is_sold_out &&
      isAfter(event?.date!, currentDate) &&
      event.price !== '0.00' &&
      !event.external_ticketing ? (
        <DrawerDescription className="text-slate-400 font-abc font-light my-2 max-w-2/3">
          <EventTicketCheckoutForm event={event} />
        </DrawerDescription>
      ) : (
        getButton(event)
      )}
      {tickets?.length ? (
        <DrawerDescription className="text-pink-600 font-abc">
          <Button onClick={handleRedirectToTickets} variant="secondary">
            View {tickets.length} ticket{tickets.length > 1 ? 's' : ''}
          </Button>
        </DrawerDescription>
      ) : null}
    </div>
  );
}

function SkeletonUI() {
  const maxItems = Array(10).fill(0);
  return (
    <>
      {maxItems.map((_, index) => (
        <Skeleton
          key={index}
          className="flex flex-col items-baseline cursor-pointer w-full border-slate-500 border-b-2 h-24 bg-transparent"
        >
          <Skeleton className="text-transparent font-abc font-light my-2 bg-slate-400">
            Event name
          </Skeleton>
          <Skeleton className="bg-pink-600 text-transparent font-abc">Monday 24-12-2024</Skeleton>
        </Skeleton>
      ))}
    </>
  );
}

function SkeletonDrawerUI() {
  return (
    <div className="flex flex-col items-baseline w-full p-8">
      <Skeleton className="bg-slate-400 mb-8 ">
        <DrawerHeader className="font-abc font-bold text-2xl mx-0 p-0 text-transparent">
          Event name
        </DrawerHeader>
      </Skeleton>
      <Skeleton className="text-transparent bg-pink-600 mb-8">
        <DrawerHeader className="font-abc mx-0 p-0 text-transparent">
          {formatDate(new Date(), 'eeee dd-MM-yyyy')}
        </DrawerHeader>
      </Skeleton>
      <Skeleton className="text-transparent bg-slate-400 mb-4">
        <DrawerDescription className="text-slate-400 font-abc font-light my-2">
          Genre: Genre
        </DrawerDescription>
      </Skeleton>
      <Skeleton className="text-transparent bg-pink-600 mb-4">
        <DrawerDescription className="text-pink-600 font-abc">Organizer: Sjoef</DrawerDescription>
      </Skeleton>
      <Skeleton className="text-transparent bg-slate-400 mb-4">
        <DrawerDescription className="text-slate-400 font-abc font-light my-2">
          Genre: Genre
        </DrawerDescription>
      </Skeleton>
      <Skeleton className="text-transparent bg-pink-600 mb-4">
        <DrawerDescription className="text-pink-600 font-abc">Organizer: Sjoef</DrawerDescription>
      </Skeleton>
      <Skeleton className="text-transparent bg-slate-400 mb-4">
        <DrawerDescription className="text-slate-400 font-abc font-light my-2">
          Genre: Genre
        </DrawerDescription>
      </Skeleton>
      <Skeleton className="text-transparent bg-pink-600 mb-4">
        <DrawerDescription className="text-pink-600 font-abc">Organizer: Sjoef</DrawerDescription>
      </Skeleton>
    </div>
  );
}
