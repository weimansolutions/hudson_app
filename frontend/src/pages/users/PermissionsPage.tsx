// src/pages/users/PermissionsPage.tsx
import React, { useState, useEffect } from 'react'
import axios from 'axios'

interface Permission {
  id: number
  action: string
}

const PermissionsPage: React.FC = () => {
  const [perms, setPerms] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    axios
      .get<Permission[]>('/api/hudson/permissions')
      .then(res => setPerms(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Cargando permisos...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Permisos</h1>
      <ul className="list-disc pl-6">
        {perms.map(p => (
          <li key={p.id}>{p.action}</li>
        ))}
      </ul>
    </div>
  )
}

export default PermissionsPage