// src/pages/inventory/InventoryPage.tsx
import React, { useState, useEffect, useMemo } from 'react'
import api from '../../api'

interface StockItem {
  [key: string]: any
}

const InventoryPage: React.FC = () => {
  const [items, setItems] = useState<StockItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [minQty, setMinQty] = useState<number | ''>('')
  const [maxQty, setMaxQty] = useState<number | ''>('')

  useEffect(() => {
    api
      .get<StockItem[]>('/roles_permissions/roles')
      .then(res => setItems(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const values = Object.values(item).map(String).join(' ').toLowerCase()
      if (!values.includes(searchTerm.toLowerCase())) {
        return false
      }
      // Filtrar por cantidad si existe un campo numérico
      const qty = item.quantity ?? item.Stock ?? item.stock ?? null
      if (typeof qty === 'number') {
        if (minQty !== '' && qty < minQty) return false
        if (maxQty !== '' && qty > maxQty) return false
      }
      return true
    })
  }, [items, searchTerm, minQty, maxQty])

  if (loading) return <div>Cargando inventario...</div>
  if (error) return <div>Error: {error}</div>

  const columns = items.length > 0 ? Object.keys(items[0]) : []

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Inventario - Stock Actual</h1>
      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        <input
          type="number"
          placeholder="Cantidad mínima"
          value={minQty}
          onChange={e => setMinQty(e.target.value === '' ? '' : Number(e.target.value))}
          className="border px-3 py-2 rounded w-32"
        />
        <input
          type="number"
          placeholder="Cantidad máxima"
          value={maxQty}
          onChange={e => setMaxQty(e.target.value === '' ? '' : Number(e.target.value))}
          className="border px-3 py-2 rounded w-32"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col} className="py-2 px-4 border">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item, idx) => (
              <tr key={idx}>
                {columns.map(col => (
                  <td key={col} className="py-2 px-4 border">{item[col]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {filteredItems.length === 0 && (
          <div className="mt-4 text-center text-gray-500">No hay resultados.</div>
        )}
      </div>
    </div>
  )
}

export default InventoryPage