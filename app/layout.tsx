import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Geist } from 'next/font/google';
import { cn } from '@/lib/utils';
import { ThemeProvider } from 'next-themes';
import { globalMetadata } from '@/app/metadata/global';

export const metadata = globalMetadata;

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(geist.variable)}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-gray-100 transition-colors">

        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>

          {/* NAV */}
          <Navbar />

          {/* MAIN */}
          <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
            {children}
          </main>

          {/* FOOTER */}
          <Footer />

        </ThemeProvider>
      </body>
    </html>
  );
}