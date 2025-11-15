'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreateListingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    maxGuests: '1',
    photos: '',
    availableFrom: '',
    availableTo: '',
    wifi: false,
    parking: false,
    meals: false,
    laundry: false,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const photos = formData.photos
        .split('\n')
        .map(url => url.trim())
        .filter(url => url.length > 0);

      const amenities = {
        wifi: formData.wifi,
        parking: formData.parking,
        meals: formData.meals,
        laundry: formData.laundry,
      };

      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: 0, // Price set to 0 - colleges handle payment
          photos,
          amenities,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create listing');
        return;
      }

      router.push(`/listings/${data.listing.id}`);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Create a New Listing</CardTitle>
          <CardDescription>Share your home with students</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Listing Title</Label>
              <Input
                id="title"
                placeholder="Cozy Room Near Campus"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your space, what makes it special, and what guests can expect..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={6}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Berkeley, CA"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxGuests">Maximum Guests</Label>
              <Input
                id="maxGuests"
                type="number"
                min="1"
                value={formData.maxGuests}
                onChange={(e) => setFormData({ ...formData, maxGuests: e.target.value })}
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="availableFrom">Available From</Label>
                <Input
                  id="availableFrom"
                  type="date"
                  value={formData.availableFrom}
                  onChange={(e) => setFormData({ ...formData, availableFrom: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="availableTo">Available To</Label>
                <Input
                  id="availableTo"
                  type="date"
                  value={formData.availableTo}
                  onChange={(e) => setFormData({ ...formData, availableTo: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="photos">Photo URLs (one per line)</Label>
              <Textarea
                id="photos"
                placeholder="https://images.unsplash.com/photo-..."
                value={formData.photos}
                onChange={(e) => setFormData({ ...formData, photos: e.target.value })}
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                Enter image URLs from Unsplash, Imgur, or your own hosting
              </p>
            </div>

            <div className="space-y-2">
              <Label>Amenities</Label>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.wifi}
                    onChange={(e) => setFormData({ ...formData, wifi: e.target.checked })}
                    className="rounded"
                  />
                  <span>WiFi</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.parking}
                    onChange={(e) => setFormData({ ...formData, parking: e.target.checked })}
                    className="rounded"
                  />
                  <span>Parking</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.meals}
                    onChange={(e) => setFormData({ ...formData, meals: e.target.checked })}
                    className="rounded"
                  />
                  <span>Meals Included</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.laundry}
                    onChange={(e) => setFormData({ ...formData, laundry: e.target.checked })}
                    className="rounded"
                  />
                  <span>Laundry</span>
                </label>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Listing'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

