import React, { useState, useEffect, useMemo } from 'react'
import api from '../../api'
import UserSidebar from '../../components/UserSidebar'

interface User {
  id: number
  username: string
  email: string
  full_name: string | null
  roles: string[]
}

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const fetchUsers = () => {
    setLoading(true)
    api.get<User[]>('/users')
      .then(res => setUsers(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(fetchUsers, [])

  const filtered = useMemo(() => {
    return users.filter(u =>
      [u.id, u.username, u.email, u.full_name]
        .map(v => (v != null ? String(v) : ''))
        .join(' ')
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
  }, [users, searchTerm])

  const openSidebar = (user: User | null = null) => {
    setSelectedUser(user)
    setSidebarOpen(true)
  }
  const closeSidebar = () => {
    setSidebarOpen(false)
    setSelectedUser(null)
  }
  interface SavePayload {
    id?: number
    username: string
    email: string
    full_name: string
    password?: string
    roleIds: number[]
    roleNames: string[]
    originalRoleIds?: number[]
    }

  const handleSave = async (data: SavePayload) => {
    try {
      if (!data.id) {
        // CREAR
        const { roleIds, roleNames, password, ...userData } = data
        const res = await api.post('/users', {
          ...userData,
          roles: roleNames,
          password,
        })
        const newUserId = res.data.id
        // asignar roles uno a uno
        await Promise.all(
          roleIds.map(rid =>
            api.post(`/users/${newUserId}/roles/${rid}`)
          )
        )
      } else {

       await api.put(`/users/${data.id}`, {
         username: data.username,
         email: data.email,
         full_name: data.full_name,
       })

       // Roles a añadir:
       const toAdd = data.roleIds.filter(
         rid => !(data.originalRoleIds || []).includes(rid)
       )
       // Roles a quitar:
       const toRemove = (data.originalRoleIds || []).filter(
         rid => !data.roleIds.includes(rid)
       )

       // Llamadas en paralelo
       await Promise.all([
         ...toAdd.map(rid =>
           api.post(`/users/${data.id}/roles/${rid}`)
         ),
         ...toRemove.map(rid =>
           api.delete(`/users/${data.id}/roles/${rid}`)
         ),
       ])
       
      }
      fetchUsers()
      closeSidebar()
    } catch (err: any) {
      console.error(err)
      alert('Error al guardar usuario: ' + err.message)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Confirma que desea eliminar este usuario?')) return
    try {
      await api.delete(`/users/${id}`)
      fetchUsers()
      closeSidebar()
    } catch (err: any) {
      console.error(err)
      alert('Error al eliminar usuario: ' + err.message)
    }
  }

  if (loading) return <div className="p-6">Cargando usuarios...</div>
  if (error)   return <div className="p-6 text-red-600">Error: {error}</div>

  return (
    <div className="p-6 pb-12">
      <h1 className="text-2xl font-bold mb-4">Usuarios</h1>

      <div className="flex items-center space-x-4 mb-4">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded flex-1"
        />
        <button
          onClick={() => openSidebar(null)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Crear Nuevo Usuario
        </button>
      </div>

      <div className="overflow-x-auto overflow-y-visible">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border w-16">ID</th>
              <th className="py-2 px-4 border">Username</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">Nombre Completo</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => openSidebar(user)}
              >
                <td className="py-2 px-4 border">{user.id}</td>
                <td className="py-2 px-4 border">{user.username}</td>
                <td className="py-2 px-4 border">{user.email}</td>
                <td className="py-2 px-4 border">{user.full_name ?? ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="mt-4 text-center text-gray-500">No hay resultados.</div>
        )}
      </div>

      <UserSidebar
        isOpen={sidebarOpen}
        user={selectedUser}
        onClose={closeSidebar}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  )
}

export default UsersPage