import { createContext, useState, useEffect, ReactNode } from 'react'
import api, { setAuthToken } from '../api'

// Definimos la interfaz del usuario incluyendo roles
export interface User {
  id: number
  username: string
  email?: string
  full_name?: string
  roles: string[]
}

interface AuthContextType {
  token: string | null
  user: User | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  login: async () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => localStorage.getItem('token'))
  const [user, setUser] = useState<User | null>(null)

  // Cada vez que cambie el token, actualizamos el header y tratamos de obtener el usuario
  useEffect(() => {
    if (token) {
      setAuthToken(token)
      fetchCurrentUser()
    } else {
      setAuthToken(null)
      setUser(null)
    }
  }, [token])

  // Obtiene datos del usuario (incluyendo roles)
  const fetchCurrentUser = async () => {
    try {
      const response = await api.get<User>('/users/me')
      setUser(response.data)
    } catch (error) {
      console.error('Error fetching user:', error)
      // Si falla, limpiamos credenciales
      setAuthToken(null)
      localStorage.removeItem('token')
      setTokenState(null)
    }
  }

  // Login: solicita token, guarda y dispara fetchCurrentUser()
  const login = async (username: string, password: string) => {
    try {
      // Asegúrate de que el servidor espere form-data URL encoded
      const payload = new URLSearchParams()
      payload.append('username', username)
      payload.append('password', password)

      const response = await api.post('/auth/token', payload, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })

      const newToken = response.data.access_token
      // Guardamos token y actualizamos estado
      setAuthToken(newToken)
      localStorage.setItem('token', newToken)
      setTokenState(newToken)
      // fetchCurrentUser será llamado automáticamente en el useEffect
    } catch (error) {
      // Limpiamos en caso de error (credenciales inválidas)
      setAuthToken(null)
      localStorage.removeItem('token')
      setTokenState(null)
      // Repropagamos para que el componente de Login lo capture y muestre alerta
      throw error
    }
  }

  const logout = () => {
    setAuthToken(null)
    localStorage.removeItem('token')
    setTokenState(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
