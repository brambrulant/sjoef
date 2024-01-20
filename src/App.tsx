import React, { useEffect, useState } from 'react';
import { Suspense } from 'react';
import { MantineProvider } from '@mantine/core';
import { KindeProvider } from '@kinde-oss/kinde-auth-react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Router } from './Router';
import { theme } from './theme';
import CustomLoader from '@/components/Loader';

const queryClient = new QueryClient();

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <Suspense fallback={<CustomLoader />}>
        <KindeProvider
          isDangerouslyUseLocalStorage
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
    </MantineProvider>
  );
}
