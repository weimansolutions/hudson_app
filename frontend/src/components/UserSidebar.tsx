// src/components/UserSidebar.tsx
import React, { useState, useEffect } from 'react'
import api from '../api'

interface UserForm {
  id?: number
  username: string
  email: string
  full_name: string
  password?: string
  roles: number[]          // IDs seleccionados
}
interface ResetState {
    active: boolean
    newPassword: string
    confirmPwd: string
    error: string
  }

interface Props {
  isOpen: boolean
  user: {
    id: number
    username: string
    email: string
    full_name: string | null
    roles: string[]        // nombres desde GET /users
  } | null
  onClose: () => void
  onSave: (data: {
    id?: number
    username: string
    email: string
    full_name: string
    password?: string
    roleIds: number[]
    roleNames: string[]
    originalRoleIds: number[]
  }) => void
  onDelete: (id: number) => void
}

interface Role {
  id: number
  name: string
  permissions: string[]
}

const UserSidebar: React.FC<Props> = ({ isOpen, user, onClose, onSave, onDelete }) => {
  const [rolesList, setRolesList] = useState<Role[]>([])
  const [originalRoleIds, setOriginalRoleIds] = useState<number[]>([])
  const [loadingRoles, setLoadingRoles] = useState(true)
  const [form, setForm] = useState<UserForm>({
    username: '',
    email: '',
    full_name: '',
    roles: [],
    password: '',
  })

const [resetState, setResetState] = useState<ResetState>({
    active: false,
    newPassword: '',
    confirmPwd: '',
    error: ''
  })
     

  // 1) Traer roles
  useEffect(() => {
    api.get<Role[]>('/roles_permissions/roles', {
      params: { skip: 0, limit: 10 }
    })
      .then(res => setRolesList(res.data))
      .catch(console.error)
      .finally(() => setLoadingRoles(false))
  }, [])

  // 2) Prefill al abrir + rolesList cargado
  useEffect(() => {
    if (!isOpen || loadingRoles) return
    if (user) {
      // mapear nombres de user.roles a IDs
      const selIds = rolesList
        .filter(r => user.roles.includes(r.name))
        .map(r => r.id)
      setOriginalRoleIds(selIds)
      setForm({
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name ?? '',
        roles: selIds,
        password: '',
      })
    } else {
      // nuevo usuario
      setOriginalRoleIds([])
      setForm({ username: '', email: '', full_name: '', roles: [], password: '' })
    }
  }, [isOpen, user, rolesList, loadingRoles])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }
  const toggleRole = (roleId: number) => {
    setForm(f => ({
      ...f,
      roles: f.roles.includes(roleId)
        ? f.roles.filter(r => r !== roleId)
        : [...f.roles, roleId]
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // construir nombres de roles
    const selRoles = rolesList.filter(r => form.roles.includes(r.id))
    onSave({
      id: form.id,
      username: form.username,
      email: form.email,
      full_name: form.full_name,
      password: form.password,
      roleIds: form.roles,
      roleNames: selRoles.map(r => r.name),
      originalRoleIds
    })
  }

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform
                  ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="p-6 flex flex-col h-full">
        <h2 className="text-xl font-semibold mb-4">
          {user ? 'Editar Usuario' : 'Crear Usuario'}
        </h2>

        {loadingRoles ? (
          <p>Cargando roles…</p>
        ) : (
          <form className="flex-1 overflow-y-auto" onSubmit={handleSubmit}>
            <label className="block mb-2">
              Username
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                className="mt-1 block w-full border px-3 py-2 rounded"
              />
            </label>

            <label className="block mb-2">
              Email
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full border px-3 py-2 rounded"
              />
            </label>

            <label className="block mb-2">
              Nombre Completo
              <input
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                className="mt-1 block w-full border px-3 py-2 rounded"
              />
            </label>

            {!user && (
              <label className="block mb-2">
                Contraseña
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border px-3 py-2 rounded"
                />
              </label>
            )}

            <div className="mb-4">
              <span className="block mb-1">Roles</span>
              {rolesList.map(r => (
                <label key={r.id} className="inline-flex items-center mr-4">
                  <input
                    type="checkbox"
                    checked={form.roles.includes(r.id)}
                    onChange={() => toggleRole(r.id)}
                    className="form-checkbox"
                  />
                  <span className="ml-2">{r.name}</span>
                </label>
              ))}
            </div>

            <div className="flex space-x-2">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                {user ? 'Guardar cambios' : 'Crear'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        {user && (
          <>
            <button
              onClick={() => onDelete(user.id)}
              className="mt-4 text-red-600 hover:underline"
            >
              Eliminar usuario
            </button>

            {/* Botón Reset Password */}
            {!resetState.active ? (
              <button
                onClick={() => setResetState(rs => ({ ...rs, active: true }))}
                className="mt-2 text-blue-600 hover:underline"
              >
                Reset Password
              </button>
            ) : (
              <div className="mt-4 border-t pt-4">
                <p className="font-medium mb-2">Ingresa nueva contraseña:</p>
                <input
                  type="password"
                  placeholder="Nueva contraseña"
                  value={resetState.newPassword}
                  onChange={e => setResetState(rs => ({ ...rs, newPassword: e.target.value }))}
                  className="block w-full border px-3 py-2 rounded mb-2"
                />
                <input
                  type="password"
                  placeholder="Confirmar contraseña"
                  value={resetState.confirmPwd}
                  onChange={e => setResetState(rs => ({ ...rs, confirmPwd: e.target.value }))}
                  className="block w-full border px-3 py-2 rounded mb-2"
                />
                {resetState.error && (
                  <p className="text-sm text-red-600 mb-2">{resetState.error}</p>
                )}
                <div className="flex space-x-2">
                  <button
                    onClick={async () => {
                      const { newPassword, confirmPwd } = resetState
                      if (!newPassword || newPassword !== confirmPwd) {
                        // error: limpiar y mostrar mensaje
                        setResetState({ active: true, newPassword: '', confirmPwd: '', error: 'Las contraseñas no coinciden' })
                        return
                      }
                      try {
                        // Llamada al endpoint reset-password
                        await api.post(`/users/${user.id}/reset-password`, {
                          new_password: newPassword
                        })
                        alert('Contraseña reiniciada con éxito')
                        setResetState({ active: false, newPassword: '', confirmPwd: '', error: '' })
                      } catch (err: any) {
                        console.error(err)
                        alert('Error al resetear contraseña: ' + err.message)
                      }
                    }}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Confirmar
                  </button>
                  <button
                    onClick={() => setResetState({ active: false, newPassword: '', confirmPwd: '', error: '' })}
                    className="flex-1 bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default UserSidebar