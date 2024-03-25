import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Svg,
  Path,
  Link,
  LinearGradient,
  Defs,
  Stop,
} from '@react-pdf/renderer';
import { Ticket } from '../types/ticket.ts';
import { Event } from '../types/event.ts';
import ReactHtmlParser from 'react-html-parser';
import QRCode from 'qrcode.react';
import { renderToStaticMarkup } from 'react-dom/server';
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
});

export interface TicketPDFProps {
  tickets: Ticket[];
  event: Event;
  url: string;
}

const parseQrCodeMarkup = (
  markup: string
): React.ReactElement<any, string | React.JSXElementConstructor<any>> | null => {
  let parsedQrCodeSvg = null;
  ReactHtmlParser(markup).forEach((el) => {
    const { type } = el;
    if (type === 'svg') {
      parsedQrCodeSvg = el;
    }
  });

  return parsedQrCodeSvg;
};

const qrCodeComponent = (ticket: Ticket) => {
  const component = <QRCode value={ticket.jwt} renderAs="svg" width={300} height={300} />;

  const qrCodeComponentStaticMarkup = renderToStaticMarkup(component);
  return parseQrCodeMarkup(qrCodeComponentStaticMarkup);
};

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

export const TicketPDF = ({ tickets, event, url }: TicketPDFProps) => {
  return (
    <Document>
      {tickets.map((ticket, i) => (
        <Page key={i} size="A4" style={styles.page}>
          <View style={styles.section}>
            <SvgBackground />
            <View style={styles.innerSection}>
              <Text style={styles.header}>Sjoef. </Text>
              <Text style={styles.text}>{event.name}</Text>
              <Link href={`https://www.sjoef.com/events?id=${event.id}`}>Link to event</Link>
              <Text style={styles.text}>{format(event.date!, 'dd-MM-yyyy')}</Text>
              <Text style={styles.text}>ticket id: {ticket.id}</Text>
              <Svg style={styles.svg} viewBox="0 0 60 60">
                {qrCodeComponent(ticket)!
                  .props.children.filter((c: React.ReactElement) => c.type === 'path')
                  .map((child: React.ReactElement, index: number) => (
                    <Path key={index} d={child.props.d} fill={child.props.fill} />
                  ))}
              </Svg>
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default TicketPDF;
