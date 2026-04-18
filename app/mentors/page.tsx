'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Star, MapPin, Calendar, MessageSquare } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Mentor {
  id: string
  firstName: string
  lastName: string
  profilePic?: string
  title: string
  bio: string
  rating: number
  reviewCount: number
  hourlyRate: number
  expertise: string[]
  availability: boolean
  aiRecommendationScore?: number
  recommendationReason?: string
}

export default function MentorsPage() {
  const router = useRouter()
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [filteredMentors, setFilteredMentors] = useState<Mentor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'recommendation'>('rating')

  useEffect(() => {
    fetchMentors()
  }, [])

  useEffect(() => {
    filterAndSortMentors()
  }, [mentors, searchTerm, selectedExpertise, sortBy])

  const fetchMentors = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/mentors', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setMentors(data)
      }
    } catch (err) {
      console.error('Error fetching mentors:', err)
      // Demo data
      setMentors([
        {
          id: '1',
          firstName: 'Sarah',
          lastName: 'Johnson',
          title: 'Senior Product Manager at Google',
          bio: 'I help aspiring PMs develop skills in product strategy, user research, and cross-functional leadership.',
          rating: 4.9,
          reviewCount: 127,
          hourlyRate: 150,
          expertise: ['Product Management', 'Strategy', 'Leadership'],
          availability: true,
          aiRecommendationScore: 95,
          recommendationReason: 'Based on 43 similar consultation feedbacks with 94% success rate',
        },
        {
          id: '2',
          firstName: 'Mike',
          lastName: 'Chen',
          title: 'Full Stack Engineer at Meta',
          bio: 'Expert in scaling systems and mentoring junior engineers. Specializing in backend architecture.',
          rating: 4.8,
          reviewCount: 89,
          hourlyRate: 120,
          expertise: ['Backend', 'System Design', 'DevOps'],
          availability: true,
          aiRecommendationScore: 88,
          recommendationReason: 'Highly rated for backend system design consultations',
        },
        {
          id: '3',
          firstName: 'Elena',
          lastName: 'Rodriguez',
          title: 'Startup Founder & Investor',
          bio: 'I mentor early-stage founders on fundraising, business model validation, and growth strategies.',
          rating: 4.7,
          reviewCount: 156,
          hourlyRate: 200,
          expertise: ['Startups', 'Fundraising', 'Growth'],
          availability: true,
          aiRecommendationScore: 92,
          recommendationReason: 'Expert in startup fundraising with consistent positive outcomes',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("userRole")
  router.push("/") // main page pe redirect
}

  const filterAndSortMentors = () => {
    let filtered = mentors.filter(mentor => {
      const matchesSearch =
        mentor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.expertise.some(e => e.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesExpertise =
        selectedExpertise.length === 0 ||
        selectedExpertise.some(exp => mentor.expertise.includes(exp))

      return matchesSearch && matchesExpertise
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.hourlyRate - b.hourlyRate
        case 'recommendation':
          return (b.aiRecommendationScore || 0) - (a.aiRecommendationScore || 0)
        case 'rating':
        default:
          return b.rating - a.rating
      }
    })

    setFilteredMentors(filtered)
  }

  const toggleExpertise = (expertise: string) => {
    setSelectedExpertise(prev =>
      prev.includes(expertise)
        ? prev.filter(e => e !== expertise)
        : [...prev, expertise]
    )
  }

  const handleBooking = (mentorId: string) => {
    router.push(`/booking/${mentorId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      {/* Navigation */}
      <nav className="sticky top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
              W
            </div>
            <span className="text-xl font-bold text-foreground">Worthmate</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/profile">
              <Button variant="ghost">Profile</Button>
            </Link>
            <Button variant="outline" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-3">Find Your Perfect Mentor</h1>
          <p className="text-lg text-muted-foreground">Browse from our network of vetted professionals and book a consultation</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className="lg:col-span-1">
              <Card className="border-border p-6 sticky top-24">
                <h2 className="font-semibold text-foreground mb-4">Filters</h2>
                
                {/* Search */}
                <div className="mb-6">
                  <Input
                    placeholder="Search mentors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-input text-foreground"
                  />
                </div>

                {/* Sort */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-foreground mb-3">Sort By</p>
                  <div className="space-y-2">
                    {['rating', 'price', 'recommendation'].map(option => (
                      <label key={option} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="sort"
                          value={option}
                          checked={sortBy === option}
                          onChange={(e) => setSortBy(e.target.value as any)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-foreground capitalize">
                          {option === 'recommendation' ? 'AI Recommended' : option}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Expertise Filter */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-3">Expertise</p>
                  <div className="space-y-2">
                    {['Product Management', 'Backend', 'System Design', 'Startups', 'Leadership', 'DevOps'].map(expertise => (
                      <label key={expertise} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedExpertise.includes(expertise)}
                          onChange={() => toggleExpertise(expertise)}
                          className="w-4 h-4 rounded border-border"
                        />
                        <span className="text-sm text-foreground">{expertise}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* Mentors Grid */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-muted-foreground">Loading mentors...</p>
                </div>
              ) : filteredMentors.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-muted-foreground">No mentors found matching your criteria</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredMentors.map(mentor => (
                    <Card key={mentor.id} className="border-border p-6 hover:border-primary/50 transition-colors">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Avatar */}
                        <div className="w-20 h-20 rounded-full overflow-hidden border bg-gray-200 flex items-center justify-center flex-shrink-0">
  {mentor.profilePic ? (
    <img
      src={mentor.profilePic}
      alt="mentor"
      className="w-full h-full object-cover"
    />
  ) : (
    <span className="text-xl font-bold text-gray-600">
      {mentor.firstName[0]}{mentor.lastName[0]}
    </span>
  )}
</div>

                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-lg font-semibold text-foreground">
                                {mentor.firstName} {mentor.lastName}
                              </h3>
                              <p className="text-sm text-primary font-medium">{mentor.title}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-foreground">₹{mentor.hourlyRate ?? 0}</p>
                              <p className="text-xs text-muted-foreground">per hour</p>
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground mb-4">{mentor.bio}</p>

                          {/* AI Recommendation Badge */}
                          {mentor.aiRecommendationScore && (
                            <div className="mb-4 p-3 bg-accent/10 border border-accent/30 rounded-lg">
                              <p className="text-sm text-foreground">
                                <strong>AI Recommendation: {mentor.aiRecommendationScore}%</strong>
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {mentor.recommendationReason}
                              </p>
                            </div>
                          )}

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {mentor.expertise.map(exp => (
                              <span
                                key={exp}
                                className="px-3 py-1 bg-secondary/30 text-secondary-foreground text-xs font-medium rounded-full"
                              >
                                {exp}
                              </span>
                            ))}
                          </div>

                          {/* Rating & Reviews */}
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-accent text-accent" />
                              <span className="font-semibold text-foreground">{mentor.rating}</span>
                              <span className="text-sm text-muted-foreground">({mentor.reviewCount} reviews)</span>
                            </div>
                            <Button
                              onClick={() => handleBooking(mentor.id)}
                              className="bg-primary hover:bg-primary/90 ml-auto"
                            >
                              <Calendar className="h-4 w-4 mr-2" />
                              Book Consultation
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
