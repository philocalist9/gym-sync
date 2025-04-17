import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'GymSync - Your All-in-One Gym Companion',
  description: 'Manage workouts, track client progress, schedule appointments, and run your gym smoothly — all from one place.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
} 