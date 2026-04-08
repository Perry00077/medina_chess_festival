import { Route, Routes } from 'react-router-dom'
import LandingPage from './pages/public/LandingPage'
import GalleryPage from './pages/public/GalleryPage'
import RegistrationPage from './pages/public/RegistrationPage'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import ProtectedAdminRoute from './components/ProtectedAdminRoute'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/gallery" element={<GalleryPage />} />
      <Route path="/registration" element={<RegistrationPage />} />
      <Route path="/inscription" element={<RegistrationPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin"
        element={(
          <ProtectedAdminRoute>
            <AdminDashboardPage />
          </ProtectedAdminRoute>
        )}
      />
    </Routes>
  )
}
