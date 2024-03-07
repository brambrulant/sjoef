'use client';
import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { CheckoutButton } from '@components/CheckoutForm/CheckoutButton.tsx';
import Loader from '@components/Loader';
import { Button } from '@components/ui/button.tsx';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';

const stripePromise = loadStripe(
  'pk_test_51OUrwzBcHpJ0QGERUMPXD5qP4omXXac8P8htuQh49ktVdUuT0SPJYpxyCSrtPffIDMU5HoiqKQleGctUZHGfpZ7V00lPGr6SZx',
  {
    stripeAccount: 'sjoef',
  }
);

export interface ConsumptionPointsCheckoutFormProps {
  setBgSize: (color: string) => void;
}

export const ConsumptionPointsCheckoutForm: React.FC<ConsumptionPointsCheckoutFormProps> = ({
  setBgSize,
}) => {
  const [clientSecret, setClientSecret] = useState('');
  const [counter, setCounter] = useState(5);
  const [buyTickets, setBuyTickets] = useState(false);
  const { user } = useKindeBrowserClient();

  const handleBuyTickets = React.useCallback(() => {
    fetch('/api/payment/points', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items: [{ amount: counter }], user: user }),
    })
      .then((response) => response.json())
      .then((data) => {
        window.location.assign(data.paymentIntent.url);
      })
      .catch((error) => console.error('Error:', error));
  }, [counter, user]);

  React.useEffect(() => {
    const poss = ['bg-pos-0', 'bg-pos-20', 'bg-pos-40', 'bg-pos-60', 'bg-pos-80', 'bg-pos-100'];
    setBgSize(poss[Math.floor(Math.random() * poss.length)]);
  }, [counter, setBgSize]);

  return (
    <div className="flex flex-row justify-center">
      <Button
        onClick={() => setCounter(counter < 1 ? counter : counter - 1)}
        className="my-4 bg-white opacity-50 hover:opacity-80 border-black border-1"
      >
        <p className="text-black font-abc">-</p>
      </Button>
      <Button onClick={handleBuyTickets} className="m-4 bg-slate-950 opacity-60">
        <p className="text-slate-50 opacity-100">Buy {counter} Points</p>
      </Button>
      <Button
        onClick={() => setCounter(counter + 1)}
        className="my-4 bg-slate-100 opacity-50 hover:opacity-80 border-black border-1"
      >
        <p className="text-black font-abc">+</p>
      </Button>
    </div>
  );
};

export default ConsumptionPointsCheckoutForm;
