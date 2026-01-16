import { FirebaseProvider } from '@/firebase/provider';
import { AuthProvider } from '@/context/auth-context';
import React from 'react';

export default function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </FirebaseProvider>
  );
}
