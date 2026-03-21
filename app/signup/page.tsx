'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { AlertCircle, CheckCircle } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [userType, setUserType] = useState<'user' | 'mentor' | null>(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    title: '', // for mentors
    bio: '', // for mentors
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!userType) {
      setError('Please select a user type')
      return
    }

    setLoading(true)

    try {
      const endpoint = userType === 'mentor' ? '/api/auth/signup/mentor' : '/api/auth/signup/user'
      const response = await fetch(`http://localhost:8080${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          ...(userType === 'mentor' && {
            title: formData.title,
            bio: formData.bio,
          }),
        }),
        credentials: 'include',
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.message || 'Signup failed')
        return
      }

      const data = await response.json()
      localStorage.setItem('token', data.token)
      localStorage.setItem('userRole', userType === 'mentor' ? 'MENTOR' : 'USER')
      
      router.push(userType === 'mentor' ? '/mentor/onboarding' : '/mentors')
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 py-12 px-4">
      <div className="w-full max-w-2xl mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold mx-auto mb-4 text-xl">
            W
          </div>
          <h1 className="text-3xl font-bold text-foreground">Worthmate</h1>
          <p className="text-muted-foreground mt-2">Create your account</p>
        </div>

        {/* User Type Selection */}
        {!userType && (
          <Card className="border-border p-8 mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-6">Choose Your Account Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setUserType('user')}
                className="p-6 border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left"
              >
                <h3 className="font-semibold text-foreground mb-2">I'm Looking for Guidance</h3>
                <p className="text-sm text-muted-foreground">Book consultations with experts and get recommendations</p>
              </button>
              <button
                onClick={() => setUserType('mentor')}
                className="p-6 border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left"
              >
                <h3 className="font-semibold text-foreground mb-2">I'm an Expert Mentor</h3>
                <p className="text-sm text-muted-foreground">Share your expertise and help others grow</p>
              </button>
            </div>
          </Card>
        )}

        {/* Signup Form */}
        {userType && (
          <Card className="border-border p-8">
            <div className="flex items-center gap-2 mb-6 pb-6 border-b border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setUserType(null)}
                className="text-primary"
              >
                ← Back
              </Button>
              <h2 className="text-lg font-semibold text-foreground">
                {userType === 'mentor' ? 'Become a Mentor' : 'Create User Account'}
              </h2>
            </div>

            <form onSubmit={handleSignup} className="space-y-6">
              {error && (
                <div className="flex gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">First Name</label>
                  <Input
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    className="bg-input text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Last Name</label>
                  <Input
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    className="bg-input text-foreground"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email Address</label>
                <Input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="bg-input text-foreground"
                />
              </div>

              {userType === 'mentor' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Professional Title</label>
                    <Input
                      name="title"
                      placeholder="e.g., Senior Product Manager"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                      className="bg-input text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Bio</label>
                    <textarea
                      name="bio"
                      placeholder="Tell us about your expertise..."
                      value={formData.bio}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                      rows={4}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password</label>
                <Input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="bg-input text-foreground"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Confirm Password</label>
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="bg-input text-foreground"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 h-10"
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </Card>
        )}

        {/* Demo Info */}
        <div className="mt-8 p-4 bg-secondary/10 border border-border rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            <strong>Demo:</strong> This signup form will connect to Spring Boot backend in production
          </p>
        </div>
      </div>
    </div>
  )
}
