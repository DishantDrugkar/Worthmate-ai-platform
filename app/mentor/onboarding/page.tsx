'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function MentorOnboarding() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    skills: '',
    experience: '',
    hourlyRate: '',
    linkedin: '',
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('') // ✅ NEW

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('http://localhost:8080/api/mentors/complete-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          skills: formData.skills,
          experience: parseInt(formData.experience),
          hourlyRate: parseInt(formData.hourlyRate),
          linkedin: formData.linkedin,
        }),
      })

      if (!res.ok) {
       const errorText = await res.text()
       console.log(errorText)
       setMessage(`❌ ${errorText}`)
}

      // ✅ SUCCESS MESSAGE (AUTO HIDE)
      setMessage('✅ Profile completed successfully 🚀')

      setTimeout(() => {
        setMessage('')
        router.push('/mentors')
      }, 1000)

    } catch (err) {
      console.error(err)
      setMessage('❌ Something went wrong')
      setTimeout(() => setMessage(''), 1000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">

        {/* ✅ MESSAGE UI */}
       {message && (
  <div
    className={`mb-4 p-2 text-center rounded font-medium ${
      message.includes('❌')
        ? 'bg-red-100 text-red-700'
        : 'bg-green-100 text-green-700'
    }`}
  >
    {message}
  </div>
)}

        <h2 className="text-2xl font-bold mb-6">Complete Your Profile</h2>

        <input
          type="text"
          name="skills"
          placeholder="Skills (e.g. Java, Spring Boot)"
          value={formData.skills}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded text-blue-600 placeholder-blue-400"
          required
        />

        <input
          type="number"
          name="experience"
          placeholder="Experience (years)"
          value={formData.experience}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <input
          type="number"
          name="hourlyRate"
          placeholder="Hourly Rate (₹)"
          value={formData.hourlyRate}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <input
          type="text"
          name="linkedin"
          placeholder="LinkedIn Profile URL"
          value={formData.linkedin}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Complete Profile'}
        </button>
      </form>
    </div>
  )
}