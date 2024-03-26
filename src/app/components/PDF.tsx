import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Svg,
  Path,
  Link,
  LinearGradient,
  Defs,
  Stop,
  Image,
} from '@react-pdf/renderer';
import { Ticket } from '../types/ticket.ts';
import { Event } from '../types/event.ts';
import { format } from 'date-fns';

const styles = StyleSheet.create({
  page: {
    position: 'absolute',
    flexDirection: 'row',
    margin: '1rem auto', // equivalent to 'mt-4'
    textAlign: 'center', // equivalent to 'text-center'
    padding: '2rem', // equivalent to 'p-8'
  },
  header: {
    fontSize: 24,
    marginLeft: 'auto',
  },
  text: {
    fontSize: 12,
    color: '#cbd5e1',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  section: {
    position: 'absolute', // Position content absolutely
    top: 0, // Adjust top, right, bottom, left as needed to fit your content layout
    left: 0,
    right: 0,
    bottom: 0,
  },
  innerSection: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start', // Center content vertically
    alignItems: 'flex-start', // Center content horizontally
    padding: 20,
  },
  svg: {
    padding: 10,
    margin: 'auto',
    fontSize: 48,
    width: 400,
    height: 400,
  },
  link: {
    fontSize: 12,
    color: '#cbd5e1',
  },
});

const SvgBackground = () => (
  <Svg style={styles.background}>
    <Defs>
      <LinearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
        <Stop offset="0%" stopColor="#1a365d" stopOpacity="1" />
        <Stop offset="50%" stopColor="#ed64a6" stopOpacity="1" />
        <Stop offset="100%" stopColor="#ed64a6" stopOpacity="1" />
      </LinearGradient>
    </Defs>
    <Path d="M0 0 H595.28 V841.89 H0 Z" fill="url(#grad1)" />
  </Svg>
);

export interface TicketPDFProps {
  tickets: Ticket[];
  qrCodeStrings?: string[];
  event?: Event;
  url: string;
}

function TicketPDF({ tickets, event, qrCodeStrings, url }: TicketPDFProps) {
  if (!tickets || !event || !qrCodeStrings?.length) return null;
  return (
    <Document>
      {tickets?.map((ticket, i) => (
        <Page key={ticket.id} size="A4" style={styles.page}>
          <View style={styles.section}>
            <SvgBackground />
            <View style={styles.innerSection}>
              <Text style={styles.header}>Sjoef. </Text>
              <Text style={styles.text}>{event?.name}</Text>
              <Link style={styles.link} href={`https://www.sjoef.com/events?id=${event?.id}`}>
                Link to event
              </Link>
              <Text style={styles.text}>{format(event?.date!, 'dd-MM-yyyy')}</Text>
              <Text style={styles.text}>ticket id: {ticket.id}</Text>
              <Image
                src={qrCodeStrings[i]}
                style={{ width: 300, height: 300, margin: 'auto', marginTop: '128px' }}
              />
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );
}

export default TicketPDF;
