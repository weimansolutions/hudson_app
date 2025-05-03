// src/components/Sidebar.tsx

import { NavLink, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'

export default function Sidebar() {
  const { logout, token } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="w-64 bg-white shadow-lg h-screen sticky top-0 p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold text-primary-700 mb-6">WaterLab</h2>

        <nav className="space-y-2">
          <NavLink
            to="/dashboard/clients"
            className={({ isActive }) =>
              `block py-2 px-4 rounded-lg transition ${
                isActive ? 'bg-primary-100 text-primary-800' : 'hover:bg-primary-50'
              }`
            }
          >
            Clientes
          </NavLink>

          <NavLink
            to="/dashboard/sampling-points"
            className={({ isActive }) =>
              `block py-2 px-4 rounded-lg transition ${
                isActive ? 'bg-primary-100 text-primary-800' : 'hover:bg-primary-50'
              }`
            }
          >
            Puntos de muestreo
          </NavLink>

          <NavLink
            to="/dashboard/studies"
            className={({ isActive }) =>
              `block py-2 px-4 rounded-lg transition ${
                isActive ? 'bg-primary-100 text-primary-800' : 'hover:bg-primary-50'
              }`
            }
          >
            Estudios
          </NavLink>

          <NavLink
            to="/dashboard/analyses"
            className={({ isActive }) =>
              `block py-2 px-4 rounded-lg transition ${
                isActive ? 'bg-primary-100 text-primary-800' : 'hover:bg-primary-50'
              }`
            }
          >
            Análisis
          </NavLink>

          <NavLink
            to="/dashboard/results"
            className={({ isActive }) =>
              `block py-2 px-4 rounded-lg transition ${
                isActive ? 'bg-primary-100 text-primary-800' : 'hover:bg-primary-50'
              }`
            }
          >
            Resultados
          </NavLink>

          <NavLink
            to="/dashboard/reports"
            className={({ isActive }) =>
              `block py-2 px-4 rounded-lg transition ${
                isActive ? 'bg-primary-100 text-primary-800' : 'hover:bg-primary-50'
              }`
            }
          >
            Informes
          </NavLink>
        </nav>

        {token && (
          <>
            <div className="mt-8 border-t pt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                Administración
              </p>
              <NavLink
                to="/dashboard/users"
                className={({ isActive }) =>
                  `block py-2 px-4 rounded-lg transition ${
                    isActive ? 'bg-primary-100 text-primary-800' : 'hover:bg-primary-50'
                  }`
                }
              >
                Usuarios
              </NavLink>
              <NavLink
                to="/dashboard/roles"
                className={({ isActive }) =>
                  `block py-2 px-4 rounded-lg transition ${
                    isActive ? 'bg-primary-100 text-primary-800' : 'hover:bg-primary-50'
                  }`
                }
              >
                Roles & Permisos
              </NavLink>
            </div>

            <div className="mt-8 border-t pt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                Cuenta
              </p>
              <NavLink
                to="/dashboard/profile"
                className={({ isActive }) =>
                  `block py-2 px-4 rounded-lg transition ${
                    isActive ? 'bg-primary-100 text-primary-800' : 'hover:bg-primary-50'
                  }`
                }
              >
                Perfil
              </NavLink>
              <button
                onClick={handleLogout}
                className="block w-full text-left py-2 px-4 rounded-lg hover:bg-red-100 text-red-600 transition"
              >
                Cerrar sesión
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
)
}
