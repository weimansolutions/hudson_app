// src/config/menu.ts
import RolesPage from '../pages/users/RolesPage'
import PermissionsPage from '../pages/users/PermissionsPage'
import MaterialsPage from '../pages/inventory/MaterialsPage'
import CountsPage from '../pages/inventory/CountsPage'
import InventoryPage from '../pages/inventory/InventoryPage'
import UsersPage from '../pages/users/UsersPage'
import InventoryPageLogyser from '../pages/inventory/InventoryPageLogyser'

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
      { label: 'Usuarios',      to: '/dashboard/usuarios', roles: ['admin'],       component: UsersPage },
      { label: 'Roles',          to: '/dashboard/roles',   roles: ['admin'],          component: RolesPage },
      { label: 'Permisos',      to: '/dashboard/permissions', roles: ['admin'],       component: PermissionsPage },
    ]
  },
  {
    label: 'Inventario',
    items: [
      { label: 'Conteos',    to: '/dashboard/counts',    roles: ['admin','user'], component: CountsPage },
      { label: 'Materiales', to: '/dashboard/materials', roles: ['admin','user'], component: MaterialsPage },
      { label: 'Stock', to: '/dashboard/stock', roles: ['admin','user'], component: InventoryPage },
      { label: 'Stock Logyser', to: '/dashboard/stock_logyser', roles: ['admin','user'], component: InventoryPageLogyser},
    ]
  },
]
