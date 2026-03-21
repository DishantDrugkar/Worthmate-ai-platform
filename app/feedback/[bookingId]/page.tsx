'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useRouter, useParams } from 'next/navigation'
import { AlertCircle, CheckCircle, Star } from 'lucide-react'

interface BookingDetails {
  id: string
  mentorName: string
  scheduledAt: string
  problemCategory: string
}

export default function FeedbackPage() {
  const router = useRouter()
  const params = useParams()
  const bookingId = params.bookingId as string

  const [booking, setBooking] = useState<BookingDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    rating: 0,
    comment: '',
    wouldRecommend: false,
    improvementAreas: '',
  })

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
      setBooking({
        id: bookingId,
        mentorName: 'Sarah Johnson',
        scheduledAt: new Date().toISOString(),
        problemCategory: 'Career Growth',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, wouldRecommend: e.target.checked }))
  }

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.rating === 0) {
      setError('Please select a rating')
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('http://localhost:8080/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          bookingId,
          rating: formData.rating,
          comment: formData.comment,
          wouldRecommend: formData.wouldRecommend,
          improvementAreas: formData.improvementAreas,
        }),
        credentials: 'include',
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.message || 'Failed to submit feedback')
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/mentors')
      }, 2000)
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 flex items-center justify-center">
        <p className="text-muted-foreground">Loading feedback form...</p>
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
            <h1 className="text-4xl font-bold text-foreground mb-3">Share Your Feedback</h1>
            <p className="text-lg text-muted-foreground">
              Your feedback helps us improve and assists other users in finding the right mentor
            </p>
          </div>

          {/* Booking Summary */}
          <Card className="border-border p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">{booking.mentorName}</h2>
                <p className="text-sm text-muted-foreground mt-1">{booking.problemCategory}</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-2xl">
                {booking.mentorName.split(' ').map((n: string) => n[0]).join('')}
              </div>
            </div>
          </Card>

          {/* Feedback Form */}
          <Card className="border-border p-8">
            <form onSubmit={handleSubmitFeedback} className="space-y-8">
              {error && (
                <div className="flex gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              {success && (
                <div className="flex gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-green-800">Feedback submitted successfully! Redirecting...</p>
                </div>
              )}

              {/* Rating */}
              <div>
                <label className="text-lg font-semibold text-foreground block mb-4">
                  How would you rate this consultation? *
                </label>
                <div className="flex gap-4">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, rating }))}
                      disabled={submitting}
                      className="focus:outline-none transition-all"
                    >
                      <Star
                        className={`h-12 w-12 transition-all ${
                          rating <= formData.rating
                            ? 'fill-accent text-accent'
                            : 'text-border'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <div className="mt-3">
                  {formData.rating > 0 && (
                    <p className="text-sm text-muted-foreground">
                      You rated this consultation{' '}
                      <span className="font-semibold text-foreground">
                        {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][formData.rating]}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {/* Comment */}
              <div className="space-y-2">
                <label className="text-lg font-semibold text-foreground">
                  What did you think about the consultation?
                </label>
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleInputChange}
                  placeholder="Share your experience... (optional)"
                  disabled={submitting}
                  rows={5}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Recommendation */}
              <div className="space-y-3">
                <label className="text-lg font-semibold text-foreground flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={formData.wouldRecommend}
                    onChange={handleCheckboxChange}
                    disabled={submitting}
                    className="w-5 h-5 rounded border-border cursor-pointer"
                  />
                  Would you recommend this mentor to others with similar problems?
                </label>
              </div>

              {/* Improvement Areas */}
              <div className="space-y-2">
                <label className="text-lg font-semibold text-foreground">
                  Areas for improvement
                </label>
                <textarea
                  name="improvementAreas"
                  value={formData.improvementAreas}
                  onChange={handleInputChange}
                  placeholder="What could this mentor improve on? (optional)"
                  disabled={submitting}
                  rows={3}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Info Box */}
              <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-4">
                <p className="text-sm text-foreground">
                  <strong>Your feedback is valuable:</strong> It helps us maintain quality standards and assists future users in making informed decisions. All feedback is anonymous and will not be shared with the mentor until they also leave feedback.
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={submitting || formData.rating === 0}
                className="w-full bg-primary hover:bg-primary/90 h-12 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Feedback'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>
                You can also skip this for now and{' '}
                <Link href="/mentors" className="text-primary hover:underline">
                  continue browsing
                </Link>
              </p>
            </div>
          </Card>

          {/* Tips */}
          <Card className="border-border p-6 mt-8 bg-blue-50 border-blue-200">
            <h3 className="font-semibold text-foreground mb-3">Tips for Helpful Feedback</h3>
            <ul className="space-y-2 text-sm text-foreground">
              <li>• Be honest and specific about your experience</li>
              <li>• Mention what went well in the consultation</li>
              <li>• Provide constructive suggestions for improvement</li>
              <li>• Consider the mentor's expertise and communication style</li>
            </ul>
          </Card>
        </div>
      </section>
    </div>
  )
}
