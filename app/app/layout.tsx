
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Cool Inspired Blog - Modern Magazine & Blog Platform',
  description: 'A modern magazine and blog platform built with Next.js, featuring clean design and engaging content.',
  keywords: ['blog', 'magazine', 'nextjs', 'technology', 'design', 'business', 'lifestyle'],
  authors: [{ name: 'Cool Blog Team' }],
  openGraph: {
    title: 'Cool Inspired Blog',
    description: 'A modern magazine and blog platform built with Next.js',
    type: 'website',
    siteName: 'Cool Blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cool Inspired Blog',
    description: 'A modern magazine and blog platform built with Next.js',
  },
  robots: 'index, follow',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
