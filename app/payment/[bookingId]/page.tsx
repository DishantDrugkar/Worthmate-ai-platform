'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type Booking = {
  id: string
  mentorName: string
  amount: number
  mentorQrCode: string
}

export default function PaymentPage() {
  const params = useParams()
  const router = useRouter()

  // ✅ SAFE PARAM
  const bookingId = Array.isArray(params?.bookingId)
    ? params.bookingId[0]
    : params?.bookingId

  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!bookingId) return
    fetchBooking(bookingId)
  }, [bookingId])

  const fetchBooking = async (id: string) => {
    try {
      setLoading(true)
      setError(null)

      // ✅ TOKEN CHECK
      const token = localStorage.getItem('token')

      if (!token) {
        setError('Please login first')
        setLoading(false)
        return
      }

      const res = await fetch(
        `http://localhost:8080/api/bookings/${id}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      // ✅ STATUS DEBUG
      console.log('STATUS:', res.status)

      const contentType = res.headers.get('content-type')

      // ❗ If backend error page (HTML)
      if (!contentType?.includes('application/json')) {
        const text = await res.text()
        console.error('Non-JSON Response:', text)
        setError('Server error (not JSON response)')
        return
      }

      const data = await res.json()
      console.log('BOOKING DATA:', data)

      if (!res.ok) {
        setError(data?.message || 'Failed to load booking')
        return
      }

      if (!data) {
        setError('Booking not found')
        return
      }

      setBooking(data)

    } catch (err) {
      console.error('FETCH ERROR:', err)
      setError('Network error or server not reachable')
    } finally {
      setLoading(false)
    }
  }

  // ✅ UI STATES

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-600">
        Loading payment...
      </p>
    )
  }

  if (error) {
    return (
      <p className="text-center mt-10 text-red-500">
        {error}
      </p>
    )
  }

  if (!booking) {
    return (
      <p className="text-center mt-10">
        No booking found
      </p>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">

      <Card className="w-full max-w-lg p-6 space-y-6 shadow-xl rounded-2xl">

        <h1 className="text-xl font-bold text-center text-blue-600">
          Payment Dashboard
        </h1>

        {/* Mentor Info */}
        <div className="text-center">
          <h2 className="text-lg font-semibold">
            {booking.mentorName}
          </h2>

          <p className="text-sm text-gray-500">
            Booking ID: {booking.id}
          </p>
        </div>

        {/* Amount */}
        <div className="text-center bg-green-50 p-4 rounded-lg border">
          <p className="text-sm text-gray-600">Total Amount</p>
          <p className="text-3xl font-bold text-green-600">
            ₹ {booking.amount}
          </p>
        </div>

        {/* QR */}
        <div className="flex flex-col items-center">
          <p className="font-medium mb-3">Scan to Pay</p>

          <img
            src={booking.mentorQrCode || 'https://via.placeholder.com/200'}
            alt="QR Code"
            className="w-52 h-52 border rounded-lg p-2 bg-white"
          />

          <p className="text-xs text-gray-500 mt-2">
            Pay via UPI / GPay / PhonePe
          </p>
        </div>

        {/* Button */}
        <Button
          className="w-full"
          onClick={() => router.push('/mentors')}
        >
          I have completed payment
        </Button>

      </Card>
    </div>
  )
}