import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Container, Title, Text } from '@mantine/core';
import useToken from '@/functions/useToken';
import Loader from '@/components/Loader';
import TicketCheckoutForm from '@/components/CheckoutForm/TicketCheckoutForm';

export default function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { token, isLoading: isAuthLoading, user } = useToken();
  const [event, setEvent] = React.useState<any[]>([]);

  const fetchEvents = async () => {
    if (!token) return;
    const response = await fetch(`http://localhost:3000/api/events/${id}`, {
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

  const { data, status } = useQuery('eventDetailsData', fetchEvents, {
    enabled: !!token,
    onSuccess: (data) => {
      setEvent(data);
    },
  });
  if (isAuthLoading || !user) return <Loader />;
  if (!token) return <div>no token</div>;
  if (status === 'loading') return <div>Loading data...</div>;
  if (status === 'error') return <div>Error fetching data</div>;

  return (
    <Container ta="center">
      <Title>event details</Title>
      <Text>{event[0]?.name}</Text>
      <Text>{event[0]?.genre}</Text>
      <Text>{event[0]?.date}</Text>
      <div></div>
      {event[0]?.price && <TicketCheckoutForm eventId={event[0]?.price} />}
    </Container>
  );
}
