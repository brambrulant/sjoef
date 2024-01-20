import React, { Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Title, Container, Text } from '@mantine/core';
import { format } from 'date-fns';
import { useQuery } from 'react-query';
import useToken from '@/functions/useToken';
import Loader from '@/components/Loader';

export default function Eventpage() {
  const { token, isLoading: isAuthLoading, user } = useToken();
  const [events, setEvents] = React.useState<any[]>([]);

  const fetchEvents = async () => {
    if (!token) return;
    const response = await fetch('http://localhost:3000/api/events', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  const { data, status } = useQuery('eventData', fetchEvents, {
    enabled: !!token,
    onSuccess: (data) => {
      setEvents(data);
    },
  });

  const navigate = useNavigate();

  const handleClickEvent = React.useCallback(
    (id: number) => {
      navigate(`/events/${id}`);
    },
    [navigate]
  );

  if (isAuthLoading || !user) return <Loader />;
  if (!token) return <div>no token</div>;
  if (status === 'loading') return <div>Loading data...</div>;
  if (status === 'error') return <div>Error fetching data</div>;
  return (
    <Container ta="center">
      <Title>Events</Title>
      {events?.map((event: any) => (
        <div
          className="flex flex-col p-8 m-4 animate-gradient-x bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 cursor-pointer rounded-3xl hover:bg-pink-800 hover:shadow-none shadow-2xl transition-background-color duration-200 ease-in-out"
          onClick={() => handleClickEvent(event.id)}
          key={event.id}
        >
          <Title>{event.name}</Title>
          <Text>{event.genre}</Text>
          <Text>{format(new Date(event.date), 'dd-MM-yyyy')}</Text>
          <Text>€{event.price}</Text>
        </div>
      ))}
    </Container>
  );
}
