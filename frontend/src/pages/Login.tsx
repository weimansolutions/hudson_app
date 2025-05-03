import { FormEvent, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await login(username, password)
      navigate('/dashboard')
    } catch {
      alert('Credenciales inválidas')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-16">
      <div className="px-6 py-8">
        <h2 className="text-2xl font-bold text-center text-secondary mb-6">Iniciar sesión</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Usuario</label>
            <input
              type="text"
              className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-accent"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700">Contraseña</label>
            <input
              type="password"
              className="w-full mt-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-accent"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-secondary-500 hover:bg-secondary-700 text-white py-2 px-4 rounded"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  )
}
