// src/config/menu.ts
import ClientsPage from '../pages/users/ClientsPage'
import RolesPage from '../pages/users/RolesPage'
import PermissionsPage from '../pages/users/PermissionsPage'
import MaterialsPage from '../pages/inventory/MaterialsPage'
import CountsPage from '../pages/inventory/CountsPage'
import ReportsPage from '../pages/analysis/ReportsPage'
import ResultsPage from '../pages/analysis/ResultsPage'
import InventoryPage from '../pages/inventory/InventoryPage'
// etc. importa aquí todos tus componentes de página

export interface MenuItem {
  label: string
  to: string
  roles: string[]
  component: React.FC
}

export interface MenuGroup {
  label: string
  items: MenuItem[]
}

export const menuGroups: MenuGroup[] = [
  {
    label: 'Usuarios',
    items: [
      { label: 'Administración', to: '/dashboard/clients', roles: ['admin','manager'], component: ClientsPage },
      { label: 'Roles',          to: '/dashboard/roles',   roles: ['admin'],          component: RolesPage },
      { label: 'Permisos',      to: '/dashboard/permissions', roles: ['admin'],       component: PermissionsPage },
    ]
  },
  {
    label: 'Inventario',
    items: [
      { label: 'Conteos',    to: '/dashboard/counts',    roles: ['admin','operator'], component: CountsPage },
      { label: 'Materiales', to: '/dashboard/materials', roles: ['admin','operator'], component: MaterialsPage },
      { label: 'Stock', to: '/dashboard/stock', roles: ['admin','operator'], component: InventoryPage },
    ]
  },
  {
    label: 'Análisis',
    items: [
      { label: 'Resultados', to: '/dashboard/results', roles: ['admin','operator','scientist'], component: ResultsPage },
      { label: 'Reportes',   to: '/dashboard/reports', roles: ['manager'],component: ReportsPage },
    ]
  },
  // ...
]
