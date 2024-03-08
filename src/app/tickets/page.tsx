'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { Event } from '../types/event.ts';

async function getTickets(userId?: string): Promise<Event[]> {
  return await fetch('/api/tickets', {
    body: JSON.stringify({
      userId: userId,
    }),
  }).then((res) => res.json());
}

export default function Page() {
  const { user } = useKindeBrowserClient();
  const [bgSize, setBgSize] = React.useState('bg-pos-0');

  const { data, isLoading } = useQuery({
    queryKey: ['tickets'],
    queryFn: () => getTickets(user?.id),
  });

  return (
    <div className="h-screen w-full flex flex-col justify-between">
      <div
        className={`flex flex-col mt-4 md:mx-24 text-center justify-center p-8 rounded-2xl transition-all duration-1000 animate-gradient-x bg-gradient-to-r from-blue-900 via-pink-200 to-pink-600 bg-size-200 shadow-2xl ${bgSize}`}
      >
        {data ? data : 'no data'}
      </div>
    </div>
  );
}
