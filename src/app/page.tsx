import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, Heart, Sparkles, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Full Screen */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-gray-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="inline-block">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4" />
                Reimagining Student Housing
              </span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight">
              Every break deserves
              <br />
              <span className="bg-gradient-to-r from-[#8B0000] to-[#000000] bg-clip-text text-transparent">
                a place called home
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              The distance between campus and home shouldn't mean the distance from family.
              Connect with host families who open their doors and hearts.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link href="/signup">
                <Button size="lg" className="text-lg px-8 py-6 group">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/listings">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  Explore Listings
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-8 pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#8B0000]"></div>
                <span>Verified Hosts</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#8B0000]"></div>
                <span>Secure Platform</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#8B0000]"></div>
                <span>Real Connections</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              More than just a place to stay
            </h2>
            
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                College breaks shouldn't mean choosing between long journeys home and staying alone on campus.
                They shouldn't mean eating alone or navigating unfamiliar cities without support.
              </p>
              <p className="text-xl font-medium text-foreground">
                The next generation of student housing isn't about square footage or amenities.
              </p>
              <p>
                It's about connection. About families who understand what it means to be far from home. 
                About shared meals, local insights, and the warmth of genuine hospitality.
              </p>
              <p className="text-xl font-medium text-foreground">
                This is Homi. Where every student finds their home away from home—fully funded by your college.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-red-50/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Built for real connections</h2>
            <p className="text-xl text-muted-foreground">
              Every feature designed with care and intention
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Home className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">College Funded</h3>
                <p className="text-muted-foreground">
                  No cost to students. Your college covers everything. Just focus on finding 
                  the right family and enjoying your break.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Real Hospitality</h3>
                <p className="text-muted-foreground">
                  Message hosts before booking. Share your story. Learn about theirs. 
                  Connect with families who genuinely care about your experience.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Seamless Experience</h3>
                <p className="text-muted-foreground">
                  From discovery to departure, every interaction is thoughtfully designed. 
                  Simple booking. Clear communication. Zero friction.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-[#8B0000] to-[#000000] text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">
              Your next break starts here
            </h2>
            <p className="text-xl text-red-100">
              Join students and families building meaningful connections across campuses nationwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/signup">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                  Create Your Account
                </Button>
              </Link>
              <Link href="/listings">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-white/10 hover:bg-white/20 text-white border-white/30">
                  View Available Homes
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">100+</div>
              <div className="text-sm text-muted-foreground">Host Families</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-sm text-muted-foreground">Cities</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">1000+</div>
              <div className="text-sm text-muted-foreground">Students Hosted</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">4.9★</div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

