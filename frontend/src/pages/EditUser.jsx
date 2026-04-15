import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axiosInstance from '../api/axios'
import Loader from '../components/Loader'

const EditUser = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', role: 'user', isActive: true })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

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
        setError('Could not load user details.')
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
      navigate('/users')
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Could not update user.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <Loader label="Loading user..." />
  }

  return (
    <section className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">Edit User</h2>
      <p className="mt-1 text-sm text-slate-500">Update user details and permissions.</p>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <input
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          placeholder="Name"
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
        />
        <input
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
        />
        <div className="grid gap-3 md:grid-cols-2">
          <select
            value={form.role}
            onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
            className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          >
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="user">User</option>
          </select>
          <select
            value={form.isActive}
            onChange={(event) => setForm((prev) => ({ ...prev, isActive: event.target.value === 'true' }))}
            className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/users')}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default EditUser
