'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowRight, Star, Users, TrendingUp, CheckCircle } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/10">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
              W
            </div>
            <span className="text-xl font-bold text-foreground">Worthmate</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-primary hover:bg-primary/90">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-6 leading-tight">
            Expert Guidance for Your Success
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Connect with industry professionals for 1:1 consultations. Get AI powered recommendations based on real community feedback to make informed decisions.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/signup">
              <Button size="lg" className="bg-primary hover:bg-primary/90 h-12 px-8">
                Book a Consultation <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="h-12 px-8">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-border p-8 text-center">
            <div className="text-4xl font-bold text-primary mb-2">100+</div>
            <p className="text-muted-foreground">Expert Mentors</p>
          </Card>
          <Card className="border-border p-8 text-center">
            <div className="text-4xl font-bold text-primary mb-2">2000+</div>
            <p className="text-muted-foreground">Successful Calls</p>
          </Card>
          <Card className="border-border p-8 text-center">
            <div className="text-4xl font-bold text-primary mb-2">4.8★</div>
            <p className="text-muted-foreground">Average Rating</p>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 sm:px-6 lg:px-8 py-20 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-foreground mb-16">Why Choose Worthmate?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Card className="border-border p-8">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Vetted Professionals</h3>
              <p className="text-muted-foreground">All mentors are thoroughly vetted and have proven track records in their fields.</p>
            </Card>

            <Card className="border-border p-8">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">AI-Powered Recommendations</h3>
              <p className="text-muted-foreground">Get intelligent suggestions based on community feedback and real outcomes.</p>
            </Card>

            <Card className="border-border p-8">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Community Reviews</h3>
              <p className="text-muted-foreground">See detailed feedback from users who have taken consultations before.</p>
            </Card>

            <Card className="border-border p-8">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Secure & Private</h3>
              <p className="text-muted-foreground">Your conversations are encrypted and your data is completely secure.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 bg-primary/5 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-foreground mb-6">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8">Join thousands of professionals and students who have benefited from expert guidance.</p>
          <Link href="/signup">
            <Button size="lg" className="bg-primary hover:bg-primary/90 h-12 px-8">
              Sign Up Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">Features</Link></li>
                <li><Link href="#" className="hover:text-foreground">Pricing</Link></li>
                <li><Link href="#" className="hover:text-foreground">Security</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">About</Link></li>
                <li><Link href="#" className="hover:text-foreground">Blog</Link></li>
                <li><Link href="#" className="hover:text-foreground">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">Privacy</Link></li>
                <li><Link href="#" className="hover:text-foreground">Terms</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">Instagram</Link></li>
                <li><Link href="#" className="hover:text-foreground">LinkedIn</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 Worthmate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
