import { useEffect, useState } from 'react'
import api from '../api'

interface Client {
  id: number
  name: string
  contact_email?: string
}

export default function Dashboard() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.get('/water/clients/')
      .then(resp => setClients(resp.data))
      .catch(err => setError('Error al cargar clientes'))
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
            cx="12" cy="12" r="10"
            stroke="currentColor" strokeWidth="4"
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

  return (
    <div className="space-y-8">
      <h1 className="text-5xl font-extrabold text-primary-700">Dashboard</h1>

      <section>
        <h2 className="text-3xl font-semibold text-primary-600 mb-6">Clientes</h2>
        {clients.length === 0 ? (
          <p className="text-center text-gray-500">No hay clientes registrados.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map(client => (
              <ClientCard key={client.id} client={client} />
            ))}
          </div>
        )}
      </section>

      {/* Aquí puedes agregar más secciones para puntos, estudios, etc. */}
    </div>
  )
}

function ClientCard({ client }: { client: Client }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-2xl transition">
      <h3 className="text-2xl font-medium text-primary-800">{client.name}</h3>
      {client.contact_email && (
        <p className="mt-2 text-gray-500">{client.contact_email}</p>
      )}
    </div>
  )
}
