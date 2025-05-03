// src/pages/StudyDetailPage.tsx
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api'

interface SamplingPoint { id: number; code: string }
interface Analysis { id: number; parameter: string }
interface Study {
  id: number
  name: string
  requested_on: string
  client: { id: number; name: string }
  // tras cargar el detalle:
  sampling_points: SamplingPoint[]
  analyses: Analysis[]
}

export default function StudyDetailPage() {
  const { studyId } = useParams<{ studyId: string }>()
  const [study, setStudy] = useState<Study|null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/water/studies/${studyId}`)
      .then(r => setStudy(r.data))
      .finally(() => setLoading(false))
  }, [studyId])

  if (loading) return <p>Cargando estudio…</p>
  if (!study) return <p>No se encontró el estudio</p>

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-primary-700">{study.name}</h1>
        <Link
          to={`/dashboard/studies/${study.id}/results/new`}
          className="bg-primary-600 text-white px-4 py-2 rounded"
        >
          + Registrar Resultado
        </Link>
      </header>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Puntos de muestreo</h2>
        <ul className="list-disc pl-5">
          {study.sampling_points.map(p => (
            <li key={p.id}>{p.code}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Análisis disponibles</h2>
        <ul className="list-disc pl-5">
          {study.analyses.map(a => (
            <li key={a.id}>{a.parameter}</li>
          ))}
        </ul>
      </section>
    </div>
  )
}
