import React from 'react';
import { useQuery } from 'react-query';
import { Container, Tabs } from '@mantine/core';
import Loader from '@/components/Loader';
import { Navigate } from 'react-router-dom';
import useToken from '@/functions/useToken';
import EventForm from '@/components/EventForm';

export default function AdminPage() {
  const { token, isLoading: isAuthLoading, user } = useToken();

  const fetchAdminData = async () => {
    if (!token) return;
    const response = await fetch('http://localhost:3000/api/admin', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        return <Navigate to="/login" />;
      }
      if (response.status === 403) {
        return <div>you're no admin {user?.given_name}.. go home</div>;
      }
      throw new Error('Network response was not ok');
    }

    return response.json();
  };

  const { data, status } = useQuery('adminData', fetchAdminData, {
    enabled: !!token,
  });

  if (isAuthLoading || !user) return <Loader />;
  if (!token) return <div>no token</div>;
  if (status === 'loading') return <div>Loading data...</div>;
  if (status === 'error') return <div>Error fetching data</div>;

  return (
    <Container p="md">
      <Tabs variant="outline" defaultValue="events">
        <Tabs.List>
          <Tabs.Tab value="events" autoFocus>
            Events
          </Tabs.Tab>
          <Tabs.Tab value="users">Users</Tabs.Tab>
          <Tabs.Tab value="settings">Settings</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="events">
          <EventForm token={token} />
        </Tabs.Panel>

        <Tabs.Panel value="users">Messages tab content</Tabs.Panel>

        <Tabs.Panel value="settings">Settings tab content</Tabs.Panel>
      </Tabs>
    </Container>
  );
}
