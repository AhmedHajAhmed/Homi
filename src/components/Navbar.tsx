'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Home, LogOut } from 'lucide-react';

interface NavbarProps {
  user?: {
    name: string;
    email: string;
    role: string;
  } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Home className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Homi</span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant={pathname === '/dashboard' ? 'default' : 'ghost'}>
                    Dashboard
                  </Button>
                </Link>
                <Link href="/listings">
                  <Button variant={pathname === '/listings' ? 'default' : 'ghost'}>
                    Browse Listings
                  </Button>
                </Link>
                {user.role === 'HOST' && (
                  <Link href="/listings/create">
                    <Button variant={pathname === '/listings/create' ? 'default' : 'ghost'}>
                      Create Listing
                    </Button>
                  </Link>
                )}
                <Link href="/bookings">
                  <Button variant={pathname === '/bookings' ? 'default' : 'ghost'}>
                    Bookings
                  </Button>
                </Link>
                <Link href="/messages">
                  <Button variant={pathname === '/messages' ? 'default' : 'ghost'}>
                    Messages
                  </Button>
                </Link>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">{user.name}</span>
                  <Button variant="ghost" size="icon" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

