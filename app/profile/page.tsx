'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ProfilePage() {
  const router = useRouter()

  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    profilePic: ''
  })

  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')

    // ✅ ONLY redirect if NO token
    if (!token) {
      router.push('/login')
      return
    }

    fetchProfile(token)
  }, [])

  const fetchProfile = async (token: string) => {
    try {
        console.log("Sending token:", token)

      const res = await fetch('http://localhost:8080/api/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      
      if (!res.ok) {
        console.log("Profile API failed:", res.status)
        return
      }

      const data = await res.json()
       console.log("PROFILE DATA:", data)

      setUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        profilePic: data.profilePic || ''
      })

    } catch (err) {
      console.error(err)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      console.log("UPDATE TOKEN:", token)
      const res = await fetch('http://localhost:8080/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: user.firstName,
          lastName: user.lastName,
        }),
      })

      if (!res.ok) {
        setMessage('❌ Update failed')
        return
      }

       await fetchProfile(token!)

      setMessage('✅ Profile updated successfully')

      setTimeout(() => {
        setMessage('')
        router.push('/mentors')
    }, 1000)

    } catch (err) {
      setMessage('❌ Error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: any) => {
  const file = e.target.files[0]

  if (!file) {
    console.log("No file selected")
    return
  }

  console.log("FILE SELECTED:", file)

  const formData = new FormData()
  formData.append("file", file)

  try {
    const token = localStorage.getItem("token")

    const res = await fetch('http://localhost:8080/api/auth/upload-profile-pic', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    // 🔥 DEBUG
    const text = await res.text()
    console.log("UPLOAD RESPONSE:", text)

    if (!res.ok) {
      console.error("Upload failed:", text)
      return
    }

    const data = JSON.parse(text)

    // ✅ UI update
    setUser((prev) => ({
      ...prev,
      profilePic: data.imageUrl,
    }))

  } catch (err) {
    console.error("Upload error:", err)
  }
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-100">

      {/* Navbar */}
      <nav className="w-full bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-blue-600 text-white flex items-center justify-center rounded-lg font-bold">W</div>
          <span className="text-xl font-bold">Worthmate</span>
        </Link>
      </nav>

      {/* Profile Card */}
      <div className="flex flex-col items-center mb-8">

  <div className="relative w-32 h-32 group">
    
    <img
      src={user.profilePic || 'https://via.placeholder.com/150'}
      alt="profile"
      className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg"
    />

    {/* Overlay */}
    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm font-medium transition">
      Change
    </div>

    {/* File input */}
    <input
      type="file"
      accept="image/*"
      onChange={handleImageUpload}
      className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
    />
  </div>

  <h2 className="text-2xl font-bold mt-4">
    {user.firstName} {user.lastName}
  </h2>

  <p className="text-gray-500">{user.email}</p>
</div>
          {/* Message */}
          {message && (
            <div className="mb-6 text-center text-sm font-medium px-4 py-2 rounded-lg bg-green-100 text-green-700">
              {message}
            </div>
          )}

          {/* Form */}
         <form onSubmit={handleUpdate} className="space-y-6">

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    
    <div>
      <label className="text-sm font-medium text-gray-600">First Name</label>
      <input
        type="text"
        value={user.firstName}
        onChange={(e) => setUser({ ...user, firstName: e.target.value })}
        className="w-full mt-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div>
      <label className="text-sm font-medium text-gray-600">Last Name</label>
      <input
        type="text"
        value={user.lastName}
        onChange={(e) => setUser({ ...user, lastName: e.target.value })}
        className="w-full mt-1 p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

  </div>

  <div>
    <label className="text-sm font-medium text-gray-600">Email</label>
    <input
      type="email"
      value={user.email}
      disabled
      className="w-full mt-1 p-3 border rounded-xl bg-gray-100"
    />
  </div>

  <button
    type="submit"
    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition"
    disabled={loading}
  >
    {loading ? 'Updating...' : 'Update Profile'}
  </button>
</form>
        </div>
      
  )
}