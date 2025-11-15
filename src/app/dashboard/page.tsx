import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ListingCard from '@/components/ListingCard';
import BookingCard from '@/components/BookingCard';
import { Home, Calendar, MessageSquare, Plus } from 'lucide-react';

export default async function DashboardPage() {
  const authUser = await getAuthUser();

  if (!authUser) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: authUser.userId },
  });

  // Get statistics
  let stats;
  let recentBookings;
  let listings;

  if (authUser.role === 'STUDENT') {
    const totalBookings = await prisma.booking.count({
      where: { studentId: authUser.userId },
    });

    const pendingBookings = await prisma.booking.count({
      where: { 
        studentId: authUser.userId,
        status: 'PENDING',
      },
    });

    const acceptedBookings = await prisma.booking.count({
      where: { 
        studentId: authUser.userId,
        status: 'ACCEPTED',
      },
    });

    const unreadMessages = await prisma.message.count({
      where: {
        senderId: { not: authUser.userId },
        read: false,
        booking: {
          studentId: authUser.userId,
        },
      },
    });

    stats = {
      total: totalBookings,
      pending: pendingBookings,
      accepted: acceptedBookings,
      unread: unreadMessages,
    };

    recentBookings = await prisma.booking.findMany({
      where: { studentId: authUser.userId },
      include: {
        listing: {
          include: {
            host: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    });
  } else {
    const totalListings = await prisma.listing.count({
      where: { hostId: authUser.userId },
    });

    const totalBookings = await prisma.booking.count({
      where: {
        listing: {
          hostId: authUser.userId,
        },
      },
    });

    const pendingBookings = await prisma.booking.count({
      where: {
        listing: {
          hostId: authUser.userId,
        },
        status: 'PENDING',
      },
    });

    const unreadMessages = await prisma.message.count({
      where: {
        senderId: { not: authUser.userId },
        read: false,
        booking: {
          listing: {
            hostId: authUser.userId,
          },
        },
      },
    });

    stats = {
      listings: totalListings,
      total: totalBookings,
      pending: pendingBookings,
      unread: unreadMessages,
    };

    listings = await prisma.listing.findMany({
      where: { hostId: authUser.userId },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 6,
    });

    recentBookings = await prisma.booking.findMany({
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
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-muted-foreground">
          {authUser.role === 'STUDENT' 
            ? 'Manage your bookings and find new places to stay'
            : 'Manage your listings and respond to booking requests'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {authUser.role === 'HOST' && (
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Listings</CardDescription>
              <CardTitle className="text-3xl">{stats.listings}</CardTitle>
            </CardHeader>
            <CardContent>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardContent>
          </Card>
        )}
        
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>
              {authUser.role === 'STUDENT' ? 'Total Requests' : 'Total Bookings'}
            </CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pending Requests</CardDescription>
            <CardTitle className="text-3xl">{stats.pending}</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="warning">Pending</Badge>
          </CardContent>
        </Card>

        {authUser.role === 'STUDENT' && (
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Accepted Bookings</CardDescription>
              <CardTitle className="text-3xl">{stats.accepted}</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant="success">Accepted</Badge>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Unread Messages</CardDescription>
            <CardTitle className="text-3xl">{stats.unread}</CardTitle>
          </CardHeader>
          <CardContent>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardContent>
        </Card>
      </div>

      {/* Host: My Listings */}
      {authUser.role === 'HOST' && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">My Listings</h2>
            <Link href="/listings/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create New Listing
              </Button>
            </Link>
          </div>

          {listings && listings.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">
                  You haven&apos;t created any listings yet.
                </p>
                <Link href="/listings/create">
                  <Button>Create Your First Listing</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Recent Bookings */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {authUser.role === 'STUDENT' ? 'My Booking Requests' : 'Recent Booking Requests'}
          </h2>
          <Link href="/bookings">
            <Button variant="outline">View All</Button>
          </Link>
        </div>

        {recentBookings.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {recentBookings.map((booking) => (
              <BookingCard 
                key={booking.id} 
                booking={booking}
                userRole={authUser.role as 'STUDENT' | 'HOST'}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {authUser.role === 'STUDENT' 
                  ? 'You haven\'t made any booking requests yet.'
                  : 'You haven\'t received any booking requests yet.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/listings">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Home className="h-5 w-5 mr-2" />
                  Browse Listings
                </CardTitle>
                <CardDescription>
                  Find the perfect place to stay
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/messages">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Messages
                  {stats.unread > 0 && (
                    <Badge variant="default" className="ml-2">
                      {stats.unread}
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription>
                  Chat with {authUser.role === 'STUDENT' ? 'hosts' : 'students'}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          {authUser.role === 'HOST' ? (
            <Link href="/listings/create">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="h-5 w-5 mr-2" />
                    Create Listing
                  </CardTitle>
                  <CardDescription>
                    Share your home with students
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ) : (
            <Link href="/bookings">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    My Bookings
                  </CardTitle>
                  <CardDescription>
                    View all your booking requests
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

