// src/components/RoleSidebar.tsx
import React, { useState, useEffect } from 'react'
import api from '../api'

interface RoleForm {
  id?: number
  name: string
  permissions: number[]
}

interface Props {
  isOpen: boolean
  role: {
    id: number
    name: string
    permissions: string[]
  } | null
  onClose: () => void
  onSave: (data: {
    id?: number
    name: string
    permissionIds: number[]
    originalPermissionIds: number[]
  }) => void
  onDelete: (id: number) => void
}

interface Permission {
  id: number
  name: string
}

const RoleSidebar: React.FC<Props> = ({ isOpen, role, onClose, onSave, onDelete }) => {
  const [permsList, setPermsList] = useState<Permission[]>([])
  const [loadingPerms, setLoadingPerms] = useState(true)
  const [form, setForm] = useState<RoleForm>({ name: '', permissions: [] })
  const [originalPerms, setOriginalPerms] = useState<number[]>([])

  // 1) Traer lista de permisos
  useEffect(() => {
    api.get<Permission[]>('/roles_permissions/permissions', { params: { skip: 0, limit: 100 } })
      .then(res => setPermsList(res.data))
      .catch(console.error)
      .finally(() => setLoadingPerms(false))
  }, [])

  // 2) Prefill al abrir sidebar
  useEffect(() => {
    if (!isOpen || loadingPerms) return
    if (role) {
      const selIds = permsList
        .filter(p => role.permissions.includes(p.name))
        .map(p => p.id)
      setOriginalPerms(selIds)
      setForm({ id: role.id, name: role.name, permissions: selIds })
    } else {
      setOriginalPerms([])
      setForm({ name: '', permissions: [] })
    }
  }, [isOpen, role, permsList, loadingPerms])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, name: e.target.value }))
  }
  const togglePerm = (pid: number) => {
    setForm(f => ({
      ...f,
      permissions: f.permissions.includes(pid)
        ? f.permissions.filter(x => x !== pid)
        : [...f.permissions, pid]
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      id: form.id,
      name: form.name,
      permissionIds: form.permissions,
      originalPermissionIds: originalPerms
    })
  }

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform
                  ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="p-6 flex flex-col h-full">
        <h2 className="text-xl font-semibold mb-4">
          {role ? 'Editar Rol' : 'Crear Rol'}
        </h2>

        {loadingPerms ? (
          <p>Cargando permisos…</p>
        ) : (
          <form className="flex-1 overflow-y-auto" onSubmit={handleSubmit}>
            <label className="block mb-2">
              Nombre del rol
              <input
                value={form.name}
                onChange={handleNameChange}
                required
                className="mt-1 block w-full border px-3 py-2 rounded"
              />
            </label>

            <div className="mb-4">
              <span className="block mb-1">Permisos</span>
              {permsList.map(p => (
                <label key={p.id} className="inline-flex items-center mr-4">
                  <input
                    type="checkbox"
                    checked={form.permissions.includes(p.id)}
                    onChange={() => togglePerm(p.id)}
                    className="form-checkbox"
                  />
                  <span className="ml-2">{p.name}</span>
                </label>
              ))}
            </div>

            <div className="flex space-x-2">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                {role ? 'Guardar cambios' : 'Crear'}
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

        {role && (
          <button
            onClick={() => onDelete(role.id)}
            className="mt-4 text-red-600 hover:underline"
          >
            Eliminar rol
          </button>
        )}
      </div>
    </div>
  )
}

export default RoleSidebar
