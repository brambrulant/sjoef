'use client';

import React from 'react';
import { QrReader } from 'react-qr-reader';
import { useQuery } from '@tanstack/react-query';
import Loader from '@components/Loader';
import dynamic from 'next/dynamic';

async function scanTicket(qrData: string) {
  try {
    return await fetch('/api/scan', {
      method: 'POST',
      body: JSON.stringify({ qrData }),
    }).then((res) => res.json());
  } catch (error) {
    console.log('hoi', error);
    return null;
  }
}

function Page() {
  const [qrData, setQrData] = React.useState(null);

  const { data: ticketResult, isLoading } = useQuery({
    queryKey: ['scan', qrData],
    queryFn: () => scanTicket(qrData!),
    enabled: !!qrData,
  });

  const handleScan = (result: any, error: any) => {
    if (result) {
      setQrData(result);
    }
  };

  console.log('ticketResult', ticketResult);

  return (
    <div className="">
      <QrReader
        className="w-2/3 h-2/3 m-auto rounded-xl mt-24 bg-pink-600"
        constraints={{ facingMode: 'environment' }}
        videoContainerStyle={{ width: '100%' }}
        onResult={handleScan}
      />
      {isLoading && <Loader />}
      {ticketResult?.ticket?.length && ticketResult?.ticket[0].id ? (
        <p className={`bg-green-500 w-1/2 h-40 m-auto mt-4 rounded-xl flex align-center`}>
          {ticketResult?.ticket[0].id}
        </p>
      ) : (
        <div className={`bg-red-500 w-2/3 h-40 m-auto mt-4 rounded-xl flex align-center`}>
          <p className="m-auto">No ticket found</p>
        </div>
      )}
    </div>
  );
}

export default dynamic(() => Promise.resolve(Page), {
  ssr: false,
});
