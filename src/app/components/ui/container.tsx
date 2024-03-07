// create a new container component
import React from 'react';

export default function Container({ children, p }: { children: React.ReactNode; p?: string }) {
  return <div className={`container mx-auto p-${p}`}>{children}</div>;
}
