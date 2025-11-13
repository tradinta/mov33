import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster";
import './globals.css';
import { CartProvider } from '@/context/cart-context';
import { ParticleBackground } from '@/components/ui/particle-background';

export const metadata: Metadata = {
  title: 'Mov33 - Discover & Book Your Next Experience',
  description: 'A premium event discovery and ticketing platform for live experiences, tours, and nightlife.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Montserrat:wght@700;800&family=Poppins:wght@500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background">
        <ParticleBackground className="fixed top-0 left-0 w-full h-full z-0" />
        <div className="relative z-10">
          <CartProvider>
            {children}
            <Toaster />
          </CartProvider>
        </div>
      </body>
    </html>
  );
}
