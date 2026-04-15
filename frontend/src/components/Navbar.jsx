import { LogOut, Menu } from 'lucide-react'
import useAuth from '../hooks/useAuth'

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-sm font-semibold text-slate-800 md:text-base">
          User Management Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-slate-900">{user?.name || 'User'}</p>
          <p className="text-xs capitalize text-slate-500">{user?.role || 'member'}</p>
        </div>

        <div className="grid h-10 w-10 place-items-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>

        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </header>
  )
}

export default Navbar
