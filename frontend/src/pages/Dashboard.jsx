import { Activity, ShieldCheck, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import axiosInstance from '../api/axios'
import Loader from '../components/Loader'
import StatCard from '../components/StatCard'
import useAuth from '../hooks/useAuth'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({ total: 0, active: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/api/users', { params: { limit: 1 } })
        const { total } = response.data
        // For active count, we still need a filter or a separate stat endpoint. 
        // For now, let's just use the total and fetch active with a filter if needed.
        const activeRes = await axiosInstance.get('/api/users', { params: { limit: 1, isActive: 'true' } })
        setStats({ total: total || 0, active: activeRes.data.total || 0 })
      } catch {
        setStats({ total: 0, active: 0 })
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const activities = useMemo(
    () => [
      `Signed in as ${user?.role || 'user'}`,
      'Viewed dashboard metrics',
      'Session secured with JWT token',
    ],
    [user?.role],
  )

  if (loading) {
    return <Loader label="Loading dashboard..." />
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Welcome, {user?.name || 'there'} </h2>
        <p className="mt-1 text-sm text-slate-500">
          Here is your account overview. Role: <span className="font-semibold capitalize text-blue-700">{user?.role}</span>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Total Users" value={stats.total} hint="All registered accounts" icon={Users} />
        <StatCard title="Active Users" value={stats.active} hint="Currently active accounts" icon={Activity} />
        <StatCard title="My Role" value={(user?.role || '-').toUpperCase()} hint="Role-based access level" icon={ShieldCheck} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Recent Activity</h3>
        <ul className="space-y-2">
          {activities.map((item) => (
            <li key={item} className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Dashboard
