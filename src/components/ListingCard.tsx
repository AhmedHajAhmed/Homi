import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { MapPin, Users } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Listing } from '@/types';

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const mainPhoto = listing.photos && listing.photos.length > 0 
    ? listing.photos[0] 
    : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800';

  return (
    <Link href={`/listings/${listing.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        <div className="relative h-48 w-full">
          <Image
            src={mainPhoto}
            alt={listing.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <CardHeader>
          <h3 className="font-semibold text-lg line-clamp-1">{listing.title}</h3>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            {listing.location}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-1" />
            Up to {listing.maxGuests} guest{listing.maxGuests > 1 ? 's' : ''}
          </div>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          {formatDate(listing.availableFrom)} - {formatDate(listing.availableTo)}
        </CardFooter>
      </Card>
    </Link>
  );
}

