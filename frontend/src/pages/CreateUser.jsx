import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { User, Mail, Lock, Shield, ArrowLeft, CheckCircle, RefreshCcw, Eye, EyeOff } from 'lucide-react'
import axiosInstance from '../api/axios'

const CreateUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    isActive: true,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+'
    let password = ''
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setFormData((prev) => ({ ...prev, password }))
    setShowPassword(true)
  }

  const handleChange = (event) => {
    const { id, value, type, checked } = event.target
    setFormData((prev) => ({
      ...prev,
      [id]: type === 'checkbox' ? (id === 'isActive' ? checked : value) : value,
    }))
  }

  // Custom handler for selects since they don't have IDs sometimes in the template
  const handleSelectChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: id === 'isActive' ? value === 'true' : value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      await axiosInstance.post('/api/users', formData)
      setSuccess(true)
      setTimeout(() => navigate('/users'), 2000)
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Failed to initialize user identity.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] animate-in fade-in zoom-in duration-500">
        <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <CheckCircle size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Identity Provisioned</h2>
        <p className="mt-2 text-slate-500 font-medium">The new security profile has been initialized.</p>
        <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-slate-400">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
          Synchronizing directory...
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
            Directory Index
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Provision User</h1>
          <p className="text-sm font-medium text-slate-500">Initialize a new secure access profile for your organization.</p>
        </div>
      </header>

      <div className="card-premium overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Profile Configuration</h3>
          <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-md uppercase tracking-wider">New Identity</span>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Legal Name</label>
                <div className="relative group">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-premium pl-10"
                    placeholder="Full identity name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Workspace</label>
                <div className="relative group">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-premium pl-10"
                    placeholder="name@company.com"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="password" className="text-xs font-bold text-slate-500 uppercase tracking-wider flex justify-between">
                  Access Passphrase
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="text-[10px] font-bold text-primary-600 hover:text-primary-700 uppercase tracking-widest flex items-center gap-1"
                  >
                    <RefreshCcw size={10} />
                    Auto-Generate
                  </button>
                </label>
                <div className="relative group">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    className="input-premium pl-10 pr-10"
                    placeholder="Secure access token"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="grid gap-4 grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="role" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Scope</label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="input-premium cursor-pointer"
                  >
                    <option value="user">User</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="isActive" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Initial State</label>
                  <select
                    id="isActive"
                    value={formData.isActive ? 'true' : 'false'}
                    onChange={(e) => handleSelectChange('isActive', e.target.value)}
                    className="input-premium cursor-pointer"
                  >
                    <option value="true">Active</option>
                    <option value="false">Suspended</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100/50">
            <div className="flex items-start gap-4">
              <div className="mt-1 h-10 w-10 shrink-0 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center">
                <Shield size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Security Enforcement</h4>
                <p className="text-xs font-medium text-slate-500 mt-1 leading-relaxed">
                  This identity will be protected by Role-Based Access Control (RBAC).
                  Ensure the scope matches the user's required operational clearancce.
                </p>
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
            <Link to="/users" className="btn-secondary px-8">
              Abort
            </Link>
            <button type="submit" disabled={loading} className="btn-primary px-10">
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Processing...
                </div>
              ) : 'Finalize Provisioning'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateUser
