// src/pages/AnalysisFormPage.tsx
import { FormEvent, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

interface Study { id: number; name: string }
interface SamplingPoint { id: number; code: string }

export default function AnalysisFormPage() {
  const [studies, setStudies] = useState<Study[]>([])
  const [points, setPoints] = useState<SamplingPoint[]>([])
  const [studyId, setStudyId] = useState<number>()
  const [pointId, setPointId] = useState<number>()
  const [param, setParam] = useState('')
  const [method, setMethod] = useState('')
  const [error, setError] = useState<string|null>(null)
  const nav = useNavigate()

  useEffect(() => {
    api.get('/water/studies/').then(r=>setStudies(r.data))
    api.get('/water/sampling_points/').then(r=>setPoints(r.data))
  }, [])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await api.post('/water/analyses/', {
        study_id: studyId, sampling_point_id: pointId, parameter: param, method
      })
      nav('/dashboard/analyses')
    } catch {
      setError('Error al crear análisis')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold text-primary-700 mb-4">Nuevo Análisis</h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label>Estudio</label>
          <select onChange={e=>setStudyId(Number(e.target.value))} className="w-full border p-2 rounded">
            <option value="">Selecciona</option>
            {studies.map(s=> <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label>Punto</label>
          <select onChange={e=>setPointId(Number(e.target.value))} className="w-full border p-2 rounded">
            <option value="">Selecciona</option>
            {points.map(p=> <option key={p.id} value={p.id}>{p.code}</option>)}
          </select>
        </div>
        <div>
          <label>Parámetro *</label>
          <input type="text" required className="w-full border p-2 rounded" value={param} onChange={e=>setParam(e.target.value)}/>
        </div>
        <div>
          <label>Método</label>
          <input type="text" className="w-full border p-2 rounded" value={method} onChange={e=>setMethod(e.target.value)}/>
        </div>
        <button className="bg-primary-600 text-white py-2 px-4 rounded">Crear Análisis</button>
      </form>
    </div>
  )
}
