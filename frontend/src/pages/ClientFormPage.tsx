// src/pages/ClientFormPage.tsx

import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

export default function ClientFormPage() {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await api.post('/water/clients/', {
        name,
        address: address || undefined,
        contact_email: contactEmail || undefined
      })
      navigate('/dashboard/clients')
    } catch {
      setError('No se pudo crear el cliente. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-xl p-8">
      <h1 className="text-2xl font-bold text-primary-700 mb-6">Nuevo Cliente</h1>

      {error && (
        <p className="mb-4 text-red-600 bg-red-100 p-3 rounded">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Nombre *</label>
          <input
            type="text"
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Dirección</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            value={address}
            onChange={e => setAddress(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Correo de Contacto</label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            value={contactEmail}
            onChange={e => setContactEmail(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between mt-6">
          <button
            type="submit"
            disabled={loading}
            className={`bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-lg transition ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Creando...' : 'Crear Cliente'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard/clients')}
            className="text-gray-600 hover:underline"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
