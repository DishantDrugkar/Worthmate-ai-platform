'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useRouter, useParams } from 'next/navigation'
import { AlertCircle, CheckCircle, Calendar, Clock } from 'lucide-react'

interface Mentor {
  id: string
  firstName: string
  lastName: string
  title: string
  hourlyRate: number
  expertise: string[]
}

interface TimeSlot {
  date: string
  time: string
  available: boolean
}

export default function BookingPage() {
  const router = useRouter()
  const params = useParams()
  const mentorId = params.mentorId as string

  const [mentor, setMentor] = useState<Mentor | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [problemCategory, setProblemCategory] = useState('')
  const [problemDescription, setProblemDescription] = useState('')
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [booking, setBooking] = useState(false)

  useEffect(() => {
    fetchMentorDetails()
  }, [])

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots()
    }
  }, [selectedDate])

  const fetchMentorDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/mentors/${mentorId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setMentor(data)
      }
    } catch (err) {
      // Demo data
      setMentor({
        id: mentorId,
        firstName: 'Sarah',
        lastName: 'Johnson',
        title: 'Senior Product Manager at Google',
        hourlyRate: 150,
        expertise: ['Product Management', 'Strategy', 'Leadership'],
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailableSlots = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/mentors/${mentorId}/availability?date=${selectedDate}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          credentials: 'include',
        }
      )

      if (response.ok) {
        const data = await response.json()
        setTimeSlots(data)
      }
    } catch (err) {
      // Demo data - generate mock time slots
      const slots: TimeSlot[] = []
      for (let hour = 9; hour < 17; hour++) {
        slots.push({
          date: selectedDate,
          time: `${String(hour).padStart(2, '0')}:00`,
          available: Math.random() > 0.3,
        })
      }
      setTimeSlots(slots)
    }
  }

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!selectedDate || !selectedTime || !problemCategory) {
      setError('Please fill in all required fields')
      return
    }

    setBooking(true)

    try {
      const response = await fetch('http://localhost:8080/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          mentorId,
          dateTime: `${selectedDate}T${selectedTime}:00`,
          problemCategory,
          problemDescription,
          duration: 60, // 1 hour
        }),
        credentials: 'include',
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.message || 'Booking failed')
        return
      }

      const data = await response.json()
      setSuccess(true)
      setTimeout(() => {
        router.push(`/booking/confirmation/${data.bookingId}`)
      }, 1500)
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setBooking(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 flex items-center justify-center">
        <p className="text-muted-foreground">Loading mentor details...</p>
      </div>
    )
  }

  if (!mentor) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground text-lg mb-4">Mentor not found</p>
          <Link href="/mentors">
            <Button className="bg-primary hover:bg-primary/90">Back to Mentors</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      {/* Navigation */}
      <nav className="sticky top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/mentors" className="flex items-center gap-2 text-primary hover:text-primary/80">
            ← Back to Mentors
          </Link>
        </div>
      </nav>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-8">Book a Consultation</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Mentor Summary */}
            <Card className="border-border p-6 md:col-span-1 h-fit sticky top-24">
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                  {mentor.firstName[0]}{mentor.lastName[0]}
                </div>
                <h2 className="text-xl font-semibold text-foreground">
                  {mentor.firstName} {mentor.lastName}
                </h2>
                <p className="text-sm text-primary mt-1">{mentor.title}</p>
              </div>

              <div className="border-t border-border pt-6">
                <p className="text-xs text-muted-foreground mb-2">Hourly Rate</p>
                <p className="text-2xl font-bold text-foreground">${mentor.hourlyRate}</p>
              </div>

              <div className="mt-6">
                <p className="text-xs text-muted-foreground mb-3">Expertise</p>
                <div className="space-y-2">
                  {mentor.expertise.map(exp => (
                    <div key={exp} className="text-sm text-foreground">
                      • {exp}
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Booking Form */}
            <Card className="border-border p-6 md:col-span-2">
              <form onSubmit={handleBooking} className="space-y-6">
                {error && (
                  <div className="flex gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="flex gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-800">Booking confirmed! Redirecting...</p>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Problem Category *</label>
                  <select
                    value={problemCategory}
                    onChange={(e) => setProblemCategory(e.target.value)}
                    required
                    disabled={booking}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select a category</option>
                    <option value="career">Career Growth</option>
                    <option value="startup">Startup & Fundraising</option>
                    <option value="technical">Technical Skills</option>
                    <option value="leadership">Leadership & Management</option>
                    <option value="business">Business Strategy</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Problem Description *</label>
                  <textarea
                    value={problemDescription}
                    onChange={(e) => setProblemDescription(e.target.value)}
                    placeholder="Describe what you'd like to discuss..."
                    required
                    disabled={booking}
                    rows={4}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Select Date *
                    </label>
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      required
                      disabled={booking}
                      min={new Date().toISOString().split('T')[0]}
                      className="bg-input text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Select Time *
                    </label>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      required
                      disabled={booking || !selectedDate}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select time</option>
                      {timeSlots
                        .filter(slot => slot.available)
                        .map(slot => (
                          <option key={`${slot.date}-${slot.time}`} value={slot.time}>
                            {slot.time}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-foreground">Consultation Fee</span>
                    <span className="font-semibold text-foreground">${mentor.hourlyRate}</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between items-center">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="text-xl font-bold text-primary">${mentor.hourlyRate}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={booking}
                  className="w-full bg-primary hover:bg-primary/90 h-11"
                >
                  {booking ? 'Booking...' : 'Proceed to Payment'}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
