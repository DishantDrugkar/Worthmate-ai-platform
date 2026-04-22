'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function PaymentPage() {
  const params = useParams()
  const router = useRouter()

  const bookingId = params?.bookingId as string

  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!bookingId) return
    fetchBooking()
  }, [bookingId])

  const fetchBooking = async () => {
    try {
      setLoading(true)

      const token = localStorage.getItem('token')

      const res = await fetch(
        `http://localhost:8080/api/bookings/${bookingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      // ❗ SAFE CHECK (important fix for JSON error)
      const text = await res.text()

      if (!res.ok) {
        setError('Failed to load booking')
        console.error(text)
        return
      }

      const data = JSON.parse(text)
      setBooking(data)

    } catch (err) {
      console.error('Error:', err)
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

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

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">

      <Card className="w-full max-w-lg p-6 space-y-6 shadow-xl rounded-2xl">

        {/* TITLE */}
        <h1 className="text-xl font-bold text-center text-blue-600">
          Payment Dashboard
        </h1>

        {/* MENTOR INFO */}
        <div className="text-center">
          <h2 className="text-lg font-semibold">
            {booking?.mentorName}
          </h2>

          <p className="text-sm text-gray-500">
            Booking ID: {bookingId}
          </p>
        </div>

        {/* AMOUNT */}
        <div className="text-center bg-green-50 p-4 rounded-lg border">
          <p className="text-sm text-gray-600">Total Amount</p>
          <p className="text-3xl font-bold text-green-600">
            ₹ {booking?.amount || 0}
          </p>
        </div>

        {/* QR CODE */}
        <div className="flex flex-col items-center">

          <p className="font-medium mb-3">
            Scan to Pay
          </p>

          <img
            src={booking?.mentorQrCode || 'https://via.placeholder.com/200'}
            alt="QR Code"
            className="w-52 h-52 object-contain border rounded-lg p-2 bg-white shadow"
          />

          <p className="text-xs text-gray-500 mt-2">
            Pay using UPI / Google Pay / PhonePe
          </p>

        </div>

        {/* BUTTON */}
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