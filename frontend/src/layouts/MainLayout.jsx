import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

const MainLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <div className="hidden h-screen md:sticky md:top-0 md:block">
          <Sidebar />
        </div>

        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 flex md:hidden">
            <div className="h-full">
              <Sidebar onNavigate={() => setMobileMenuOpen(false)} />
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="h-full flex-1 bg-black/30"
            />
          </div>
        )}

        <div className="min-h-screen flex-1">
          <Navbar onMenuClick={() => setMobileMenuOpen(true)} />
          <main className="p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default MainLayout
