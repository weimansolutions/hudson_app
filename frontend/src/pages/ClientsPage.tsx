// src/pages/ClientsPage.tsx

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'

interface Client {
  id: number
  name: string
  contact_email?: string
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.get('/water/clients/')
      .then(resp => setClients(resp.data))
      .catch(() => setError('No se pudieron cargar los clientes'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return <p className="text-center text-red-600 mt-8">{error}</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-primary-700">Clientes</h1>
        <Link
          to="/dashboard/clients/new"
          className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg transition"
        >
          + Nuevo Cliente
        </Link>
      </div>

      {clients.length === 0 ? (
        <p className="text-gray-500">No hay clientes creados aún.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map(client => (
            <div
              key={client.id}
              className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold text-primary-800">{client.name}</h2>
              {client.contact_email && (
                <p className="mt-1 text-gray-600">{client.contact_email}</p>
              )}
              <Link
                to={`/dashboard/clients/${client.id}`}
                className="mt-4 inline-block text-primary-600 hover:underline"
              >
                Ver detalles
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
