'use client';
import React, { Suspense } from 'react';
import Events from '@components/Events.tsx';

export default function Page() {
  return (
    <Suspense>
      <Events />
    </Suspense>
  );
}
