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

  const allowedGroups: MenuGroup[] = menuGroups
    .map(group => ({
      ...group,
      items: group.items.filter(item =>
        item.roles.some(role => user.roles.includes(role))
      )
    }))
    .filter(group => group.items.length > 0)

  return (
    <aside
      className={`bg-white shadow-lg h-screen sticky top-0 transition-width duration-300 flex flex-col justify-between z-20 ${
        isOpen ? 'w-64 p-6' : 'w-12 p-2'
      }`}
    >
      {/* Toggle Button */}
      <div className="flex justify-end">
        <button
          onClick={toggle}
          className="p-1 rounded focus:outline-none hover:bg-gray-200"
        >
          <span className="text-xl">{isOpen ? '‹' : '›'}</span>
        </button>
      </div>

      {/* Content */}
      {isOpen && (
        <div className="flex-grow overflow-y-auto mt-4">
          <h2 className="text-2xl font-bold text-primary-700 mb-6">Hudson Kitchenware</h2>
          <nav className="mb-6">
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) =>
                `flex items-center py-2 px-3 rounded-lg transition ${
                  isActive ? 'bg-primary-100 text-primary-800' : 'hover:bg-gray-100'
                }`
              }
            >
              🏠 Home
            </NavLink>
          </nav>

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
                      `flex items-center py-2 px-3 rounded-lg transition ${
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
      )}

      {/* Logout */}
      {isOpen && (
        <button
          onClick={logout}
          className="w-full text-left py-2 px-4 rounded-lg hover:bg-red-100 text-red-600 transition"
        >
          Cerrar sesión
        </button>
      )}
    </aside>
  )
}

