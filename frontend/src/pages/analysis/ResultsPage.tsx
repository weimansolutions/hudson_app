// src/pages/analysis/ResultsPage.tsx
import React, { useState, useEffect } from 'react'
import axios from 'axios'

interface Result {
  id: number
  samplePoint: string
  value: number
}

const ResultsPage: React.FC = () => {
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    axios
      .get<Result[]>('/api/hudson/results')
      .then(res => setResults(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Cargando resultados...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Resultados de Análisis</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border">ID</th>
            <th className="py-2 px-4 border">Punto de Muestreo</th>
            <th className="py-2 px-4 border">Valor</th>
          </tr>
        </thead>
        <tbody>
          {results.map(r => (
            <tr key={r.id}>
              <td className="py-2 px-4 border">{r.id}</td>
              <td className="py-2 px-4 border">{r.samplePoint}</td>
              <td className="py-2 px-4 border">{r.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ResultsPage