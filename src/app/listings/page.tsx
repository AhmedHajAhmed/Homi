import { prisma } from '@/lib/prisma';
import ListingCard from '@/components/ListingCard';
import { Card, CardContent } from '@/components/ui/card';

export default async function ListingsPage() {
  const listings = await prisma.listing.findMany({
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
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Browse Listings</h1>
        <p className="text-muted-foreground">
          Find the perfect place to stay during your school break
        </p>
      </div>

      {listings.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No listings available yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}

