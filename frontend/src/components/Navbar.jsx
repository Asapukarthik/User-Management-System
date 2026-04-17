import { Menu, ChevronDown } from 'lucide-react'
import useAuth from '../hooks/useAuth'

const Navbar = ({ onMenuClick }) => {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-30 h-20 border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
      <div className="flex h-full items-center justify-between px-4 md:px-8">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 md:hidden"
        >
          <Menu size={20} />
        </button>

        {/* Brand / Page Title (Mobile) */}
        <h1 className="text-sm font-bold text-slate-900 md:hidden">UserSuite</h1>


        {/* Actions & Profile */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block"></div>

          <button className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100 text-primary-700 font-semibold shadow-inner">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="hidden text-left md:block">
              <p className="text-sm font-semibold text-slate-900 leading-tight">{user?.name || 'User'}</p>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">{user?.role || 'Guest'}</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
