'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useRouter, useParams } from 'next/navigation'

interface Mentor {
  id: string
  firstName: string
  lastName: string
  title: string
  hourlyRate: number
  expertise: string[]
}

interface TimeSlot {
  id: string
  date: string
  time: string
  booked: boolean
}

export default function BookingPage() {
  const router = useRouter()
  const params = useParams()
  const mentorId = params.mentorId as string

  const [mentor, setMentor] = useState<Mentor | null>(null)
  const [loading, setLoading] = useState(true)

  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSlotId, setSelectedSlotId] = useState('')
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
    } else {
      setTimeSlots([])
      setSelectedSlotId('')
    }
  }, [selectedDate])

  const fetchMentorDetails = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/mentors/${mentorId}`)
      const data = await res.json()
      setMentor(data)
    } catch {
      setMentor({
        id: mentorId,
        firstName: 'Demo',
        lastName: 'Mentor',
        title: 'Software Engineer',
        hourlyRate: 100,
        expertise: ['Tech'],
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchAvailableSlots = async () => {
    try {
      console.log("Selected Date (frontend):", selectedDate)

      const res = await fetch(
        `http://localhost:8080/api/mentors/${mentorId}/availability?date=${selectedDate}`
      )

      const data = await res.json()

      console.log("Slots from backend:", data)

      setTimeSlots(Array.isArray(data) ? data : [])
      setSelectedSlotId('')
    } catch (err) {
      console.log(err)
      setTimeSlots([])
    }
  }

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!selectedSlotId || !problemCategory) {
      setError('Please select slot and category')
      return
    }

    setBooking(true)

    try {
      const res = await fetch('http://localhost:8080/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          availabilityId: selectedSlotId,
          problemCategory,
          problemDescription,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        setError(err.message || 'Booking failed')
        return
      }

      const data = await res.json()
      setSuccess(true)

      setTimeout(() => {
        router.push(`/booking/confirmation/${data.bookingId}`)
      }, 1200)

    } catch {
      setError('Something went wrong')
    } finally {
      setBooking(false)
    }
  }

  if (loading) return <p className="text-center mt-10">Loading...</p>

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Book Session</h1>

      <Card className="p-6">
        <form onSubmit={handleBooking} className="space-y-5">

          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-600">Booking Success!</p>}

          {/* Category */}
          <select
            value={problemCategory}
            onChange={(e) => setProblemCategory(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">Select Category</option>
            <option value="career">Career</option>
            <option value="technical">Technical</option>
          </select>

          {/* Description */}
          <textarea
            placeholder="Describe problem"
            value={problemDescription}
            onChange={(e) => setProblemDescription(e.target.value)}
            className="w-full border p-2 rounded"
          />

          {/* Date */}
          <Input
            type="date"
            value={selectedDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => {
              const date = e.target.value
              setSelectedDate(date)   // ✅ FIXED (no timezone issue)
            }}
          />

          {/* Slots */}
          <select
            value={selectedSlotId}
            onChange={(e) => setSelectedSlotId(e.target.value)}
            className="w-full border p-2 rounded"
            disabled={!selectedDate}
          >
            <option value="">Select Slot</option>

            {timeSlots.length === 0 ? (
              <option disabled>No slots available</option>
            ) : (
              timeSlots.map(slot => (
                <option key={slot.id} value={slot.id}>
                  {slot.time?.slice(0, 5)} {slot.booked ? '(Booked)' : ''}
                </option>
              ))
            )}
          </select>

          {/* No slots message */}
          {selectedDate && timeSlots.length === 0 && (
            <p className="text-red-500 text-sm">
              No slots available for this date
            </p>
          )}

          <Button type="submit" disabled={booking}>
            {booking ? 'Booking...' : 'Book Now'}
          </Button>

        </form>
      </Card>
    </div>
  )
}