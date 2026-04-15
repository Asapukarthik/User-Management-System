import { LayoutDashboard, Shield, Users, ScrollText } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { hasAnyRole } from '../utils/roles'

const baseNavClass =
  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200'

const Sidebar = ({ onNavigate }) => {
  const { role } = useAuth()

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, allowed: [] },
    { to: '/users', label: 'Users', icon: Users, allowed: ['admin', 'manager'] },
    { to: '/audit-logs', label: 'Audit Logs', icon: ScrollText, allowed: ['admin'] },
    { to: '/profile', label: 'Profile', icon: Shield, allowed: [] },
  ]

  return (
    <aside className="flex h-full w-72 flex-col border-r border-slate-200 bg-white px-4 py-5 shadow-sm">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-white shadow-lg">
          U
        </div>
        <div>
          <p className="text-base font-semibold text-slate-900">User Suite</p>
          <p className="text-xs text-slate-500">Management Console</p>
        </div>
      </div>

      <nav className="space-y-2">
        {links
          .filter((link) => hasAnyRole(role, link.allowed))
          .map((link) => {
            const Icon = link.icon
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `${baseNavClass} ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </NavLink>
            )
          })}
      </nav>
    </aside>
  )
}

export default Sidebar
