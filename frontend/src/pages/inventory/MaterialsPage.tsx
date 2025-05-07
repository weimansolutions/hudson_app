// src/pages/inventory/MaterialsPage.tsx
import React, { useState, useEffect } from 'react'
import axios from 'axios'

interface Material {
  id: number
  name: string
  quantity: number
}

const MaterialsPage: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    axios
      .get<Material[]>('/api/hudson/materials')
      .then(res => setMaterials(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Cargando materiales...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Materiales</h1>
      <ul className="list-disc pl-6">
        {materials.map(m => (
          <li key={m.id}>{m.name} - {m.quantity}</li>
        ))}
      </ul>
    </div>
  )
}

export default MaterialsPage