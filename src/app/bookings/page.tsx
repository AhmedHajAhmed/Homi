import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import BookingCard from '@/components/BookingCard';
import { Card, CardContent } from '@/components/ui/card';

export default async function BookingsPage() {
  const authUser = await getAuthUser();

  if (!authUser) {
    redirect('/login');
  }

  let bookings;

  if (authUser.role === 'STUDENT') {
    bookings = await prisma.booking.findMany({
      where: { studentId: authUser.userId },
      include: {
        listing: {
          include: {
            host: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  } else {
    bookings = await prisma.booking.findMany({
      where: {
        listing: {
          hostId: authUser.userId,
        },
      },
      include: {
        listing: true,
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            bio: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {authUser.role === 'STUDENT' ? 'My Booking Requests' : 'Booking Requests'}
        </h1>
        <p className="text-muted-foreground">
          {authUser.role === 'STUDENT' 
            ? 'View and manage your booking requests'
            : 'Review and respond to booking requests'}
        </p>
      </div>

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              {authUser.role === 'STUDENT' 
                ? 'You have not made any booking requests yet.'
                : 'You have not received any booking requests yet.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {bookings.map((booking) => (
            <BookingCard 
              key={booking.id} 
              booking={booking} 
              userRole={authUser.role as 'STUDENT' | 'HOST'}
            />
          ))}
        </div>
      )}
    </div>
  );
}

