// src/pages/users/ClientsPage.tsx
import React, { useState, useEffect } from 'react'
import axios from 'axios'

interface Client {
  id: number
  name: string
  email: string
}

const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    axios
      .get<Client[]>('/api/hudson/clients')
      .then(res => setClients(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Cargando clientes...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Clientes</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border">ID</th>
            <th className="py-2 px-4 border">Nombre</th>
            <th className="py-2 px-4 border">Email</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(c => (
            <tr key={c.id}>
              <td className="py-2 px-4 border">{c.id}</td>
              <td className="py-2 px-4 border">{c.name}</td>
              <td className="py-2 px-4 border">{c.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ClientsPage