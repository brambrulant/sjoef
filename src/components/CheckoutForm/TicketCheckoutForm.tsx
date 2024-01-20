import React, { useState, useEffect } from 'react';
import { Elements, PaymentRequestButtonElement, useStripe } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { CheckoutButton } from '@/components/CheckoutForm/CheckoutButton';
import useToken from '@/functions/useToken';
import Loader from '@/components/Loader';
import { Button } from '@mantine/core';

const stripePromise = loadStripe(
  'pk_test_51OUrwzBcHpJ0QGERUMPXD5qP4omXXac8P8htuQh49ktVdUuT0SPJYpxyCSrtPffIDMU5HoiqKQleGctUZHGfpZ7V00lPGr6SZx'
);
export interface TicketCheckoutFormProps {
  eventId: string;
}

export const TicketCheckoutForm: React.FC<TicketCheckoutFormProps> = ({ eventId }) => {
  const [clientSecret, setClientSecret] = useState('');
  const [buyTickets, setBuyTickets] = useState(false);
  const { token, isLoading: isAuthLoading, user } = useToken();

  useEffect(() => {
    if (!token || !user) return;
    // Create PaymentIntent as soon as the page loads
    fetch('/api/create-ticket-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'User-Id': user.id as string,
      },
      body: JSON.stringify({ items: [{ id: eventId }] }),
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

  return (
    clientSecret && (
      <Elements options={options} stripe={stripePromise}>
        <Button onClick={handleBuyTickets} className="my-4">
          Buy Tickets
        </Button>
        {buyTickets && <CheckoutButton />}
      </Elements>
    )
  );
};

export default TicketCheckoutForm;
