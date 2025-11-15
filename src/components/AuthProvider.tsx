'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('auth-token');
    const publicRoutes = ['/', '/login', '/signup'];
    const isPublicRoute = publicRoutes.includes(pathname);

    // If no token and trying to access protected route
    if (!token && !isPublicRoute) {
      router.push('/login');
      return;
    }

    // If has token and trying to access auth pages
    if (token && (pathname === '/login' || pathname === '/signup')) {
      router.push('/dashboard');
      return;
    }
  }, [pathname, router]);

  return <>{children}</>;
}

