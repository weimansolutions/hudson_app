// src/pages/DashboardLayout.tsx

import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'

export default function DashboardLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 bg-primary-50 min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}
