import { Activity, ShieldCheck, Users, TrendingUp, Clock, ArrowRight } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import axiosInstance from '../api/axios'
import Loader from '../components/Loader'
import StatCard from '../components/StatCard'
import useAuth from '../hooks/useAuth'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({ total: 0, active: 0, growth: 12 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/api/users', { params: { limit: 1 } })
        const { total } = response.data
        const activeRes = await axiosInstance.get('/api/users', { params: { limit: 1, isActive: 'true' } })
        setStats((prev) => ({ ...prev, total: total || 0, active: activeRes.data.total || 0 }))
      } catch {
        // Fallback or error handled by global interceptor if any
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const activities = useMemo(
    () => [
      { id: 1, text: `System access granted to ${user?.name}`, time: 'Just now', icon: ShieldCheck, color: 'text-emerald-500 bg-emerald-50' },
      { id: 2, text: 'Real-time database synchronization active', time: '2 mins ago', icon: Activity, color: 'text-blue-500 bg-blue-50' },
      { id: 3, text: 'JWT session token renewed successfully', time: '1 hour ago', icon: Clock, color: 'text-amber-500 bg-amber-50' },
    ],
    [user?.name],
  )

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-primary-600" />
        <p className="mt-4 text-sm font-semibold text-slate-500 animate-pulse">Initializing cockpit...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Welcome, {user?.name?.split(' ')[0] || 'Member'}!
          </h2>
          <p className="text-sm font-medium text-slate-500">
            Monitor your workspace Activity and manage permissions.
          </p>
        </div>

      </header>

      <section className="grid gap-6 md:grid-cols-3">
        <StatCard title="Platform Users" value={stats.total} hint="Registered digital identities" icon={Users} trend={stats.growth} />
        <StatCard title="Active Pulse" value={stats.active} hint="Real-time engaged sessions" icon={Activity} trend={8} />
        <StatCard title="Access Level" value={(user?.role || 'Guest').toUpperCase()} hint="Your current security scope" icon={ShieldCheck} />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">


        <div className="card-premium p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center justify-between">
            Timeline
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary-600 bg-primary-50 px-2 py-1 rounded-md">Live</span>
          </h3>
          <div className="space-y-6">
            {activities.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.id} className="flex gap-4 relative group">
                  <div className={`mt-1 h-9 w-9 shrink-0 flex items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${item.color}`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800 leading-tight">
                      {item.text}
                    </p>
                    <p className="mt-1 text-xs font-medium text-slate-400">
                      {item.time}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
          <button className="mt-8 w-full flex items-center justify-center gap-2 text-sm font-bold text-slate-500 hover:text-primary-600 transition-colors py-2 group">
            View Audit Trails
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
