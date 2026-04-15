import { Copy, Eye, EyeOff, RefreshCcw } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../api/axios'

const initialForm = {
  name: '',
  email: '',
  password: '',
  role: 'user',
  isActive: true,
}

const CreateUser = () => {
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+'
    let password = ''
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setForm((prev) => ({ ...prev, password }))
    setShowPassword(true)
  }

  const updateField = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      await axiosInstance.post('/api/users', form)
      navigate('/users')
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Could not create user.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">Create User</h2>
      <p className="mt-1 text-sm text-slate-500">Add a new user account with role permissions.</p>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <input
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          placeholder="Name"
          value={form.name}
          onChange={(event) => updateField('name', event.target.value)}
        />
        <input
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(event) => updateField('email', event.target.value)}
        />
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={form.password}
              onChange={(event) => updateField('password', event.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <button
            type="button"
            onClick={generatePassword}
            title="Generate secure password"
            className="flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-3 hover:bg-slate-100"
          >
            <RefreshCcw size={16} className="text-slate-600" />
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <select
            value={form.role}
            onChange={(event) => updateField('role', event.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          >
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="user">User</option>
          </select>
          <select
            value={form.isActive}
            onChange={(event) => updateField('isActive', event.target.value === 'true')}
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
            disabled={loading}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default CreateUser
