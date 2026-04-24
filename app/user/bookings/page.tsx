'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface Booking {
  id: string
  date: string
  time: string
  status: string
  meetingLink: string
}

export default function UserBookingsPage() {
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
    fetchBookings(user.userId)
  }, [])

  const fetchBookings = async (userId: string) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/bookings/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )

      const data = await res.json()

      // 🔥 remove past bookings
      const today = new Date().toISOString().split('T')[0]

      const filtered = data.filter((b: Booking) => b.date >= today)

      setBookings(filtered)

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <p className="text-center mt-10">Loading...</p>

  return (
    <div className="min-h-screen bg-gray-50 p-6">

      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

      {bookings.length === 0 ? (
        <Card className="p-6 text-center">No bookings found</Card>
      ) : (
        <div className="space-y-4">
          {bookings.map(b => (
            <Card key={b.id} className="p-4 flex justify-between items-center">

              <div>
                <p><b>Date:</b> {b.date}</p>
                <p><b>Time:</b> {b.time}</p>
              </div>

              <div className="flex flex-col items-end gap-2">

                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  {b.status}
                </span>

                {b.meetingLink && (
                  <a
                    href={b.meetingLink}
                    target="_blank"
                    className="px-4 py-1.5 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                  >
                    Join Meeting
                  </a>
                )}

              </div>

            </Card>
          ))}
        </div>
      )}

    </div>
  )
}