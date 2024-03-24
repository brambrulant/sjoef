import * as React from 'react';
// @ts-ignore
import { Html } from '@react-email/html';
// @ts-ignore
import { Button } from '@react-email/button';
import QRCode from 'qrcode.react';

interface EmailProps {
  tickets: { event_id: any; user_id: any; jwt: string; created_at: Date; updated_at: Date }[];
  url: string;
}

export function Email(props: EmailProps) {
  const { url, tickets } = props;

  return (
    <Html lang="en">
      <Button href={url}>Go to Tickets</Button>
      {tickets.map((ticket) => {
        return (
          <div key={Math.random().toString(36).substring(7)}>
            <QRCode value={ticket.jwt} size={300} />
          </div>
        );
      })}
    </Html>
  );
}

export default Email;
