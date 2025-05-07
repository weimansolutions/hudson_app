import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from './contexts/AuthContext'
import Home from './pages/Home'
import Login from './pages/Login'
import DashboardLayout from './pages/DashboardLayout'
import { menuGroups } from './config/menu'

function App() {
  const { token } = useContext(AuthContext)

  return (
    <BrowserRouter>
      <header>…</header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={token ? <Navigate to="/dashboard/clients" /> : <Login />}
          />

          {/* Rutas protegidas */}
          <Route
            path="/dashboard/*"
            element={token ? <DashboardLayout /> : <Navigate to="/login" />}
          >
            {/* Redirección por defecto */}
            <Route index element={<Navigate to="clients" replace />} />

            {/* Generamos las rutas por cada item de cada grupo */}
            {menuGroups.flatMap(group =>
              group.items.map(item => {
                // extraemos la parte después de "/dashboard/"
                const subPath = item.to.replace('/dashboard/', '')
                const Component = item.component
                return (
                  <Route key={subPath} path={subPath} element={<Component />} />
                )
              })
            )}

          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App