import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="text-center py-20">
      <h1 className="text-5xl font-extrabold mb-6 text-primary">Bienvenido a WaterLab</h1>
      <p className="text-lg text-gray-600 mb-8">
        Administra clientes, puntos de muestreo y genera informes de análisis de agua de forma sencilla.
      </p>
      <Link
        to="/login"
        className="inline-block bg-primary-500 text-white p-6 rounded"
      >
        Iniciar sesión
      </Link>
    </div>
  )
}
