// src/pages/SamplingPointsPage.tsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'

interface SamplingPoint {
  id: number
  code: string
  location?: string
}

export default function SamplingPointsPage() {
  const [points, setPoints] = useState<SamplingPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.get('/water/sampling_points/')
      .then(r => setPoints(r.data))
      .catch(() => setError('No se pudieron cargar los puntos'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Cargando puntos…</p>
  if (error) return <p className="text-red-600">{error}</p>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary-700">Puntos de Muestreo</h1>
        <Link
          to="/dashboard/sampling-points/new"
          className="bg-primary-600 text-white px-4 py-2 rounded"
        >
          + Nuevo Punto
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {points.map(p => (
          <div key={p.id} className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold">{p.code}</h2>
            {p.location && <p className="text-gray-500">{p.location}</p>}
            <Link
              to={`/dashboard/sampling-points/${p.id}`}
              className="text-primary-600 hover:underline mt-2 block"
            >
              Ver detalle
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
