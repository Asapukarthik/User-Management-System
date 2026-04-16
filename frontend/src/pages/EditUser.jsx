import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { User, Mail, Shield, ArrowLeft, CheckCircle, Save, X } from 'lucide-react'
import axiosInstance from '../api/axios'

const EditUser = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', role: 'user', isActive: true })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(`/api/users/${id}`)
        const userData = response?.data?.data
        if (userData) {
          setForm({
            name: userData.name || '',
            email: userData.email || '',
            role: userData.role || 'user',
            isActive: userData.isActive ?? true,
          })
        }
      } catch (err) {
        setError('Authorization error while fetching identity data.')
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [id])

  const onSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      await axiosInstance.put(`/api/users/${id}`, form)
      setSuccess(true)
      setTimeout(() => navigate('/users'), 2000)
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Failed to update identity parameters.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-primary-600" />
        <p className="mt-4 text-sm font-semibold text-slate-500 animate-pulse">Retrieving identity data...</p>
      </div>
    )
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] animate-in fade-in zoom-in duration-500">
        <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <CheckCircle size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Identity Updated</h2>
        <p className="mt-2 text-slate-500 font-medium">Parameters have been successfully synchronized.</p>
        <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-slate-400">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
          Returning to directory...
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link to="/users" className="inline-flex items-center gap-2 text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors mb-2">
            <ArrowLeft size={16} />
            Back to Directory
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Modify Identity</h1>
          <p className="text-sm font-medium text-slate-500">Update configuration parameters for this secure profile.</p>
        </div>
      </header>

      <div className="card-premium overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
              {form.name?.charAt(0)}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-none">{form.name}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-1">
                <span className={`h-1.5 w-1.5 rounded-full ${form.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                ID: {id?.slice(-8)}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md uppercase tracking-wider">Editing Mode</span>
        </div>

        <form onSubmit={onSubmit} className="p-8 space-y-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Identified Name</label>
                <div className="relative group">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    value={form.name}
                    onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                    className="input-premium pl-10"
                    placeholder="Full identity name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Communication Email</label>
                <div className="relative group">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                    className="input-premium pl-10"
                    placeholder="name@company.com"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Access Scope</label>
                <div className="relative group">
                  <Shield size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors pointer-events-none" />
                  <select
                    value={form.role}
                    onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
                    className="input-premium pl-10 cursor-pointer"
                  >
                    <option value="admin">Administrator</option>
                    <option value="manager">Manager</option>
                    <option value="user">User</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Operational State</label>
                <select
                  value={form.isActive}
                  onChange={(event) => setForm((prev) => ({ ...prev, isActive: event.target.value === 'true' }))}
                  className="input-premium cursor-pointer"
                >
                  <option value="true">Active / Operational</option>
                  <option value="false">Suspended / Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-4 text-xs font-bold text-rose-600 border border-rose-100">
              <div className="h-1.5 w-1.5 rounded-full bg-rose-600 animate-pulse" />
              {error}
            </div>
          )}

          <div className="pt-4 flex items-center justify-end gap-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate('/users')}
              className="btn-secondary px-8 flex items-center gap-2"
            >
              <X size={18} />
              Discard Changes
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary px-10 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Persist Modifications
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditUser
