// src/pages/StudyFormPage.tsx
import { FormEvent, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

interface Client { id: number; name: string }

export default function StudyFormPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [clientId, setClientId] = useState<number>()
  const [name, setName] = useState('')
  const [requestedOn, setRequestedOn] = useState('')
  const [error, setError] = useState<string|null>(null)
  const nav = useNavigate()

  useEffect(() => {
    api.get('/water/clients/').then(r => setClients(r.data))
  }, [])

  const handle = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const resp = await api.post('/water/studies/', {
        client_id: clientId,
        name,
        requested_on: requestedOn
      })
      // vamos al detalle del estudio recién creado
      nav(`/dashboard/studies/${resp.data.id}`)
    } catch {
      setError('Error al crear el estudio')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold text-primary-700 mb-4">Nuevo Estudio</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={handle} className="space-y-4">
        <div>
          <label>Cliente</label>
          <select
            required
            className="w-full border p-2 rounded"
            onChange={e => setClientId(Number(e.target.value))}
          >
            <option value="">Selecciona...</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label>Nombre *</label>
          <input
            type="text" required
            className="w-full border p-2 rounded"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div>
          <label>Fecha solicitada *</label>
          <input
            type="date" required
            className="w-full border p-2 rounded"
            value={requestedOn}
            onChange={e => setRequestedOn(e.target.value)}
          />
        </div>
        <button className="bg-primary-600 text-white py-2 px-4 rounded">
          Crear Estudio
        </button>
      </form>
    </div>
  )
}
