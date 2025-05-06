// src/components/Sidebar.tsx

import { NavLink, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'

export default function Sidebar() {
  const { logout, user } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const menuItems = [
    { label: 'Clientes',       to: '/dashboard/clients',          roles: ['admin','manager'] },
    { label: 'Puntos de Muestra', to: '/dashboard/sampling-points', roles: ['admin','operator'] },
    { label: 'Estudios',       to: '/dashboard/studies',          roles: ['admin','scientist'] },
    { label: 'Análisis',       to: '/dashboard/analyses',         roles: ['admin','scientist'] },
    { label: 'Resultados',     to: '/dashboard/results',          roles: ['admin','operator'] },
    { label: 'Reportes',       to: '/dashboard/reports',          roles: ['manager'] }
  ]

  const allowedItems = user
  ? menuItems.filter(item =>
      item.roles.some(role => user.roles.includes(role))
    )
  : []
  
  return (
    <aside className="w-64 bg-white shadow-lg h-screen sticky top-0 p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold text-primary-700 mb-6">WaterLab</h2>

        <nav className="space-y-2">
        {allowedItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block py-2 px-4 rounded-lg transition ${
                isActive ? 'bg-primary-100 text-primary-800' : 'hover:bg-primary-50'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
        </nav>

        <button
                onClick={handleLogout}
                className="block w-full text-left py-2 px-4 rounded-lg hover:bg-red-100 text-red-600 transition"
              >
                Cerrar sesión
              </button>
      </div>
    </aside>
)
}
