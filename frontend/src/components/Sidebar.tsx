// src/components/Sidebar.tsx
import { useContext, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'
import { menuGroups } from '../config/menu'
import { MenuGroup } from '../config/menu'

export default function Sidebar() {
  const { logout, user } = useContext(AuthContext)
  const [isOpen, setIsOpen] = useState(true)
  const toggle = () => setIsOpen(o => !o)

  if (!user) return null

  // Filtramos cada grupo por roles y luego descartamos los grupos vacíos
  const allowedGroups: MenuGroup[] = menuGroups
    .map(group => ({
      ...group,
      items: group.items.filter(item =>
        item.roles.some(role => user.roles.includes(role))
      )
    }))
    .filter(group => group.items.length > 0)

  return (
    <aside className={`bg-white shadow-lg h-screen sticky top-0 transition-all duration-300 
                       ${isOpen ? 'w-64 p-6' : 'w-0 overflow-hidden'}`}>
      <button
        onClick={toggle}
        className="mb-4 focus:outline-none"
      >
        {isOpen ? '«' : '»'}
      </button>

      {isOpen && (
        <div className="flex flex-col justify-between h-full">
          <div>
            <h2 className="text-2xl font-bold text-primary-700 mb-6">WaterLab</h2>

            {allowedGroups.map(group => (
              <div key={group.label} className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase px-2 mb-2">
                  {group.label}
                </h3>
                <nav className="space-y-1">
                  {group.items.map(item => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `block py-2 px-3 rounded-lg transition ${
                          isActive ? 'bg-primary-100 text-primary-800' : 'hover:bg-gray-100'
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </nav>
              </div>
            ))}
          </div>

          <button
            onClick={logout}
            className="w-full text-left py-2 px-4 rounded-lg hover:bg-red-100 text-red-600 transition"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </aside>
  )
}
