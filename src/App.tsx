import React from 'react';
import { Suspense } from 'react';
import { MantineProvider } from '@mantine/core';
import { KindeProvider } from '@kinde-oss/kinde-auth-react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Router } from './Router';
import { theme } from './theme';
import CustomLoader from '@/components/Loader';

const stripePromise = loadStripe(
  'pk_live_51OUrwzBcHpJ0QGERGE5ZWrbSO1hbsCvTJlRob82HGKOHvLY0S8V9ykkodoqeZgVUWBmmyjcEpZQxwpuRJv8K2muf00mJu4ZorR'
);

const queryClient = new QueryClient();

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <Elements stripe={stripePromise}>
        <Suspense fallback={<CustomLoader />}>
          <KindeProvider
            clientId="a6b9fb378282420bbfc9b59cd3abc1aa"
            domain="https://sjoef.kinde.com"
            redirectUri="http://localhost:3000/home"
            logoutUri="http://localhost:3000/login"
          >
            <QueryClientProvider client={queryClient}>
              <Router />
            </QueryClientProvider>
          </KindeProvider>
        </Suspense>
      </Elements>
    </MantineProvider>
  );
}
