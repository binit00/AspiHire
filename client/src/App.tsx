import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar/Sidebar'
import PageWrapper from './components/layout/PageWrapper'
import AuthPage from './components/features/auth/AuthPage'
import DashboardPage from './pages/DashboardPage'
import PrepTrackerPage from './pages/PrepTrackerPage'
import { getMe } from './services/auth.service'
import useAuthStore from './store/authStore'
import OffersPage from './pages/OffersPage'

function App() {
  const [authChecked, setAuthChecked] = useState(false)
  const { token, isAuthenticated, setUser, logout } = useAuthStore()

  useEffect(() => {
    const verifySession = async () => {
      if (!token) {
        setAuthChecked(true)
        return
      }

      try {
        const response = await getMe()
        setUser(response.data.user)
      } catch {
        logout()
      } finally {
        setAuthChecked(true)
      }
    }

    verifySession()
  }, [token, setUser, logout])

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 text-sm font-medium text-slate-500">
        Loading HireFlow...
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AuthPage />
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <PageWrapper>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/prep" element={<PrepTrackerPage />} />
            <Route path="/offers" element={<OffersPage />} />
            <Route path="*" element={<DashboardPage />} />
          </Routes>
        </PageWrapper>
      </div>
    </div>
  )
}

export default App
