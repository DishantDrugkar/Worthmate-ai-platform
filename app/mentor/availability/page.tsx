'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function AvailabilityGenerator() {
   const router = useRouter()  
  const [days, setDays] = useState<string[]>([])
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const toggleDay = (day: string) => {
    setDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    )
  }

  const handleSubmit = async () => {
  setMessage('')

  if (!days.length || !startTime || !endTime) {
    setMessage('❌ Please fill all fields')
    return
  }

  if (startTime >= endTime) {
    setMessage('❌ Start time must be before end time')
    return
  }

  setLoading(true)

  try {
    const res = await fetch('http://localhost:8080/api/mentors/availability/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        days,
        startTime,
        endTime,
      }),
    })

    const text = await res.text()

    if (!res.ok) {
      setMessage(`❌ ${text}`)
      return
    }

    setMessage('✅ Slots Generated! Redirecting...')

    // 🔥 IMPORTANT
    setTimeout(() => {
      router.push('/mentor/dashboard') // ya booking page
    }, 1500)

  } catch (err) {
    console.error(err)
    setMessage('❌ Server error')
  } finally {
    setLoading(false)
  }
}

  const allDays = [
    'MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'
  ]

  return (
    <div className="max-w-xl mx-auto py-10 space-y-6">
      <h1 className="text-2xl font-bold">Set Weekly Availability</h1>

      {/* Days */}
      <div>
        <p className="mb-2 font-medium">Select Working Days</p>
        <div className="flex flex-wrap gap-2">
          {allDays.map(day => (
            <button
              type="button" // ✅ IMPORTANT
              key={day}
              onClick={() => toggleDay(day)}
              className={`px-3 py-1 rounded transition ${
                days.includes(day)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {day.slice(0,3)}
            </button>
          ))}
        </div>
      </div>

      {/* Time */}
      <div>
        <p className="font-medium">Start Time</p>
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="border p-2 w-full rounded"
        />
      </div>

      <div>
        <p className="font-medium">End Time</p>
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="border p-2 w-full rounded"
        />
      </div>

      {/* Button */}
      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Slots (Next 7 Days)'}
      </Button>

      {/* Message */}
      {message && (
        <p
          className={`font-medium ${
            message.includes('❌') ? 'text-red-600' : 'text-green-600'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  )
}