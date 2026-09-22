import type { Metadata, Viewport } from 'next';
import './globals.css';
import { LanguageProvider } from '@/lib/context/LanguageContext';
import { AuthProvider } from '@/lib/context/AuthContext';
import LiveTradeTicker from '@/components/layout/LiveTradeTicker';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Market 365 | Egypt export gateway',
  description: 'Market 365 is the verified national gateway to Egyptian exporters, products, routes and trusted trade.',
  keywords: 'Egypt exports, Egyptian oranges, Valencia citrus, frozen strawberries, Egyptian onions, Egyptian herbs, B2B export gateway, RFQ Egypt, Market 365',
};

export const viewport: Viewport = {
  themeColor: '#eee8dc',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" className="market365">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=DM+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#eee8dc] text-[#202522] min-h-screen font-sans antialiased selection:bg-[#9b452f] selection:text-white grain">
        <LanguageProvider>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <LiveTradeTicker />
              <Navbar />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
