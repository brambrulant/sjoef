'use client';
import React, { useState } from 'react';
import { Event } from '../../types/event.ts';

import { Button } from '@components/ui/button.tsx';

export interface EventTicketCheckoutFormProps {
  event: Event;
}

export const EventTicketCheckoutForm: React.FC<EventTicketCheckoutFormProps> = ({ event }) => {
  const [counter, setCounter] = useState(1);

  const handleBuyTickets = React.useCallback(
    () =>
      fetch(`${process.env.BASE_URL}/api/payment/event`, {
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
          window.location.assign(data.paymentIntent.url);
        })
        .catch((error) => console.error('Error:', error)),
    [event, counter]
  );

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
        className="flex my-4 bg-slate-200 hover:bg-slate-300 border-black border-1 mx-4"
      >
        <p className="flex flex-row text-slate-900">
          {' '}
          Buy <p className="text-pink-600 mx-2"> {counter} </p> {`Ticket${counter > 1 ? 's' : ''}`}
        </p>
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
