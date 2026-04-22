'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.message || 'Login failed')
        return
      }

      const data = await response.json()

      // 🔥 DEBUG (IMPORTANT)
      console.log("🔥 LOGIN RESPONSE:", data)

      // ✅ SAFE extraction (handles all backend formats)
      const userId = data.userId || data?.user?.id
      const userEmail = data.email || data?.user?.email

      if (!userId) {
        console.error("❌ userId not found in response")
        setError("Invalid login response from server")
        return
      }

      // ✅ Store data properly
      localStorage.setItem('token', data.token)
      localStorage.setItem('userRole', data.role)

      localStorage.setItem(
        'user',
        JSON.stringify({
          userId: userId,
          email: userEmail,
          role: data.role
        })
      )

      // ✅ Redirect
      if (data.role === 'MENTOR') {
        router.push('/mentor/dashboard')
      } else if (data.role === 'ADMIN') {
        router.push('/admin/dashboard')
      } else {
        router.push('/mentors')
      }

    } catch (err) {
      console.error("❌ Login Error:", err)
      setError('Server Error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold mx-auto mb-4 text-xl">
            W
          </div>
          <h1 className="text-3xl font-bold text-foreground">Worthmate</h1>
          <p className="text-muted-foreground mt-2">Sign in to your account</p>
        </div>

        {/* Login Card */}
        <Card className="border-border p-8">
          <form onSubmit={handleLogin} className="space-y-6">

            {error && (
              <div className="flex gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Password</label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {/* Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

          </form>

          {/* Signup */}
          <div className="mt-6 text-center text-sm">
            Don't have an account?{' '}
            <Link href="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </div>
        </Card>

        {/* Demo */}
        <div className="mt-8 p-4 bg-secondary/10 border rounded-lg">
          <p className="text-xs text-center">
            <strong>Demo:</strong> Use backend credentials
          </p>
        </div>

      </div>
    </div>
  )
}