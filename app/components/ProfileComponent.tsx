'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ProfileComponent() {
  const router = useRouter()

  const [role, setRole] = useState('USER')

  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    profilePic: '',
    hourlyRate: '',
    skills: '',
    experience: '',
    bio: '',
    title: '',
    qrCodeUrl: ''
  })

  const [showPopup, setShowPopup] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userRole = localStorage.getItem('userRole')

    if (!token) {
      router.push('/login')
      return
    }

    setRole(userRole || 'USER')
    fetchProfile(token)
  }, [])

  const fetchProfile = async (token: string) => {
    try {
      const res = await fetch('http://localhost:8080/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })

      const data = await res.json()

      setUser(prev => ({
        ...prev,
        ...data
      }))
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpdate = async (e: any) => {
    e.preventDefault()
    setLoading(true)

    const token = localStorage.getItem('token')

    await fetch('http://localhost:8080/api/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(user)
    })

    setLoading(false)
    setShowPopup(true)

    setTimeout(() => {
      setShowPopup(false)

      if (role === 'MENTOR') {
        router.push('/mentor/dashboard')
      } else {
        router.push('/')
      }
    }, 1000)
  }

  const handleImageUpload = async (e: any) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append("file", file)

    const token = localStorage.getItem('token')

    const res = await fetch('http://localhost:8080/api/auth/upload-profile-pic', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    })

    const data = await res.json()

    setUser(prev => ({
      ...prev,
      profilePic: data.imageUrl
    }))
  }

  const handleQrUpload = async (e: any) => {
    const file = e.target.files[0]

    const formData = new FormData()
    formData.append("file", file)

    const token = localStorage.getItem('token')

    const res = await fetch('http://localhost:8080/api/auth/upload-qr', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    })

    const data = await res.json()

    setUser(prev => ({
      ...prev,
      qrCodeUrl: data.imageUrl || data.qrCodeUrl
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">

      {/* NAVBAR */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white shadow">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-blue-600 text-white flex items-center justify-center rounded-lg font-bold">
            W
          </div>
          <span className="text-xl font-bold">Worthmate</span>
        </Link>
      </nav>

      {showPopup && (
        <div className="fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded-lg">
          Profile Updated ✔
        </div>
      )}

      <div className="max-w-3xl mx-auto mt-10 bg-white shadow-xl rounded-2xl p-8 space-y-6">

        {/* PROFILE PIC */}
        <div className="flex flex-col items-center">
          <div className="relative w-28 h-28">
            <img
              src={user.profilePic || 'https://via.placeholder.com/150'}
              className="w-28 h-28 rounded-full object-cover border-4 border-blue-500"
            />

            <input
              type="file"
              onChange={handleImageUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>

          <h2 className="text-xl font-bold mt-3">
            {user.firstName} {user.lastName}
          </h2>
          <p className="text-gray-500">{user.email}</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleUpdate} className="space-y-5">

          <div className="grid grid-cols-2 gap-4">
            <input
              value={user.firstName}
              onChange={e => setUser({ ...user, firstName: e.target.value })}
              className="p-3 border rounded-xl"
            />

            <input
              value={user.lastName}
              onChange={e => setUser({ ...user, lastName: e.target.value })}
              className="p-3 border rounded-xl"
            />
          </div>

          <input
            value={user.email}
            disabled
            className="w-full p-3 border rounded-xl bg-gray-100"
          />

          {/* MENTOR FIELDS */}
          {role === 'MENTOR' && (
            <>
              <input
                value={user.title}
                onChange={e => setUser({ ...user, title: e.target.value })}
                className="w-full p-3 border rounded-xl"
                placeholder="Title"
              />

              <textarea
                value={user.bio}
                onChange={e => setUser({ ...user, bio: e.target.value })}
                className="w-full p-3 border rounded-xl"
                placeholder="Bio"
              />

              <input
                value={user.skills}
                onChange={e => setUser({ ...user, skills: e.target.value })}
                className="w-full p-3 border rounded-xl"
                placeholder="Skills"
              />

              <input
                value={user.hourlyRate}
                onChange={e => setUser({ ...user, hourlyRate: e.target.value })}
                className="w-full p-3 border rounded-xl"
                placeholder="Price"
              />

              <input type="file" onChange={handleQrUpload} />

              {user.qrCodeUrl && (
                <img src={user.qrCodeUrl} className="w-32 mt-2 border" />
              )}
            </>
          )}

          <button className="w-full bg-blue-600 text-white py-3 rounded-xl">
            {loading ? 'Updating...' : 'Update Profile'}
          </button>

        </form>
      </div>
    </div>
  )
}