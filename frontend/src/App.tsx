// src/App.tsx

import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from './contexts/AuthContext'

import Home from './pages/Home'
import Login from './pages/Login'
import DashboardLayout from './pages/DashboardLayout'

import ClientsPage from './pages/ClientsPage'
import ClientFormPage from './pages/ClientFormPage'

import SamplingPointsPage from './pages/SamplingPointsPage'
import SamplingPointFormPage from './pages/SamplingPointFormPage'

import StudiesPage from './pages/StudiesPage'
import StudyFormPage from './pages/StudyFormPage'

import AnalysesPage from './pages/AnalysesPage'
import AnalysisFormPage from './pages/AnalysisFormPage'

import ResultsPage from './pages/ResultsPage'
import ResultFormPage from './pages/ResultFormPage'

import ReportsPage from './pages/ReportsPage'
import ReportFormPage from './pages/ReportFormPage'

import StudyDetailPage from './pages/StudyDetailPage'

function App() {
  const { token, logout } = useContext(AuthContext)

  return (
    <BrowserRouter>
      <header className="bg-white shadow-md">
        <div className="container mx-auto flex items-center justify-between p-4">
          <Link to="/" className="text-xl font-bold text-primary">
            WaterLab
          </Link>
          <nav className="space-x-4">
            {!token && (
              <Link to="/login" className="text-gray-600 hover:text-primary">
                Login
              </Link>
            )}
            {token && (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-primary">
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="ml-2 text-gray-600 hover:text-red-500"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="container mx-auto mt-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={token ? <Navigate to="/dashboard/clients" /> : <Login />}
          />

          {/* Protected dashboard routes */}
          <Route
            path="/dashboard"
            element={token ? <DashboardLayout /> : <Navigate to="/login" />}
          >
            {/* Default redirect */}
            <Route index element={<Navigate to="clients" replace />} />

            {/* Clients */}
            <Route path="clients" element={<ClientsPage />} />
            <Route path="clients/new" element={<ClientFormPage />} />

            {/* Sampling Points */}
            <Route path="sampling-points" element={<SamplingPointsPage />} />
            <Route path="sampling-points/new" element={<SamplingPointFormPage />} />

            {/* Studies */}
            <Route path="studies" element={<StudiesPage />} />
            <Route path="studies/new" element={<StudyFormPage />} />
            <Route path="studies/:studyId" element={<StudyDetailPage />} />

            {/* Analyses */}
            <Route path="analyses" element={<AnalysesPage />} />
            <Route path="analyses/new" element={<AnalysisFormPage />} />

            {/* Results */}
            <Route path="results" element={<ResultsPage />} />
            <Route path="results/new" element={<ResultFormPage />} />
            <Route
              path="studies/:studyId/results/new"
              element={<ResultFormPage />}
            />

            {/* Reports */}
            <Route path="reports" element={<ReportsPage />} />
            <Route path="reports/new" element={<ReportFormPage />} />
          </Route>

          {/* Fallback for unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
