'use client';
import { FirebaseProvider } from '@/firebase/provider';
import React from 'react';

export default function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FirebaseProvider>{children}</FirebaseProvider>;
}
