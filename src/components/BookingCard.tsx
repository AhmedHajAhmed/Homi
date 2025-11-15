'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Users, MapPin, MessageSquare } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Booking, BookingStatus } from '@/types';

interface BookingCardProps {
  booking: Booking;
  userRole: 'STUDENT' | 'HOST';
}

export default function BookingCard({ booking, userRole }: BookingCardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusUpdate = async (status: BookingStatus) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/bookings/${booking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Error updating booking:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'ACCEPTED':
        return 'success';
      case 'REJECTED':
        return 'destructive';
      case 'CANCELLED':
        return 'secondary';
      default:
        return 'warning';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <Link href={`/listings/${booking.listing?.id}`} className="hover:underline">
              <CardTitle className="text-lg">{booking.listing?.title}</CardTitle>
            </Link>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              {booking.listing?.location}
            </div>
          </div>
          <Badge variant={getStatusColor(booking.status)}>
            {booking.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center text-sm">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>
            {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
          </span>
        </div>
        <div className="flex items-center text-sm">
          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>{booking.guests} guest{booking.guests > 1 ? 's' : ''}</span>
        </div>
        {userRole === 'HOST' && booking.student && (
          <div className="pt-2 border-t">
            <p className="text-sm font-medium">Student: {booking.student.name}</p>
            <p className="text-xs text-muted-foreground">{booking.student.email}</p>
          </div>
        )}
        {userRole === 'STUDENT' && booking.listing?.host && (
          <div className="pt-2 border-t">
            <p className="text-sm font-medium">Host: {booking.listing.host.name}</p>
            <p className="text-xs text-muted-foreground">{booking.listing.host.email}</p>
          </div>
        )}
        {booking.message && (
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground">&quot;{booking.message}&quot;</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Link href={`/messages?bookingId=${booking.id}`} className="flex-1">
          <Button variant="outline" className="w-full" size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Messages
          </Button>
        </Link>
        {userRole === 'HOST' && booking.status === 'PENDING' && (
          <>
            <Button
              variant="default"
              size="sm"
              onClick={() => handleStatusUpdate('ACCEPTED')}
              disabled={isLoading}
            >
              Accept
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleStatusUpdate('REJECTED')}
              disabled={isLoading}
            >
              Reject
            </Button>
          </>
        )}
        {userRole === 'STUDENT' && booking.status === 'PENDING' && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleStatusUpdate('CANCELLED')}
            disabled={isLoading}
          >
            Cancel Request
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

