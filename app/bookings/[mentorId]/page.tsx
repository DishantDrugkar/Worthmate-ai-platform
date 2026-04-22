'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

interface Booking {
  id: string
  userId: string
  mentorId: string
  status: string
  meetingLink: string
  date: string
  time: string
}

export default function MentorBookingsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('user')

    if (!stored) {
      router.push('/login')
      return
    }

    const user = JSON.parse(stored)
    const mentorId = user?.userId

    if (!mentorId) {
      router.push('/login')
      return
    }

    fetchBookings(mentorId)
  }, [])

  const fetchBookings = async (mentorId: string) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/bookings/mentor/${mentorId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )

      const data = await res.json()
      setBookings(data)

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-500">
        Loading bookings...
      </p>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ================= NAVBAR ================= */}
      <div className="flex justify-between items-center px-6 py-4 bg-white shadow-sm sticky top-0 z-50">

        {/* LEFT - LOGO */}
        <h1
          className="text-xl font-bold text-blue-600 cursor-pointer"
          onClick={() => router.push('/')}
        >
          Worthmate
        </h1>

        {/* RIGHT - BACK BUTTON */}
        <Button
          onClick={() => router.push('/mentor/dashboard')}
          className="flex items-center gap-2 bg-gray-900 hover:bg-black"
        >
          <ArrowLeft size={16} />
          Back
        </Button>

      </div>

      {/* ================= MAIN ================= */}
      <div className="max-w-5xl mx-auto py-10 px-4">

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          All Bookings
        </h1>

        {/* EMPTY STATE */}
        {bookings.length === 0 ? (
          <Card className="p-8 text-center text-gray-500 shadow-sm">
            No bookings found
          </Card>
        ) : (
          <div className="space-y-4">

            {bookings.map((b) => (
              <Card
                key={b.id}
                className="p-5 bg-white shadow-md hover:shadow-lg transition rounded-xl"
              >

                <div className="flex justify-between items-center">

                  {/* LEFT */}
                  <div className="space-y-1">
                    <p className="text-gray-700">
                      <span className="font-semibold">Date:</span> {b.date}
                    </p>

                    <p className="text-gray-700">
                      <span className="font-semibold">Time:</span> {b.time}
                    </p>

                    <p className="text-sm text-gray-500">
                      Booking ID: {b.id}
                    </p>
                  </div>

                  {/* RIGHT */}
                  <div className="text-right space-y-2">

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        b.status === 'CONFIRMED'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {b.status}
                    </span>

                    {b.meetingLink && (
                      <div>
                        <a
                          href={b.meetingLink}
                          target="_blank"
                          className="text-blue-600 text-sm underline"
                        >
                          Join Meeting
                        </a>
                      </div>
                    )}

                  </div>

                </div>

              </Card>
            ))}

          </div>
        )}

      </div>
    </div>
  )
}