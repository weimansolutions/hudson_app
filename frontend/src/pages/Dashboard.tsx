// src/pages/Dashboard.tsx
import { useEffect, useState } from 'react'
import api from '../api'

interface User {
  id: number
  username: string
  email?: string
  full_name?: string
  roles?: string[]
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.get<User>('/users/me')
      .then(resp => setUser(resp.data))
      .catch(() => setError('Error al cargar datos del usuario'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <svg
          className="animate-spin h-8 w-8 text-primary-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          />
        </svg>
      </div>
    )
  }

  if (error) {
    return <p className="text-center text-red-600 mt-8">{error}</p>
  }

  if (!user) {
    return <p className="text-center text-gray-500 mt-8">Usuario no encontrado.</p>
  }

  return (
    <div className="space-y-8">
      <h1 className="text-5xl font-extrabold text-primary-700">Dashboard</h1>

      <section>
        <h2 className="text-3xl font-semibold text-primary-600 mb-6">Mi Perfil</h2>
        <div className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition">
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Usuario:</strong> {user.username}</p>
          {user.full_name && <p><strong>Nombre:</strong> {user.full_name}</p>}
          {user.email && <p><strong>Email:</strong> {user.email}</p>}
          {user.roles && (
            <p><strong>Roles:</strong> {user.roles.join(', ')}</p>
          )}
        </div>
      </section>
    </div>
  )
}