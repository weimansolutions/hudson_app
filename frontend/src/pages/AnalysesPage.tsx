// src/pages/AnalysesPage.tsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'

interface Analysis {
  id: number
  parameter: string
  method?: string
}
export default function AnalysesPage() {
  const [list, setList] = useState<Analysis[]>([])
  useEffect(() => { api.get('/water/analyses/').then(r=>setList(r.data)) }, [])
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold text-primary-700">Análisis</h1>
        <Link to="/dashboard/analyses/new" className="bg-primary-600 text-white px-4 py-2 rounded">
          + Nuevo Análisis
        </Link>
      </div>
      <ul className="space-y-2">
        {list.map(a => (
          <li key={a.id} className="bg-white p-4 rounded shadow flex justify-between">
            <span>{a.parameter}</span>
            <Link to={`/dashboard/analyses/${a.id}`} className="text-primary-600 hover:underline">
              Ver
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
