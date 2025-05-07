// src/pages/permissions/PermissionsPage.tsx
import React, { useState, useEffect, useMemo } from 'react'
import api from '../../api'
import PermissionSidebar from '../../components/PermissionSidebar'

interface Permission {
  id: number
  name: string
}

const PermissionsPage: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedPerm, setSelectedPerm] = useState<Permission | null>(null)

  const fetchPermissions = () => {
    setLoading(true)
    api
      .get<Permission[]>('/roles_permissions/permissions', { params: { skip: 0, limit: 100 } })
      .then(res => setPermissions(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(fetchPermissions, [])

  const filtered = useMemo(() => {
    return permissions.filter(p =>
      [p.id, p.name]
        .map(v => String(v).toLowerCase())
        .join(' ')
        .includes(searchTerm.toLowerCase())
    )
  }, [permissions, searchTerm])

  const openSidebar = (perm: Permission | null = null) => {
    setSelectedPerm(perm)
    setSidebarOpen(true)
  }
  const closeSidebar = () => {
    setSidebarOpen(false)
    setSelectedPerm(null)
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Eliminar este permiso?')) return
    try {
      await api.delete(`/roles_permissions/permissions/${id}`)
      fetchPermissions()
      closeSidebar()
    } catch (err: any) {
      console.error(err)
      alert('Error al eliminar permiso: ' + err.message)
    }
  }

  if (loading) return <div className="p-6">Cargando permisos...</div>
  if (error)   return <div className="p-6 text-red-600">Error: {error}</div>

  return (
    <div className="p-6 pb-12">
      <h1 className="text-2xl font-bold mb-4">Permisos</h1>

      <div className="flex items-center space-x-4 mb-4">
        <input
          type="text"
          placeholder="Buscar permisos..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded flex-1"
        />
        <button
          onClick={() => openSidebar(null)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Crear Nuevo Permiso
        </button>
      </div>

      <div className="overflow-x-auto overflow-y-visible">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border w-16">ID</th>
              <th className="py-2 px-4 border">Nombre</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(perm => (
              <tr
                key={perm.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => openSidebar(perm)}
              >
                <td className="py-2 px-4 border">{perm.id}</td>
                <td className="py-2 px-4 border">{perm.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="mt-4 text-center text-gray-500">No hay resultados.</div>
        )}
      </div>

      <PermissionSidebar
        isOpen={sidebarOpen}
        permission={selectedPerm}
        onClose={closeSidebar}
        onDeleted={handleDelete}
        onSaved={() => {
          fetchPermissions()
          closeSidebar()
        }}
      />
    </div>
  )
}

export default PermissionsPage
