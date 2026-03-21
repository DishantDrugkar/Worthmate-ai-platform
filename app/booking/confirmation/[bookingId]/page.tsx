'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CheckCircle, Calendar, Clock, MapPin, Copy } from 'lucide-react'
import { useParams } from 'next/navigation'

interface BookingDetails {
  id: string
  mentorName: string
  dateTime: string
  duration: number
  roomUrl: string
  problemCategory: string
}

export default function ConfirmationPage() {
  const params = useParams()
  const bookingId = params.bookingId as string
  const [booking, setBooking] = useState<BookingDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchBookingDetails()
  }, [])

  const fetchBookingDetails = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/bookings/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setBooking(data)
      }
    } catch (err) {
      // Demo data
      const date = new Date()
      date.setDate(date.getDate() + 3)
      setBooking({
        id: bookingId,
        mentorName: 'Sarah Johnson',
        dateTime: date.toISOString(),
        duration: 60,
        roomUrl: 'https://agora-meeting.worthmate.io/room/xyz123',
        problemCategory: 'Career Growth',
      })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 flex items-center justify-center">
        <p className="text-muted-foreground">Loading confirmation...</p>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground text-lg mb-4">Booking not found</p>
          <Link href="/mentors">
            <Button className="bg-primary hover:bg-primary/90">Back to Mentors</Button>
          </Link>
        </div>
      </div>
    )
  }

  const bookingDate = new Date(booking.dateTime)
  const formattedDate = bookingDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const formattedTime = bookingDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })

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
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <CheckCircle className="h-16 w-16 text-green-600 fill-green-50" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-3">Booking Confirmed!</h1>
            <p className="text-lg text-muted-foreground">Your consultation has been scheduled successfully</p>
          </div>

          {/* Booking Details */}
          <Card className="border-border p-8 mb-8">
            <div className="space-y-6">
              <div className="pb-6 border-b border-border">
                <h2 className="text-2xl font-semibold text-foreground mb-1">
                  {booking.mentorName}
                </h2>
                <p className="text-muted-foreground">
                  {booking.problemCategory}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="text-lg font-semibold text-foreground">{formattedDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="text-lg font-semibold text-foreground">{formattedTime} (60 minutes)</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Meeting Link</p>
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-secondary/30 px-3 py-2 rounded text-foreground break-all">
                        {booking.roomUrl}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(booking.roomUrl)}
                        className="flex-shrink-0"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    {copied && <p className="text-xs text-green-600 mt-1">Copied to clipboard!</p>}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Next Steps */}
          <Card className="border-border p-8 mb-8 bg-secondary/5">
            <h3 className="text-lg font-semibold text-foreground mb-4">What's Next?</h3>
            <ol className="space-y-3">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                  1
                </span>
                <span className="text-foreground pt-0.5">A confirmation email has been sent to your inbox</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                  2
                </span>
                <span className="text-foreground pt-0.5">Join the meeting 5 minutes before the scheduled time</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                  3
                </span>
                <span className="text-foreground pt-0.5">After the call, you'll receive a feedback form - please fill it out to help others</span>
              </li>
            </ol>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              className="flex-1 bg-primary hover:bg-primary/90 h-11"
              onClick={() => window.open(booking.roomUrl, '_blank')}
            >
              Join Meeting Room
            </Button>
            <Link href="/mentors" className="flex-1">
              <Button variant="outline" className="w-full h-11">
                Browse More Mentors
              </Button>
            </Link>
          </div>

          {/* Important Notes */}
          <Card className="border-border p-6 mt-8 bg-blue-50 border-blue-200">
            <h4 className="font-semibold text-foreground mb-2">Important Reminders</h4>
            <ul className="space-y-2 text-sm text-foreground">
              <li>• Check your internet connection before the call</li>
              <li>• Have your camera and microphone ready</li>
              <li>• Prepare any questions or materials you want to discuss</li>
              <li>• Be on time - mentors may have back-to-back consultations</li>
            </ul>
          </Card>
        </div>
      </section>
    </div>
  )
}
