// src/pages/inventory/CountsPage.tsx
import React, { useState, useEffect } from 'react'
import axios from 'axios'

interface Count {
  id: number
  location: string
  total: number
}

const CountsPage: React.FC = () => {
  const [counts, setCounts] = useState<Count[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    axios
      .get<Count[]>('/api/hudson/counts')
      .then(res => setCounts(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Cargando conteos...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Conteos de Inventario</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border">ID</th>
            <th className="py-2 px-4 border">Ubicación</th>
            <th className="py-2 px-4 border">Total</th>
          </tr>
        </thead>
        <tbody>
          {counts.map(c => (
            <tr key={c.id}>
              <td className="py-2 px-4 border">{c.id}</td>
              <td className="py-2 px-4 border">{c.location}</td>
              <td className="py-2 px-4 border">{c.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CountsPage