// src/pages/ResultFormPage.tsx
import { FormEvent, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api'

interface StudyDetail {
  id: number
  sampling_points: { id: number; code: string }[]
  analyses: { id: number; parameter: string }[]
}

export default function ResultFormPage() {
  const { studyId } = useParams<{ studyId: string }>()
  const [detail, setDetail] = useState<StudyDetail|null>(null)
  const [pointId, setPointId] = useState<number>()
  const [analysisId, setAnalysisId] = useState<number>()
  const [value, setValue] = useState('')
  const [unit, setUnit] = useState('')
  const navigate = useNavigate()

  // Cargamos puntos y análisis del estudio
  useEffect(() => {
    api.get(`/water/studies/${studyId}`)
      .then(r => setDetail(r.data))
  }, [studyId])

  const handle = async (e: FormEvent) => {
    e.preventDefault()
    await api.post('/water/results/', {
      study_id: Number(studyId),
      sampling_point_id: pointId,
      analysis_id: analysisId,
      value,
      unit: unit || undefined
    })
    navigate(`/dashboard/studies/${studyId}`)
  }

  if (!detail) return <p>Cargando datos del estudio…</p>

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold text-primary-700 mb-4">Registrar Resultado</h1>
      <form onSubmit={handle} className="space-y-4">
        <div>
          <label>Punto de muestreo</label>
          <select
            required
            className="w-full border p-2 rounded"
            onChange={e => setPointId(Number(e.target.value))}
          >
            <option value="">Selecciona...</option>
            {detail.sampling_points.map(p => (
              <option key={p.id} value={p.id}>{p.code}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Análisis</label>
          <select
            required
            className="w-full border p-2 rounded"
            onChange={e => setAnalysisId(Number(e.target.value))}
          >
            <option value="">Selecciona...</option>
            {detail.analyses.map(a => (
              <option key={a.id} value={a.id}>{a.parameter}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Valor *</label>
          <input
            type="text" required
            className="w-full border p-2 rounded"
            value={value} onChange={e => setValue(e.target.value)}
          />
        </div>
        <div>
          <label>Unidad</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={unit} onChange={e => setUnit(e.target.value)}
          />
        </div>
        <button className="bg-primary-600 text-white py-2 px-4 rounded">
          Guardar Resultado
        </button>
      </form>
    </div>
  )
}

