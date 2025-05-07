// src/App.tsx
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from './contexts/AuthContext'
import Home from './pages/Home'
import Login from './pages/Login'
import DashboardLayout from './pages/DashboardLayout'
import Dashboard from './pages/Dashboard'
import { menuGroups } from './config/menu'

function App() {
  const { token } = useContext(AuthContext)

  return (
    <HashRouter>
      <header>…</header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              token ? <Navigate to="/dashboard" replace /> : <Login />
            }
          />

          {/* Rutas protegidas */}
          <Route
            path="/dashboard/*"
            element={
              token
                ? <DashboardLayout />
                : <Navigate to="/login" replace />
            }
          >
            {/* Ruta por defecto: muestra el Dashboard de usuario */}
            <Route index element={<Dashboard />} />

            {/* Rutas dinámicas desde menuGroups */}
            {menuGroups.flatMap(group =>
              group.items.map(item => {
                const subPath = item.to.replace('/dashboard/', '')
                const Component = item.component
                return (
                  <Route
                    key={subPath}
                    path={subPath}
                    element={<Component />}
                  />
                )
              })
            )}
          </Route>

          {/* Catch-all redirige al Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </HashRouter>
  )
}

export default App
