import { Menu, Search, Bell, ChevronDown } from 'lucide-react'
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

        {/* Global Search */}
        <div className="hidden flex-1 max-w-md md:block">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary-500" size={18} />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50/50 text-sm outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10"
            />
          </div>
        </div>

        {/* Actions & Profile */}
        <div className="flex items-center gap-3">
          <button className="hidden h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 md:flex">
            <Bell size={20} />
          </button>
          
          <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block"></div>

          <button className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100 text-primary-700 font-semibold shadow-inner">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="hidden text-left md:block">
              <p className="text-sm font-semibold text-slate-900 leading-tight">{user?.name || 'User'}</p>
              <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">{user?.role || 'Guest'}</p>
            </div>
            <ChevronDown size={14} className="text-slate-400 hidden md:block" />
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
