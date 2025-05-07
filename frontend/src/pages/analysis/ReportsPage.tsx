// src/pages/analysis/ReportsPage.tsx
import React, { useState, useEffect } from 'react'
import axios from 'axios'

interface Report {
  id: number
  title: string
  createdAt: string
}

const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    axios
      .get<Report[]>('/api/hudson/reports')
      .then(res => setReports(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Cargando reportes...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Reportes Generados</h1>
      <ul className="list-disc pl-6">
        {reports.map(r => (
          <li key={r.id}>{r.title} - {new Date(r.createdAt).toLocaleDateString()}</li>
        ))}
      </ul>
    </div>
  )
}

export default ReportsPage