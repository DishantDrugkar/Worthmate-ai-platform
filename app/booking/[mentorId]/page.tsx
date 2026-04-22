'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'

interface Mentor {
  id: string
  firstName: string
  lastName: string
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

  const mentorId = params?.mentorId as string

  const [mentor, setMentor] = useState<Mentor | null>(null)
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(true)

  // =========================
  // FETCH DATA SAFE
  // =========================
  useEffect(() => {
    if (!mentorId) return

    const loadData = async () => {
      try {
        setLoading(true)

        await Promise.all([fetchMentor(), fetchAllSlots()])

      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [mentorId])

  // =========================
  // FETCH MENTOR
  // =========================
  const fetchMentor = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/mentors/${mentorId}`
      )

      if (!res.ok) throw new Error('Mentor not found')

      const data = await res.json()
      setMentor(data)

    } catch (err) {
      console.error('Mentor error:', err)
      setMentor(null)
    }
  }

  // =========================
  // FETCH SLOTS
  // =========================
  const fetchAllSlots = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/mentors/${mentorId}/availability/all`
      )

      if (!res.ok) throw new Error('Slots not found')

      const data = await res.json()
      setSlots(data)

    } catch (err) {
      console.error('Slots error:', err)
      setSlots([])
    }
  }

  // =========================
  // FORMAT TIME
  // =========================
  const formatDateTime = (date: string, time: string) => {
    const d = new Date(date)

    const formattedDate = d.toLocaleDateString('en-GB')
    const day = d.toLocaleDateString('en-US', {
      weekday: 'long'
    }).toUpperCase()

    const start = time.slice(0, 5)

    const [h, m] = time.split(':')
    const endDate = new Date()
    endDate.setHours(Number(h) + 1)
    endDate.setMinutes(Number(m))

    const end = endDate.toTimeString().slice(0, 5)

    return `${formattedDate}  ${start} - ${end} (${day})`
  }

  // =========================
  // BOOK SLOT → PAYMENT
  // =========================
  const handleBook = async (slotId: string) => {
    try {
      const res = await fetch('http://localhost:8080/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          availabilityId: slotId,
          problemCategory: 'general',
          problemDescription: 'Quick booking',
        }),
      })

      if (!res.ok) {
        alert('Booking failed')
        return
      }

      const data = await res.json()

      // 👉 redirect to payment page
      router.push(`/payment/${data.bookingId}`)

    } catch (err) {
      console.error(err)
      alert('Something went wrong')
    }
  }

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <p className="text-center mt-10">
        Loading...
      </p>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-8 py-4 bg-white shadow-sm sticky top-0 z-50">
        <h1
          className="text-xl font-bold text-blue-600 cursor-pointer"
          onClick={() => router.push('/')}
        >
          Worthmate
        </h1>
      </div>

      {/* MAIN */}
      <div className="max-w-5xl mx-auto py-10">

        {/* TITLE */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold mb-6"
        >
          Book Session with {mentor?.firstName} {mentor?.lastName}
        </motion.h1>

        {/* SLOTS */}
        <Card className="p-6 space-y-4 shadow-lg">

          {slots.length === 0 ? (
            <p>No slots available</p>
          ) : (
            slots.map((slot, index) => (
              <motion.div
                key={slot.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex justify-between items-center border p-4 rounded-xl bg-white hover:shadow-md transition"
              >

                {/* LEFT */}
                <div>
                  <p className="font-medium text-gray-800">
                    {formatDateTime(slot.date, slot.time)}
                  </p>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-4">

                  <span
                    className={`text-sm font-semibold ${
                      slot.booked ? 'text-red-500' : 'text-green-600'
                    }`}
                  >
                    {slot.booked ? 'Booked' : 'Available'}
                  </span>

                  {!slot.booked && (
                    <Button
                      onClick={() => handleBook(slot.id)}
                    >
                      Book Now
                    </Button>
                  )}

                </div>

              </motion.div>
            ))
          )}

        </Card>
      </div>
    </div>
  )
}