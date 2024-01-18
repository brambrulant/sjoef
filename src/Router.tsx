import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import ProtectedRoute from '@/components/ProtectedRoute';

import LoginPage from '@/pages/LoginPage';
import HomePage from '@/pages/Homepage';
import Eventpage from '@/pages/Eventpage';
import KadaverPage from '@/pages/Kadaverpage';
import BasicAppShell from '@/components/BasicAppShell';
import LogoutPage from '@/pages/LogoutPage';
import Adminpage from '@/pages/Adminpage';
import EventDetailsPage from '@/pages/EventDetailsPage';

export const Router: React.FC = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <BasicAppShell />,
      children: [
        {
          path: '/home',
          element: (
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          ),
        },
        {
          path: '/events',
          element: (
            <ProtectedRoute>
              <Eventpage />
            </ProtectedRoute>
          ),
        },
        {
          path: '/events/:id',
          element: (
            <ProtectedRoute>
              <EventDetailsPage />
            </ProtectedRoute>
          ),
        },
        {
          path: '/kadaver',
          element: (
            <ProtectedRoute>
              <KadaverPage />
            </ProtectedRoute>
          ),
        },
        {
          path: '/admin',
          element: (
            <ProtectedRoute>
              <Adminpage />
            </ProtectedRoute>
          ),
        },
        {
          path: '/logout',
          element: (
            <ProtectedRoute>
              <LogoutPage />
            </ProtectedRoute>
          ),
        },
        { path: '/login', element: <LoginPage /> },
        {
          path: '/*',
          element: (
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;
