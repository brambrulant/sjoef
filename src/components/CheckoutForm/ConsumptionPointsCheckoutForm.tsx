import React, { useState, useEffect } from 'react';
import { Elements, PaymentRequestButtonElement, useStripe } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { CheckoutButton } from '@/components/CheckoutForm/CheckoutButton';
import useToken from '@/functions/useToken';
import Loader from '@/components/Loader';
import { Button, Text, Title } from '@mantine/core';

const stripePromise = loadStripe(
  'pk_test_51OUrwzBcHpJ0QGERUMPXD5qP4omXXac8P8htuQh49ktVdUuT0SPJYpxyCSrtPffIDMU5HoiqKQleGctUZHGfpZ7V00lPGr6SZx'
);

export const ConsumptionPointsCheckoutForm = () => {
  const [clientSecret, setClientSecret] = useState('');
  const [counter, setCounter] = useState(5);
  const [buyTickets, setBuyTickets] = useState(false);
  const { token, isLoading: isAuthLoading, user } = useToken();

  useEffect(() => {
    if (!token || !user) return;
    fetch('/api/create-consumption-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ items: [{ amount: counter }], user: user }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [token]);

  const options: StripeElementsOptions = {
    appearance: {
      theme: 'night',
    },
    clientSecret: clientSecret,
  };

  const handleBuyTickets = React.useCallback(() => {
    setBuyTickets(true);
  }, []);

  return clientSecret ? (
    <Elements options={options} stripe={stripePromise}>
      {!buyTickets && (
        <div className="flex flex-row justify-center">
          <Button
            onClick={() => setCounter(counter < 1 ? counter : counter - 1)}
            className="my-4 bg-white opacity-50 hover:opacity-80 border-black border-1"
          >
            <Text className="text-black">-</Text>
          </Button>
          <Button onClick={handleBuyTickets} color="black" className="m-4">
            Buy {counter} Points
          </Button>
          <Button
            onClick={() => setCounter(counter + 1)}
            className="my-4 bg-slate-100 opacity-50 hover:opacity-80 border-black border-1"
          >
            <Text className="text-black">+</Text>
          </Button>
        </div>
      )}
      {buyTickets && (
        <div>
          <Title className="mb-4">
            You're going to buy {counter} sjoef punten for €{counter * 2.0}
          </Title>
          <CheckoutButton />
        </div>
      )}
    </Elements>
  ) : (
    <Loader />
  );
};

export default ConsumptionPointsCheckoutForm;
