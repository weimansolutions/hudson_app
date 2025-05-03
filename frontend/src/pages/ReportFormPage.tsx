// src/pages/ReportFormPage.tsx
import { FormEvent, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

interface Study { id: number; name: string }
export default function ReportFormPage() {
  const [studies, setStudies] = useState<Study[]>([])
  const [studyId, setStudyId] = useState<number>()
  const [conclusions, setConclusions] = useState('')
  const nav = useNavigate()

  useEffect(() => { api.get('/water/studies/').then(r=>setStudies(r.data)) }, [])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    await api.post('/water/reports/', { study_id: studyId, conclusions })
    nav('/dashboard/reports')
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold text-primary-700 mb-4">Nuevo Informe</h1>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label>Estudio</label>
          <select onChange={e=>setStudyId(Number(e.target.value))} className="w-full border p-2 rounded">
            <option value="">Selecciona</option>
            {studies.map(s=> <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div>
          <label>Conclusiones *</label>
          <textarea
            required
            className="w-full border p-2 rounded"
            rows={5}
            value={conclusions}
            onChange={e=>setConclusions(e.target.value)}
          />
        </div>
        <button className="bg-primary-600 text-white py-2 px-4 rounded">Crear Informe</button>
      </form>
    </div>
)}
