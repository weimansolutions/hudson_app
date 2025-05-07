// src/pages/users/RolesPage.tsx
import React, { useState, useEffect } from 'react'
import axios from 'axios'

interface Role {
  id: number
  name: string
}

const RolesPage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    axios
      .get<Role[]>('/api/hudson/roles')
      .then(res => setRoles(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Cargando roles...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Roles</h1>
      <ul className="list-disc pl-6">
        {roles.map(r => (
          <li key={r.id}>{r.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default RolesPage