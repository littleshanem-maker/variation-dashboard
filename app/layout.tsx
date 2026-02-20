import './globals.css';
import type { Metadata } from 'next';
import { AppStoreProvider } from '@/lib/store';
import Sidebar from './components/Sidebar';

export const metadata: Metadata = {
  title: 'Variation Capture',
  description: 'Project variation management for construction professionals',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className="antialiased">
        <AppStoreProvider>
          <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />
            <main style={{ flex: 1, marginLeft: 220, minWidth: 0 }}>
              {children}
            </main>
          </div>
        </AppStoreProvider>
      </body>
    </html>
  );
}
