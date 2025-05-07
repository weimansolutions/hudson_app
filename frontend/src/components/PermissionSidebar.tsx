// src/components/PermissionSidebar.tsx
import React, { useState, useEffect } from 'react'
import api from '../api'

interface Permission {
  id?: number
  name: string
}

interface Role {
  id: number
  name: string
  permissions: string[]
}

interface Props {
  isOpen: boolean
  permission: { id: number; name: string } | null
  onClose: () => void
  onDeleted: (id: number) => void
  onSaved: () => void
}

const PermissionSidebar: React.FC<Props> = ({
  isOpen,
  permission,
  onClose,
  onDeleted,
  onSaved
}) => {
  const [roles, setRoles] = useState<Role[]>([])
  const [loadingRoles, setLoadingRoles] = useState(true)
  const [form, setForm] = useState<Permission>({ name: '' })
  const [assignedRoleIds, setAssignedRoleIds] = useState<number[]>([])
  const [originalAssigned, setOriginalAssigned] = useState<number[]>([])

  // 1) Traer roles con sus permisos
  useEffect(() => {
    api
      .get<Role[]>('/roles_permissions/roles', { params: { skip: 0, limit: 100 } })
      .then(res => setRoles(res.data))
      .catch(console.error)
      .finally(() => setLoadingRoles(false))
  }, [])

  // 2) Prefill al abrir
  useEffect(() => {
    if (!isOpen || loadingRoles) return
    if (permission) {
      setForm({ name: permission.name })
      // roles que incluyen este permiso.name
      const linked = roles
        .filter(r => r.permissions.includes(permission.name))
        .map(r => r.id)
      setAssignedRoleIds(linked)
      setOriginalAssigned(linked)
    } else {
      setForm({ name: '' })
      setAssignedRoleIds([])
      setOriginalAssigned([])
    }
  }, [isOpen, permission, roles, loadingRoles])

  const toggleRole = (rid: number) => {
    setAssignedRoleIds(ids =>
      ids.includes(rid) ? ids.filter(x => x !== rid) : [...ids, rid]
    )
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      let permissionId: number

      if (!permission) {
        // crear nuevo permiso
        const res = await api.post('/roles_permissions/permissions', { name: form.name })
        permissionId = res.data.id
      } else {
        // actualizar nombre
        permissionId = permission.id
        await api.put(`/roles_permissions/permissions/${permissionId}`, { name: form.name })
      }

      // calcular cambios de roles
      const toAdd = assignedRoleIds.filter(id => !originalAssigned.includes(id))
      const toRemove = originalAssigned.filter(id => !assignedRoleIds.includes(id))

      await Promise.all([
        ...toAdd.map(rid =>
          api.post(`/roles_permissions/roles/${rid}/permissions/${permissionId}`)
        ),
        ...toRemove.map(rid =>
          api.delete(`/roles_permissions/roles/${rid}/permissions/${permissionId}`)
        ),
      ])

      onSaved()
    } catch (err: any) {
      console.error(err)
      alert('Error al guardar permiso: ' + err.message)
    }
  }

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="p-6 flex flex-col h-full">
        <h2 className="text-xl font-semibold mb-4">
          {permission ? 'Editar Permiso' : 'Crear Permiso'}
        </h2>

        {loadingRoles ? (
          <p>Cargando roles…</p>
        ) : (
          <form className="flex-1 overflow-y-auto" onSubmit={handleSave}>
            <label className="block mb-2">
              Nombre del permiso
              <input
                value={form.name}
                onChange={e => setForm({ name: e.target.value })}
                required
                className="mt-1 block w-full border px-3 py-2 rounded"
              />
            </label>

            <div className="mb-4">
              <span className="block mb-1">Roles vinculados</span>
              {roles.map(r => (
                <label key={r.id} className="inline-flex items-center mr-4">
                  <input
                    type="checkbox"
                    checked={assignedRoleIds.includes(r.id)}
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
                {permission ? 'Guardar cambios' : 'Crear'}
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

        {permission && (
          <button
            onClick={() => onDeleted(permission.id)}
            className="mt-4 text-red-600 hover:underline"
          >
            Eliminar permiso
          </button>
        )}
      </div>
    </div>
  )
}

export default PermissionSidebar
