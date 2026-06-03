import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { UserProvider } from '@/context/UserContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'RageMotorSport — Find Your Perfect Ride',
  description: 'Browse thousands of premium cars. Filter by make, model, price, and more. Free test drives, certified vehicles, flexible financing.',
  keywords: 'cars for sale, buy car, used cars, new cars, car dealer, automotive marketplace',
  openGraph: {
    title: 'RageMotorSport — Find Your Perfect Ride',
    description: 'Browse thousands of premium cars with free test drives and flexible financing.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
