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
  console.log('process.env.NODE_ENV', process.env.NODE_ENV);
  return (
    <MantineProvider theme={theme}>
      <Suspense fallback={<CustomLoader />}>
        <KindeProvider
          isDangerouslyUseLocalStorage
          clientId="a6b9fb378282420bbfc9b59cd3abc1aa"
          domain="https://sjoef.kinde.com"
          redirectUri={process.env.NODE_ENV === 'development' ? 'http://localhost:3000/home' : 'https://sjoef.vercel.app:3000/home'}
          logoutUri={process.env.NODE_ENV === 'development' ? 'http://localhost:3000/login' : 'https://sjoef.vercel.app/login'}
        >
          <QueryClientProvider client={queryClient}>
            <Router />
          </QueryClientProvider>
        </KindeProvider>
      </Suspense>
    </MantineProvider>
  );
}
