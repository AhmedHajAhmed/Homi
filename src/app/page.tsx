import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Users, MessageSquare, Shield } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">
          Welcome to <span className="text-primary">Homi</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Connect college students with warm host families during school breaks.
          Experience home away from home.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/signup">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link href="/listings">
            <Button size="lg" variant="outline">
              Browse Listings
            </Button>
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <Card>
          <CardHeader>
            <Home className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Comfortable Stays</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Find welcoming host families offering comfortable accommodations near campus.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Users className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Verified Hosts</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              All host families are verified to ensure a safe and pleasant experience.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <MessageSquare className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Easy Communication</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Message hosts directly to discuss your stay and ask questions.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Shield className="h-10 w-10 text-primary mb-2" />
            <CardTitle>Secure Platform</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Your data is protected and secure throughout the booking process.
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* How It Works */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Create Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Sign up as a student looking for accommodation or as a host family offering your home.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Browse & Connect</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Students can browse available listings and send booking requests to hosts they like.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Confirm Your Stay</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Hosts review requests and accept the ones that fit. Message each other to coordinate details.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

