'use client';
import React, { useState } from 'react';
import { Event } from '../../types/event.ts';

import { Button } from '@components/ui/button.tsx';
import { LoginLink, useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';

export interface EventTicketCheckoutFormProps {
  event: Event;
}

export const EventTicketCheckoutForm: React.FC<EventTicketCheckoutFormProps> = ({ event }) => {
  const [counter, setCounter] = useState(1);
  const [loading, setLoading] = useState(false);

  const { user } = useKindeBrowserClient();

  const handleBuyTickets = React.useCallback(() => {
    setLoading(true);
    fetch(`/api/payment/event`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: event,
        amount: counter,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        window.location.assign(data.paymentIntent.url);
      })
      .catch((error) => console.error('Error:', error));
  }, [event, counter]);

  if (!user) {
    return (
      <Button variant="secondary">
        <LoginLink>Log in to buy tickets</LoginLink>
      </Button>
    );
  }

  return (
    <div className="flex flex-row justify-center">
      <Button
        onClick={() => setCounter(counter < 1 ? counter : counter - 1)}
        className="my-4 bg-slate-400 hover:bg-slate-300 border-black border-1"
      >
        <p className="text-slate-900">-</p>
      </Button>
      <Button
        onClick={handleBuyTickets}
        isLoading={loading}
        className="flex my-4 bg-slate-200 hover:bg-slate-300 border-black border-1 mx-4"
      >
        <div className="flex flex-row text-slate-900">
          {' '}
          Buy <div className="text-pink-600 mx-2"> {counter} </div>{' '}
          {`Ticket${counter > 1 ? 's' : ''}`}
        </div>
      </Button>
      <Button
        onClick={() => setCounter(counter + 1)}
        className="my-4 bg-slate-400 hover:bg-slate-300 border-black border-1"
      >
        <p className="text-slate-900">+</p>
      </Button>
    </div>
  );
};

export default EventTicketCheckoutForm;
