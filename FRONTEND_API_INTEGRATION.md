# Frontend API Integration Guide

This guide explains how the React frontend integrates with the Spring Boot backend API.

## API Base URLs

### Development
```
Frontend: http://localhost:3000
Backend: http://localhost:8080
```

### Production
```
Frontend: https://worthmate.vercel.app (or your Vercel domain)
Backend: https://worthmate-backend.railway.app (or your hosting URL)
```

## Authentication Flow

### 1. Signup
```
POST /api/auth/signup/user
Content-Type: application/json

{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "password": "SecurePassword123"
}

Response:
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "role": "USER",
  "userId": "uuid-string"
}
```

Frontend stores token in localStorage:
```javascript
localStorage.setItem('token', response.token)
localStorage.setItem('userRole', response.role)
```

### 2. Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123"
}

Response:
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "role": "USER",
  "userId": "uuid-string"
}
```

### 3. Protected Requests
All protected endpoints require JWT token in Authorization header:

```javascript
fetch('http://localhost:8080/api/mentors', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
  },
  credentials: 'include'
})
```

## API Endpoints Reference

### Authentication

#### POST /api/auth/signup/user
Register as a regular user.

**Request:**
```json
{
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "password": "string (min 8 chars)"
}
```

**Response:** `AuthResponse`
```json
{
  "token": "string",
  "role": "USER",
  "userId": "string"
}
```

#### POST /api/auth/signup/mentor
Register as a mentor.

**Request:**
```json
{
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "password": "string",
  "title": "string",
  "bio": "string"
}
```

**Response:** `AuthResponse`

#### POST /api/auth/login
User login.

**Request:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:** `AuthResponse`

### Mentors

#### GET /api/mentors
List all mentors with filtering.

**Query Parameters:**
- `page`: int (default: 0)
- `size`: int (default: 10)
- `expertise`: string (filter by expertise)
- `minRating`: double (filter by minimum rating)
- `maxPrice`: double (filter by maximum hourly rate)
- `search`: string (search by name or title)

**Response:** `Page<MentorResponse>`
```json
{
  "content": [
    {
      "id": "uuid",
      "firstName": "string",
      "lastName": "string",
      "title": "string",
      "bio": "string",
      "hourlyRate": 150.00,
      "rating": 4.9,
      "reviewCount": 127,
      "expertise": ["Product Management", "Strategy"],
      "availability": true,
      "aiRecommendationScore": 95,
      "recommendationReason": "string"
    }
  ],
  "totalElements": 45,
  "totalPages": 5,
  "currentPage": 0
}
```

#### GET /api/mentors/{mentorId}
Get detailed mentor profile.

**Response:** `MentorDetailResponse`
```json
{
  "id": "uuid",
  "firstName": "string",
  "lastName": "string",
  "title": "string",
  "bio": "string",
  "hourlyRate": 150.00,
  "yearsOfExperience": 10,
  "expertise": ["string"],
  "rating": 4.9,
  "reviewCount": 127,
  "isVerified": true,
  "linkedinUrl": "string",
  "websiteUrl": "string"
}
```

#### GET /api/mentors/{mentorId}/availability
Get mentor's available time slots.

**Query Parameters:**
- `date`: string (YYYY-MM-DD format)

**Response:**
```json
{
  "mentorId": "uuid",
  "date": "2024-03-25",
  "timeSlots": [
    {
      "time": "09:00",
      "available": true
    },
    {
      "time": "10:00",
      "available": true
    }
  ]
}
```

### Bookings

#### POST /api/bookings
Create a new booking.

**Request:**
```json
{
  "mentorId": "uuid",
  "dateTime": "2024-03-25T14:30:00",
  "problemCategoryId": "uuid",
  "problemDescription": "string",
  "duration": 60
}
```

**Response:** `BookingResponse`
```json
{
  "id": "uuid",
  "mentorId": "uuid",
  "mentorName": "string",
  "scheduledAt": "2024-03-25T14:30:00",
  "status": "SCHEDULED",
  "agoraRoomId": "string",
  "problemCategory": "string"
}
```

#### GET /api/bookings
Get current user's bookings.

**Query Parameters:**
- `status`: string (SCHEDULED, COMPLETED, CANCELLED)
- `page`: int (default: 0)
- `size`: int (default: 10)

**Response:** `Page<BookingResponse>`

#### GET /api/bookings/{bookingId}
Get booking details.

**Response:** `BookingDetailResponse`
```json
{
  "id": "uuid",
  "mentorId": "uuid",
  "mentorName": "string",
  "scheduledAt": "2024-03-25T14:30:00",
  "duration": 60,
  "status": "SCHEDULED",
  "agoraRoomId": "string",
  "roomUrl": "https://agora-meeting.worthmate.io/room/xyz",
  "problemCategory": "string",
  "problemDescription": "string"
}
```

#### PUT /api/bookings/{bookingId}
Cancel a booking.

**Request:**
```json
{
  "cancellationReason": "string (optional)"
}
```

**Response:** `BookingResponse`

### Feedback

#### POST /api/feedback
Submit feedback for completed consultation.

**Request:**
```json
{
  "bookingId": "uuid",
  "rating": 5,
  "comment": "string",
  "wouldRecommend": true,
  "improvementAreas": "string (optional)"
}
```

**Response:** `FeedbackResponse`
```json
{
  "id": "uuid",
  "bookingId": "uuid",
  "rating": 5,
  "comment": "string",
  "createdAt": "2024-03-25T18:45:00"
}
```

#### GET /api/feedback/{bookingId}
Get feedback for specific booking.

**Response:** `FeedbackResponse`

### Recommendations

#### GET /api/recommendations
Get AI recommendations for current user.

**Query Parameters:**
- `page`: int (default: 0)
- `size`: int (default: 10)

**Response:** `Page<RecommendationResponse>`
```json
{
  "content": [
    {
      "mentorId": "uuid",
      "mentorName": "string",
      "category": "string",
      "recommendationScore": 95,
      "recommendationReason": "Based on 43 similar consultations...",
      "similarCallsCount": 43,
      "successRate": 94.2
    }
  ]
}
```

### Payments

#### POST /api/payments
Create payment intent for booking.

**Request:**
```json
{
  "bookingId": "uuid",
  "amount": 150.00,
  "paymentMethodId": "pm_..." (Stripe payment method)
}
```

**Response:** `PaymentResponse`
```json
{
  "paymentIntentId": "pi_...",
  "clientSecret": "string",
  "status": "requires_payment_method"
}
```

#### GET /api/payments/{bookingId}
Get payment status for booking.

**Response:** `PaymentResponse`
```json
{
  "id": "uuid",
  "bookingId": "uuid",
  "amount": 150.00,
  "status": "COMPLETED",
  "paidAt": "2024-03-25T14:00:00"
}
```

## React Hook for API Calls

### useApi Hook Example
```javascript
// hooks/useApi.ts
import { useState, useCallback } from 'react'

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  body?: any
}

export function useApi<T>(
  url: string,
  options: ApiOptions = {}
) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const execute = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem('token')
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers,
      }

      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL || 'http://localhost:8080'}${url}`,
        {
          method: options.method || 'GET',
          headers,
          body: options.body ? JSON.stringify(options.body) : undefined,
          credentials: 'include',
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'API request failed')
      }

      const responseData = await response.json()
      setData(responseData)
      return responseData
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [url, options])

  return { data, error, loading, execute }
}
```

### Using the Hook
```javascript
// In a component
const { data: mentors, loading, error, execute } = useApi('/api/mentors')

useEffect(() => {
  execute()
}, [])

if (loading) return <div>Loading...</div>
if (error) return <div>Error: {error}</div>

return (
  <div>
    {mentors?.map(mentor => (
      <MentorCard key={mentor.id} mentor={mentor} />
    ))}
  </div>
)
```

## Error Handling

All error responses follow this format:

```json
{
  "timestamp": "2024-03-25T18:45:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed",
  "path": "/api/bookings"
}
```

Common HTTP Status Codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized (invalid/missing token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

## Environment Variables

Create `.env` file in React project:

```env
REACT_APP_API_URL=http://localhost:8080
REACT_APP_AGORA_APP_ID=your-agora-app-id
REACT_APP_STRIPE_PUBLIC_KEY=your-stripe-public-key
```

## CORS Configuration

The Spring Boot backend should have CORS enabled for frontend domain:

```java
@CrossOrigin(origins = "${frontend.url:http://localhost:3000}")
```

## Rate Limiting

Implement rate limiting on the frontend to prevent abuse:

```javascript
const throttle = (fn, delay) => {
  let lastCall = 0
  return (...args) => {
    const now = Date.now()
    if (now - lastCall >= delay) {
      lastCall = now
      fn(...args)
    }
  }
}
```

## Token Refresh Logic

Implement automatic token refresh:

```javascript
// utils/auth.ts
export async function refreshTokenIfNeeded() {
  const token = localStorage.getItem('token')
  const tokenExpiry = localStorage.getItem('tokenExpiry')
  
  if (!token || !tokenExpiry) return

  const expiresIn = parseInt(tokenExpiry) - Date.now()
  
  if (expiresIn < 60000) { // Less than 1 minute
    const response = await fetch(`${API_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      localStorage.setItem('token', data.token)
      localStorage.setItem('tokenExpiry', (Date.now() + 15 * 60 * 1000).toString())
    }
  }
}
```

## WebSocket for Real-time Updates (Future Enhancement)

```javascript
// hooks/useWebSocket.ts
export function useWebSocket(url: string, onMessage: (data: any) => void) {
  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}${url}`)
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      onMessage(data)
    }
    
    return () => ws.close()
  }, [url, onMessage])
}

// Usage: Real-time call status updates
useWebSocket('/ws/bookings/notifications', (update) => {
  if (update.type === 'booking-status-changed') {
    refreshBookings()
  }
})
```

## Next Steps

1. Update environment variables in `.env` with your backend URL
2. Implement API integration layer with error handling
3. Add request/response interceptors for logging
4. Implement retry logic for failed requests
5. Add loading states and error boundaries in components
6. Test all API endpoints with Postman or similar tool

