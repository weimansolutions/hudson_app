import React, { useState, useEffect, useMemo } from 'react'
import api from '../../api'
import * as XLSX from 'xlsx'

interface StockItem {
  [key: string]: any
}

const InventoryPage: React.FC = () => {
  const [items, setItems] = useState<StockItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEstado, setFilterEstado] = useState<string>('')

  useEffect(() => {
    api
      .get<StockItem[]>('/hudson/inventario_logyser')
      .then(res => setItems(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const estados = useMemo(() => {
    return Array.from(new Set(items.map(item => item.estado).filter(Boolean)))
  }, [items])

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // filtro de búsqueda global
      if (
        searchTerm &&
        !Object.values(item)
          .map(String)
          .join(' ')
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      ) {
        return false
      }
      // filtro por estado
      if (filterEstado && item.estado !== filterEstado) {
        return false
      }
      return true
    })
  }, [items, searchTerm, filterEstado])

  const handleExport = () => {
    // Determinar columnas dinámicamente
    const cols = items.length > 0 ? Object.keys(items[0]) : []
    // preparar datos exportando todas las columnas
    const dataToExport = filteredItems.map(item => {
      const row: Record<string, any> = {}
      cols.forEach(col => {
        row[col] = item[col]
      })
      return row
    })
    const worksheet = XLSX.utils.json_to_sheet(dataToExport)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventario Logyser')
    XLSX.writeFile(workbook, 'inventario_logyser.xlsx')
  }

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
        <select
          value={filterEstado}
          onChange={e => setFilterEstado(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">Todos los Estados</option>
          {estados.map(est => (
            <option key={est} value={est}>
              {est}
            </option>
          ))}
        </select>
        <button
          onClick={handleExport}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Exportar a Excel
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col} className="py-2 px-4 border">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item, idx) => (
              <tr key={idx}>
                {columns.map(col => (
                  <td key={col} className="py-2 px-4 border">
                    {item[col]}
                  </td>
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
