// src/pages/ResultsPage.tsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'

interface Result { id: number; value: string; unit?: string }
export default function ResultsPage() {
  const [list, setList] = useState<Result[]>([])
  useEffect(() => { api.get('/water/results/').then(r=>setList(r.data)) }, [])
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold text-primary-700">Resultados</h1>
        <Link to="/dashboard/results/new" className="bg-primary-600 text-white px-4 py-2 rounded">
          + Nuevo Resultado
        </Link>
      </div>
      <ul className="space-y-2">
        {list.map(r => (
          <li key={r.id} className="bg-white p-4 rounded shadow flex justify-between">
            <span>{r.value} {r.unit||''}</span>
            <Link to={`/dashboard/results/${r.id}`} className="text-primary-600 hover:underline">Ver</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
