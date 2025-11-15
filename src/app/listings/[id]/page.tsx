import { notFound } from 'next/navigation';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Calendar, Mail, Phone } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import BookingForm from '@/components/BookingForm';

export default async function ListingDetailPage({ params }: { params: { id: string } }) {
  const listing = await prisma.listing.findUnique({
    where: { id: params.id },
    include: {
      host: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          bio: true,
          phone: true,
        },
      },
    },
  });

  if (!listing) {
    notFound();
  }

  const authUser = await getAuthUser();
  const canBook = authUser && authUser.role === 'STUDENT';

  const mainPhoto = listing.photos && listing.photos.length > 0 
    ? listing.photos[0] 
    : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Photos */}
          <div className="relative h-96 w-full rounded-lg overflow-hidden">
            <Image
              src={mainPhoto}
              alt={listing.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {listing.photos && listing.photos.length > 1 && (
            <div className="grid grid-cols-3 gap-4">
              {listing.photos.slice(1, 4).map((photo, index) => (
                <div key={index} className="relative h-32 rounded-lg overflow-hidden">
                  <Image
                    src={photo}
                    alt={`${listing.title} - ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Details */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
            <div className="flex items-center gap-4 text-muted-foreground mb-4">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {listing.location}
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                Up to {listing.maxGuests} guest{listing.maxGuests > 1 ? 's' : ''}
              </div>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {formatCurrency(listing.price)} per night
            </Badge>
          </div>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>About this place</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-line">{listing.description}</p>
            </CardContent>
          </Card>

          {/* Amenities */}
          {listing.amenities && Object.keys(listing.amenities as any).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(listing.amenities as any).map(([key, value]) => (
                    value && (
                      <div key={key} className="flex items-center">
                        <Badge variant="outline">{key}</Badge>
                      </div>
                    )
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Availability */}
          <Card>
            <CardHeader>
              <CardTitle>Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                {formatDate(listing.availableFrom)} - {formatDate(listing.availableTo)}
              </div>
            </CardContent>
          </Card>

          {/* Host Info */}
          <Card>
            <CardHeader>
              <CardTitle>About the Host</CardTitle>
              <CardDescription>{listing.host.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {listing.host.bio && (
                <p className="text-muted-foreground">{listing.host.bio}</p>
              )}
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2" />
                {listing.host.email}
              </div>
              {listing.host.phone && (
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2" />
                  {listing.host.phone}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Booking Sidebar */}
        <div className="lg:col-span-1">
          {canBook ? (
            <div className="sticky top-4">
              <BookingForm listingId={listing.id} />
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground mb-4">
                  {authUser ? 'Only students can book listings' : 'Please login to book this listing'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

