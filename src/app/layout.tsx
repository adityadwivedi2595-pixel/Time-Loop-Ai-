import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/navigation/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TIMELOOP AI – Entertainment Edition | Don\'t Just Watch History. Become Part of It.',
  description: 'AI-Powered Interactive Cinematic Entertainment Universe with NVIDIA NIM, MCP, and Living Timeline Engine.',
  keywords: ['NVIDIA NIM', 'MCP', 'Interactive Storytelling', 'Generative AI', 'Living Timeline Engine', 'Mistral Large 4'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} dark`}>
      <body className="min-h-screen bg-[#050811] text-gray-100 antialiased flex flex-col selection:bg-purple-500 selection:text-white">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
