// src/pages/SamplingPointFormPage.tsx
import { FormEvent, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
interface Client { id: number; name: string }
export default function SamplingPointFormPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [clientId, setClientId] = useState<number>()
  const [code, setCode] = useState('')
  const [location, setLocation] = useState('')
  const [error, setError] = useState<string|null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // para dropdown de clientes
  useEffect(() => {
    api.get('/water/clients/')
      .then(r => setClients(r.data))
      .catch(() => {})
  }, [])

  const handle = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await api.post('/water/sampling_points/', { client_id: clientId, code, location })
      navigate('/dashboard/sampling-points')
    } catch {
      setError('No se pudo crear el punto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold text-primary-700 mb-4">Nuevo Punto de Muestreo</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={handle} className="space-y-4">
        <div>
          <label className="block text-gray-700">Cliente</label>
          <select
            required
            className="w-full border p-2 rounded"
            onChange={e => setClientId(Number(e.target.value))}
          >
            <option value="">Selecciona</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-gray-700">Código *</label>
          <input
            type="text" required
            className="w-full border p-2 rounded"
            value={code} onChange={e=>setCode(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-gray-700">Ubicación</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={location} onChange={e=>setLocation(e.target.value)}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-primary-600 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Creando…' : 'Crear Punto'}
        </button>
      </form>
    </div>
  )
}
