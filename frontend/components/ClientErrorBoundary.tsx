'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// Use dynamic import for ErrorBoundary to avoid SSR issues
const ErrorBoundary = dynamic(() => import('./ErrorBoundary'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

// A client component wrapper to use the ErrorBoundary
export default function ClientErrorBoundary({
  children
}: {
  children: React.ReactNode;
}) {
  return <ErrorBoundary>{children}</ErrorBoundary>;
} 