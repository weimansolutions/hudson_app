// src/pages/ReportsPage.tsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api'

interface Report { id: number; conclusions: string }
export default function ReportsPage() {
  const [list, setList] = useState<Report[]>([])
  useEffect(() => { api.get('/water/reports/').then(r=>setList(r.data)) }, [])
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold text-primary-700">Informes</h1>
        <Link to="/dashboard/reports/new" className="bg-primary-600 text-white px-4 py-2 rounded">
          + Nuevo Informe
        </Link>
      </div>
      <ul className="space-y-2">
        {list.map(r => (
          <li key={r.id} className="bg-white p-4 rounded shadow flex justify-between">
            <span>{r.conclusions.slice(0, 50)}…</span>
            <Link to={`/dashboard/reports/${r.id}`} className="text-primary-600 hover:underline">Ver</Link>
          </li>
        ))}
      </ul>
    </div>
)}
