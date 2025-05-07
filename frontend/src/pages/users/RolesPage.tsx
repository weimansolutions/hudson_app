// src/pages/roles/RolesPage.tsx
import React, { useState, useEffect, useMemo } from 'react'
import api from '../../api'
import RoleSidebar from '../../components/RoleSidebar'

interface Role {
  id: number
  name: string
  permissions: string[]
}

interface SavePayload {
  id?: number
  name: string
  permissionIds: number[]
  originalPermissionIds?: number[]
}

const RolesPage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)

  const fetchRoles = () => {
    setLoading(true)
    api.get<Role[]>('/roles_permissions/roles', { params: { skip: 0, limit: 100 } })
      .then(res => setRoles(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(fetchRoles, [])

  const filtered = useMemo(() => {
    return roles.filter(r =>
      [r.id, r.name]
        .map(v => String(v).toLowerCase())
        .join(' ')
        .includes(searchTerm.toLowerCase())
    )
  }, [roles, searchTerm])

  const openSidebar = (role: Role | null = null) => {
    setSelectedRole(role)
    setSidebarOpen(true)
  }
  const closeSidebar = () => {
    setSidebarOpen(false)
    setSelectedRole(null)
  }

  const handleSave = async (data: SavePayload) => {
    try {
      let roleId: number

      if (!data.id) {
        // Crear nuevo rol
        const res = await api.post('/roles_permissions/roles', { name: data.name })
        roleId = res.data.id
      } else {
        // Actualizar nombre
        roleId = data.id
        await api.put(`/roles_permissions/roles/${roleId}`, { name: data.name })
      }

      // Calcular permisos a añadir y quitar
      const original = data.originalPermissionIds || []
      const toAdd = data.permissionIds.filter(pid => !original.includes(pid))
      const toRemove = original.filter(pid => !data.permissionIds.includes(pid))

      // Ejecutar llamadas
      await Promise.all([
        ...toAdd.map(pid =>
          api.post(`/roles_permissions/roles/${roleId}/permissions/${pid}`)
        ),
        ...toRemove.map(pid =>
          api.delete(`/roles_permissions/roles/${roleId}/permissions/${pid}`)
        ),
      ])

      fetchRoles()
      closeSidebar()
    } catch (err: any) {
      console.error(err)
      alert('Error al guardar rol: ' + err.message)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Eliminar este rol?')) return
    try {
      await api.delete(`/roles_permissions/roles/${id}`)
      fetchRoles()
      closeSidebar()
    } catch (err: any) {
      console.error(err)
      alert('Error al eliminar rol: ' + err.message)
    }
  }

  if (loading) return <div className="p-6">Cargando roles...</div>
  if (error)   return <div className="p-6 text-red-600">Error: {error}</div>

  return (
    <div className="p-6 pb-12">
      <h1 className="text-2xl font-bold mb-4">Roles</h1>

      <div className="flex items-center space-x-4 mb-4">
        <input
          type="text"
          placeholder="Buscar roles..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded flex-1"
        />
        <button
          onClick={() => openSidebar(null)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Crear Nuevo Rol
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
            {filtered.map(role => (
              <tr
                key={role.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => openSidebar(role)}
              >
                <td className="py-2 px-4 border">{role.id}</td>
                <td className="py-2 px-4 border">{role.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="mt-4 text-center text-gray-500">No hay resultados.</div>
        )}
      </div>

      <RoleSidebar
        isOpen={sidebarOpen}
        role={selectedRole}
        onClose={closeSidebar}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  )
}

export default RolesPage
