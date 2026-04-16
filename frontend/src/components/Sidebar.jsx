import { LayoutDashboard, Shield, Users, ScrollText, LogOut, ChevronLeft, ChevronRight } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import useAuth from '../hooks/useAuth'
import { hasAnyRole } from '../utils/roles'

const Sidebar = ({ onNavigate }) => {
  const { role, logout } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, allowed: [] },
    { to: '/users', label: 'Users', icon: Users, allowed: ['admin', 'manager'] },
    { to: '/audit-logs', label: 'Audit Logs', icon: ScrollText, allowed: ['admin'] },
    { to: '/profile', label: 'Profile', icon: Shield, allowed: [] },
  ]

  const filteredLinks = links.filter((link) => hasAnyRole(role, link.allowed))

  return (
    <aside
      className={`relative flex h-full flex-col border-r border-slate-200/60 bg-white transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-12 hidden h-6 w-6 place-items-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm transition-colors hover:text-primary-600 md:grid"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Brand */}
      <div className={`flex items-center gap-3 px-6 py-8 ${isCollapsed ? 'justify-center px-0' : ''}`}>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white shadow-lg shadow-primary-500/20">
          <Shield size={22} strokeWidth={2.5} />
        </div>
        {!isCollapsed && (
          <div className="overflow-hidden whitespace-nowrap">
            <h1 className="text-lg font-bold tracking-tight text-slate-900">UserSuite</h1>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Enterprise</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3">
        {filteredLinks.map((link) => {
          const Icon = link.icon
          return (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 shadow-sm shadow-primary-100/50'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                } ${isCollapsed ? 'justify-center px-0' : ''}`
              }
              title={isCollapsed ? link.label : ''}
            >
              <Icon
                size={20}
                className={`shrink-0 transition-colors ${
                  isCollapsed ? 'm-0' : ''
                } group-[.active]:text-primary-600`}
              />
              {!isCollapsed && <span>{link.label}</span>}
            </NavLink>
          )
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="mt-auto border-t border-slate-100 p-4">
        <button
          onClick={logout}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-red-50 hover:text-red-600 ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
          title={isCollapsed ? 'Logout' : ''}
        >
          <LogOut size={20} className="shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
