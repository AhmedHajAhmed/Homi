import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import AuthProvider from '@/components/AuthProvider';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Homi - Connect with Host Families',
  description: 'A platform connecting college students with host families over school breaks',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authUser = await getAuthUser();
  let user = null;

  if (authUser) {
    const dbUser = await prisma.user.findUnique({
      where: { id: authUser.userId },
      select: { id: true, name: true, email: true, role: true },
    });
    user = dbUser;
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar user={user} />
          <main className="min-h-screen bg-gray-50">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}

