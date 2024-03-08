'use client';
import React from 'react';

import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import EventForm from '@components/EventForm.tsx';

export default function Page() {
  const { getPermissions } = useKindeBrowserClient();

  const permissions = getPermissions();

  if (!permissions?.permissions?.includes('admin')) return <h1>Unauthorized</h1>;
  return <EventForm />;
}
