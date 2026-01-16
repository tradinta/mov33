import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster";
import './globals.css';
import { CartProvider } from '@/context/cart-context';
import { ParticleBackground } from '@/components/ui/particle-background';
import { ThemeProvider } from '@/components/theme-provider';
import FirebaseClientProvider from '@/firebase/client-provider';
import { AnalyticsTracker } from '@/components/analytics/analytics-tracker';

export const metadata: Metadata = {
  title: {
    default: 'Mov33 | Kenya\'s Premium Ticketing & Experience Platform',
    template: '%s | Mov33'
  },
  description: 'Discover and book the best experiences, tours, and nightlife in Kenya. Secure ticketing for organizers and attendees.',
  keywords: ['ticketing Kenya', 'events Nairobi', 'tours Kenya', 'nightlife Nairobi', 'Mov33'],
  authors: [{ name: 'Mov33 Team' }],
  creator: 'Mov33',
  publisher: 'Mov33',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Mov33 | Premium Ticketing & Experiences',
    description: 'Discover and book the best experiences in Kenya. Secure, fast, and reliable.',
    url: 'https://mov33.co.ke',
    siteName: 'Mov33',
    locale: 'en_KE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mov33 | Premium Ticketing & Experiences',
    description: 'Discover and book the best experiences in Kenya.',
    creator: '@mov33_ke',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Montserrat:wght@700;800&family=Poppins:wght@500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FirebaseClientProvider>
            <ParticleBackground className="fixed top-0 left-0 w-full h-full z-0" />
            <div className="relative z-10">
              <CartProvider>
                <AnalyticsTracker />
                {children}
                <Toaster />
              </CartProvider>
            </div>
          </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
