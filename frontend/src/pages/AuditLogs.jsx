import { useEffect, useState } from 'react'
import axiosInstance from '../api/axios'
import Loader from '../components/Loader'
import Pagination from '../components/Pagination'

const AuditLogs = () => {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get('/api/admin/audit-logs', {
        params: { page, limit: 15 }
      })
      setLogs(response.data.data || [])
      setTotalPages(response.data.pages || 1)
    } catch (error) {
      console.error('Failed to fetch audit logs', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [page])

  const getActionColor = (action) => {
    if (action.includes('REGISTER')) return 'text-purple-600'
    if (action.includes('LOGIN')) return 'text-emerald-600'
    if (action.includes('DELETE')) return 'text-rose-600'
    if (action.includes('UPDATE')) return 'text-amber-600'
    if (action.includes('CREATE')) return 'text-blue-600'
    return 'text-slate-600'
  }

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Audit Logs</h2>
        <p className="text-sm text-slate-500">System activity and security events tracking.</p>
      </div>

      {loading ? (
        <Loader label="Loading activity logs..." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Timestamp</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Action</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Actor</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">Target</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-600">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className={`px-4 py-3 font-bold ${getActionColor(log.action)}`}>
                      {log.action.replace(/_/g, ' ')}
                    </td>
                    <td className="px-4 py-3">
                      {log.actor ? (
                        <div>
                          <p className="font-medium text-slate-900">{log.actor.name}</p>
                          <p className="text-xs text-slate-500">{log.actor.role}</p>
                        </div>
                      ) : (
                        <span className="italic text-slate-400">System/Guest</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {log.targetRef ? log.targetRef.name : log.target || '-'}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">
                      {log.ip || 'Unknown'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-100 p-4">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </div>
      )}
    </section>
  )
}

export default AuditLogs
