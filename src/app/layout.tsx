import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/lib/context/LanguageContext';
import LiveTradeTicker from '@/components/layout/LiveTradeTicker';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'OpenMarket365 | Egypt’s National B2B Export Gateway & Trade Desk',
  description: 'Direct access to verified Egyptian agricultural packing stations, cold-chain facilities, and industrial exporters. Live importer RFQs, sealed quotation bidding, and zero commission.',
  keywords: 'Egypt exports, Egyptian oranges, Valencia citrus, frozen strawberries, Egyptian onions, Egyptian herbs, B2B export gateway, RFQ Egypt',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" className="dark">
      <body className="bg-brand-dark min-h-screen text-slate-100 antialiased selection:bg-brand-gold selection:text-brand-dark">
        <LanguageProvider>
          <div className="flex flex-col min-h-screen">
            <LiveTradeTicker />
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
