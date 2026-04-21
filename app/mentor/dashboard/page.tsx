'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react'

interface Slot {
  id: string
  date: string
  time: string
  booked: boolean
}

export default function MentorDashboard() {
  const [slots, setSlots] = useState<Slot[]>([])
  const [loading, setLoading] = useState(true)

  const mentorId = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('user') || '{}')?.id
    : null

  useEffect(() => {
    fetchSlots()
  }, [])

  const fetchSlots = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/mentors/${mentorId}/availability?date=${new Date().toISOString().split('T')[0]}`
      )
      const data = await res.json()
      setSlots(data)
    } catch (err) {
      setSlots([])
    } finally {
      setLoading(false)
    }
  }

  const todaySlots = slots.filter(s => s.date === new Date().toISOString().split('T')[0])
  const upcomingSlots = slots.filter(s => s.date > new Date().toISOString().split('T')[0])

  if (loading) {
    return <p className="text-center mt-10">Loading dashboard...</p>
  }

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Mentor Dashboard</h1>
        <p className="text-gray-500">Manage your availability & sessions</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-gray-500">Total Slots</p>
          <h2 className="text-xl font-bold">{slots.length}</h2>
        </Card>

        <Card className="p-4">
          <p className="text-gray-500">Booked</p>
          <h2 className="text-xl font-bold text-red-500">
            {slots.filter(s => s.booked).length}
          </h2>
        </Card>

        <Card className="p-4">
          <p className="text-gray-500">Available</p>
          <h2 className="text-xl font-bold text-green-600">
            {slots.filter(s => !s.booked).length}
          </h2>
        </Card>
      </div>

      {/* Today Slots */}
      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
          <Calendar size={18} /> Today’s Slots
        </h2>

        {todaySlots.length === 0 ? (
          <p className="text-gray-500">No slots today</p>
        ) : (
          <div className="grid gap-2">
            {todaySlots.map(slot => (
              <div
                key={slot.id}
                className="flex justify-between items-center border p-2 rounded"
              >
                <span className="flex items-center gap-2">
                  <Clock size={16} /> {slot.time}
                </span>

                {slot.booked ? (
                  <span className="text-red-500 flex items-center gap-1">
                    <XCircle size={16} /> Booked
                  </span>
                ) : (
                  <span className="text-green-600 flex items-center gap-1">
                    <CheckCircle size={16} /> Available
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Upcoming Slots */}
      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-3">Upcoming Slots</h2>

        {upcomingSlots.length === 0 ? (
          <p className="text-gray-500">No upcoming slots</p>
        ) : (
          <div className="grid gap-2">
            {upcomingSlots.map(slot => (
              <div
                key={slot.id}
                className="flex justify-between border p-2 rounded"
              >
                <span>
                  {slot.date} - {slot.time}
                </span>

                <span className={slot.booked ? 'text-red-500' : 'text-green-600'}>
                  {slot.booked ? 'Booked' : 'Available'}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={() => window.location.href = '/mentor/availability'}>
          ➕ Generate Slots
        </Button>

        <Button variant="outline" onClick={fetchSlots}>
          🔄 Refresh
        </Button>
      </div>
    </div>
  )
}