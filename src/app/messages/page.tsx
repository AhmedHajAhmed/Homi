import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import MessageThread from '@/components/MessageThread';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: { bookingId?: string };
}) {
  const authUser = await getAuthUser();

  if (!authUser) {
    redirect('/login');
  }

  // Get all bookings with messages for this user
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
              },
            },
          },
        },
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
        _count: {
          select: {
            messages: {
              where: {
                senderId: { not: authUser.userId },
                read: false,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
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
          },
        },
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
        _count: {
          select: {
            messages: {
              where: {
                senderId: { not: authUser.userId },
                read: false,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  const selectedBookingId = searchParams.bookingId || bookings[0]?.id;
  const selectedBooking = bookings.find(b => b.id === selectedBookingId);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Messages</h1>
        <p className="text-muted-foreground">
          Chat with {authUser.role === 'STUDENT' ? 'hosts' : 'students'}
        </p>
      </div>

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              You don&apos;t have any conversations yet.
            </p>
            <p className="text-sm text-muted-foreground">
              {authUser.role === 'STUDENT'
                ? 'Book a listing to start chatting with hosts.'
                : 'Wait for students to book your listings.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Conversation List */}
          <div className="lg:col-span-1 space-y-2">
            {bookings.map((booking) => {
              const isSelected = booking.id === selectedBookingId;
              const unreadCount = booking._count?.messages || 0;
              const otherPerson = authUser.role === 'STUDENT' 
                ? booking.listing?.host 
                : booking.student;

              return (
                <Link key={booking.id} href={`/messages?bookingId=${booking.id}`}>
                  <Card 
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'border-primary bg-primary/5' : 'hover:bg-gray-50'
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">
                            {otherPerson?.name}
                          </CardTitle>
                          <CardDescription className="text-xs mt-1">
                            {booking.listing?.title}
                          </CardDescription>
                        </div>
                        {unreadCount > 0 && (
                          <Badge variant="default" className="ml-2">
                            {unreadCount}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    {booking.messages[0] && (
                      <CardContent className="pt-0">
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {booking.messages[0].content}
                        </p>
                      </CardContent>
                    )}
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* Message Thread */}
          <div className="lg:col-span-2">
            {selectedBooking ? (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {authUser.role === 'STUDENT'
                      ? selectedBooking.listing?.host?.name
                      : selectedBooking.student?.name}
                  </CardTitle>
                  <CardDescription>
                    {selectedBooking.listing?.title}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MessageThread 
                    bookingId={selectedBookingId} 
                    currentUserId={authUser.userId}
                  />
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    Select a conversation to view messages
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

