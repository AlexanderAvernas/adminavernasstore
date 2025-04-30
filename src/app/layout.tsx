// app/layout.tsx

import './globals.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import SessionProviderWrapper from './components/SessionProviderWrapper';
import Navbar from './components/Navbar'; // ✅ Lägg till denna

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  title: 'Adminpanel',
  description: 'Skyddad adminpanel för produkt- och bildhantering',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased bg-white text-black min-h-screen">
        <SessionProviderWrapper>
          <Navbar /> {/* ✅ Här läggs navbaren in */}
          <main className="p-4">{children}</main>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
