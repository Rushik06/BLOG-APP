import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Geist } from 'next/font/google';
import { cn } from '@/lib/utils';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn(geist.variable)}>
      <body className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">{children}</main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
