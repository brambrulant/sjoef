import { Body, Button, Container, Head, Hr, Html, Preview, Section, Text } from 'jsx-email';
import * as React from 'react';
import { Ticket } from '../types/ticket.ts';
import { Event } from '../types/event.ts';
import { format } from 'date-fns';

interface TicketEmailProps {
  tickets: Ticket[];
  event: Event;
  userFirstname: string;
}

export const TicketEmail = ({ tickets, event, userFirstname }: TicketEmailProps) => (
  <Html>
    <Head />
    <Body style={gradientBackground}>
      <Container style={container}>
        <Text>From Sjoef.</Text>
        <Text style={paragraph}>Hi {userFirstname},</Text>
        <Text style={paragraph}>
          Whoop whoop, your tickets for {event.name} on {format(event.date!, 'dd-MM-yyyy')}. See you
          there!
        </Text>
        <Section style={btnContainer}>
          <Button style={button} href="https://www.sjoef.app/tickets">
            Find your tickets here
          </Button>
        </Section>
        <Text style={paragraph}>
          Love,
          <br />
          Sjoef team
        </Text>
        <Hr style={hr} />
        <Text style={footer}>Ask your network for location..</Text>
      </Container>
    </Body>
  </Html>
);

export default TicketEmail;

const gradientBackground = {
  borderRadius: '6px',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  backgroundSize: '200% 200%', // Equivalent to bg-size-200
  animation: 'gradientX 1s infinite', // Custom animation equivalent to animate-gradient-x
  transition: 'all 1s', // Equivalent to transition-all duration-1000
  backgroundImage: 'linear-gradient(to right, #2c5282, #fbcfe8, #f687b3)', // Equivalent to bg-gradient-to-r from-blue-900 via-pink-200 to-pink-600
};

const keyframes = `@keyframes gradientX {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}`;

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
};

const paragraph = {};

const btnContainer = {
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#db2777',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px',
};

const hr = {
  borderColor: '#cccccc',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
};
