'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, Trash2, User } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Slot {
  id: string
  date: string
  time: string
  booked: boolean
}

export default function MentorDashboard() {
  const router = useRouter()

  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(true)
  const [mentorId, setMentorId] = useState<string | null>(null)

  // ✅ Get mentor
  useEffect(() => {
    const storedUser = localStorage.getItem('user')

    if (!storedUser) {
      router.push('/login')
      return
    }

    const user = JSON.parse(storedUser)

    if (user?.userId) {
      setMentorId(user.userId)
    } else {
      router.push('/login')
    }
  }, [])

  // ✅ Fetch slots
  useEffect(() => {
    if (mentorId) fetchSlots()
  }, [mentorId])

  const fetchSlots = async () => {
    try {
      const token = localStorage.getItem('token')

      const res = await fetch(
        `http://localhost:8080/api/mentors/${mentorId}/availability/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await res.json()
      setSlots(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // ✅ DELETE SLOT
  const deleteSlot = async (slotId: string) => {
    try {
      const token = localStorage.getItem('token')

      const res = await fetch(
        `http://localhost:8080/api/mentors/availability/${slotId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (!res.ok) {
        console.error("❌ Delete failed")
        return
      }

      setSlots(prev => prev.filter(slot => slot.id !== slotId))

    } catch (err) {
      console.error(err)
    }
  }

  // ✅ LOGOUT
  const handleLogout = () => {
    localStorage.clear()
    router.push('/login')
  }

  if (loading) return <p className="text-center mt-10">Loading...</p>

  return (
    <div className="min-h-screen bg-gray-50">

      {/* 🔥 NAVBAR */}
      <div className="flex justify-between items-center px-8 py-4 bg-white shadow">

        {/* LEFT - LOGO */}
        <h1
          className="text-xl font-bold text-blue-600 cursor-pointer"
          onClick={() => router.push('/')}
        >
          Worthmate
        </h1>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          {/* 🔥 VIEW BOOKINGS (NEW BUTTON) */}
          <Button
            variant="outline"
            onClick={() => router.push('/mentor/bookings')}
          >
            📋 View Bookings
          </Button>

          {/* PROFILE */}
          <Button
            variant="outline"
            onClick={() => router.push('/mentor/profile')}
          >
            <User size={16} className="mr-2" />
            Profile
          </Button>

          {/* LOGOUT */}
          <Button
            variant="destructive"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-6xl mx-auto py-10 space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold">Mentor Dashboard</h1>
          <p className="text-gray-500">Manage your availability</p>
        </div>

        {/* 🔥 STATS */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4">
            <p>Total Slots</p>
            <h2 className="text-xl font-bold">{slots.length}</h2>
          </Card>

          <Card className="p-4">
            <p>Booked</p>
            <h2 className="text-xl font-bold text-red-500">
              {slots.filter(s => s.booked).length}
            </h2>
          </Card>

          <Card className="p-4">
            <p>Available</p>
            <h2 className="text-xl font-bold text-green-600">
              {slots.filter(s => !s.booked).length}
            </h2>
          </Card>
        </div>

        {/* SLOTS */}
        <Card className="p-4">
          <h2 className="text-xl mb-3 flex items-center gap-2">
            <Calendar size={18} /> All Slots
          </h2>

          {slots.length === 0 ? (
            <p>No slots available</p>
          ) : (
            <div className="grid gap-2">
              {slots.map(slot => (
                <div
                  key={slot.id}
                  className="flex justify-between items-center border p-3 rounded"
                >
                  <span className="flex items-center gap-2">
                    <Clock size={16} />
                    {slot.date} - {slot.time.slice(0, 5)}
                  </span>

                  <div className="flex items-center gap-3">

                    <span className={slot.booked ? 'text-red-500' : 'text-green-600'}>
                      {slot.booked ? 'Booked' : 'Available'}
                    </span>

                    {!slot.booked && (
                      <button
                        onClick={() => deleteSlot(slot.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}

                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* ACTION */}
        <Button onClick={() => router.push('/mentor/availability')}>
          ➕ Generate Slots
        </Button>

      </div>
    </div>
  )
}