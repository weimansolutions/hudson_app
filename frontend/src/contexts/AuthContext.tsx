import { createContext, useState, useEffect, ReactNode } from 'react'
import api, { setAuthToken } from '../api'

interface AuthContextType {
  token: string | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  login: async () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(() => localStorage.getItem('token'))

  useEffect(() => {
    setAuthToken(token)
  }, [token])

  const login = async (username: string, password: string) => {
    const form = new URLSearchParams()
    form.append('username', username)
    form.append('password', password)
    // grant_type, scope, client_id, client_secret no son necesarios; ya tienen valor por defecto en FastAPI
  
    const resp = await api.post(
      '/auth/token',
      form,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    )
    const newToken = resp.data.access_token
    localStorage.setItem('token', newToken)
    setTokenState(newToken)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setTokenState(null)
  }

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
