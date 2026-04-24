'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

declare global {
  interface Window {
    Razorpay: any
  }
}

type Booking = {
  id: string
  mentorName: string
  amount: number
  mentorQrCode: string
  availabilityId: string
  userId: string
  mentorId: string
}

export default function PaymentPage() {
  const params = useParams()
  const router = useRouter()

  const bookingId = Array.isArray(params?.bookingId)
    ? params.bookingId[0]
    : params?.bookingId

  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (!bookingId) return
    fetchBooking(bookingId)
  }, [bookingId])

  // ✅ FIXED FUNCTION (IMPORTANT)
  const fetchBooking = async (id: string) => {
    try {
      setLoading(true)

      const token = localStorage.getItem('token')

      const res = await fetch(
        `http://localhost:8080/api/bookings/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const text = await res.text()

      let data: any = null
      try {
        data = text ? JSON.parse(text) : null
      } catch (err) {
        console.error('Invalid JSON:', text)
        setError('Server response error')
        return
      }

      if (!res.ok) {
        setError(data?.message || 'Booking not found')
        return
      }

      setBooking(data)

    } catch (err) {
      console.error(err)
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  // ✅ LOAD RAZORPAY
  const loadRazorpay = () => {
    return new Promise<boolean>((resolve) => {
      if (window.Razorpay) return resolve(true)

      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  // ✅ PAYMENT FLOW
  const payNow = async () => {
    if (!booking || processing) return

    setProcessing(true)

    const loaded = await loadRazorpay()
    if (!loaded) {
      alert('Razorpay SDK failed')
      setProcessing(false)
      return
    }

    const token = localStorage.getItem('token')

    try {
      const orderRes = await fetch(
        'http://localhost:8080/api/payment/create-order',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            availabilityId: booking.availabilityId,
            mentorId: booking.mentorId,
            amount: booking.amount,
          }),
        }
      )

      const text = await orderRes.text()

      let orderData: any = {}
      try {
        orderData = text ? JSON.parse(text) : {}
      } catch {
        alert('Invalid order response')
        setProcessing(false)
        return
      }

      if (!orderRes.ok) {
        alert(orderData?.error || 'Order failed')
        setProcessing(false)
        return
      }

      const options = {
        key: 'rzp_test_SgtlyTffgHyHOq',
        amount: orderData.amount,
        currency: 'INR',
        name: 'WorthMate',
        description: 'Booking Payment',
        order_id: orderData.orderId,

        handler: async function (response: any) {
          try {
            const verifyRes = await fetch(
              'http://localhost:8080/api/payment/verify',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              }
            )

            if (verifyRes.ok) {
              alert('🎉 Payment Successful')
              router.push('/user/bookings')
            } else {
              alert('Verification failed')
            }
          } catch {
            alert('Verification error')
          }
        },

        theme: { color: '#22c55e' },
      }

      new window.Razorpay(options).open()

    } catch (err) {
      console.error(err)
      alert('Payment error')
    } finally {
      setProcessing(false)
    }
  }

  // UI
  if (loading) return <p className="text-center mt-10">Loading...</p>
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>
  if (!booking) return <p className="text-center mt-10">No booking found</p>

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">

      <Card className="w-full max-w-lg p-6 space-y-6 shadow-xl">

        <h1 className="text-xl font-bold text-center text-blue-600">
          Payment Dashboard
        </h1>

        <div className="text-center">
          <h2>{booking.mentorName}</h2>
          <p>Booking ID: {booking.id}</p>
        </div>

        <div className="text-center bg-green-50 p-4 rounded-lg border">
          <p>Total Amount</p>
          <p className="text-3xl font-bold text-green-600">
            ₹ {booking.amount}
          </p>
        </div>

        <img src={booking.mentorQrCode} className="w-52 h-52 mx-auto" />

        <Button
          onClick={payNow}
          disabled={processing}
          className="w-full bg-green-600"
        >
          {processing ? 'Processing...' : 'Pay Now'}
        </Button>

      </Card>
    </div>
  )
}