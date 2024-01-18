import React, { useState, useEffect } from 'react';
import { PaymentRequestButtonElement, useStripe } from '@stripe/react-stripe-js';

export const CheckoutForm = () => {
  const stripe = useStripe();
  const [paymentRequest, setPaymentRequest] = useState(null);
  console.log('stripe?', stripe);
  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: 'NL',
        currency: 'eur',
        total: {
          label: 'Drankkaart',
          amount: 16,
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      pr.canMakePayment().then((result) => {
        console.log('canMakePayment?', result);
        if (result) {
          // @ts-ignore
          setPaymentRequest(pr);
        }
      });
    }
  }, [stripe]);

  if (paymentRequest) {
    return <PaymentRequestButtonElement options={{ paymentRequest }} />;
  }

  // Use a traditional checkout form.
  return 'Insert your form or button component here.';
};

export default CheckoutForm;
