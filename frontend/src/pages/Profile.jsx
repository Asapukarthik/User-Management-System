import { useState } from 'react'
import { User, Mail, Shield, Camera, Lock } from 'lucide-react'
import axiosInstance from '../api/axios'
import useAuth from '../hooks/useAuth'

const Profile = () => {
  const { user, setUser } = useAuth()
  const [name, setName] = useState(user?.name || '')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    try {
      const payload = { name }
      if (password.trim()) {
        payload.password = password
      }
      const response = await axiosInstance.put(`/api/users/${user?._id}`, payload)
      const updatedUser = response?.data?.data?.user ?? response?.data?.user
      setUser(updatedUser || { ...user, name })
      setPassword('')
      setMessage('Your security profile has been updated successfully.')
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Authorization error while updating profile.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Account Settings</h1>
        <p className="text-sm font-medium text-slate-500">Configure your personal preferences and security credentials.</p>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="card-premium p-6 text-center">
            <div className="relative mx-auto w-24 h-24 mb-4">
              <div className="w-full h-full rounded-3xl bg-primary-100 flex items-center justify-center text-primary-700 text-3xl font-bold shadow-inner">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </div>
            <h3 className="text-lg font-bold text-slate-900 leading-tight">{user?.name}</h3>
            <p className="text-xs font-bold text-primary-600 uppercase tracking-widest mt-1">{user?.role}</p>
          </div>

          <div className="card-premium p-5 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Security Status</h4>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-sm font-semibold text-slate-700">Identity Verified</p>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <Shield size={16} />
              <p className="text-xs font-medium italic">RBAC protection enabled</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card-premium">
            <div className="p-6 border-b border-slate-100 bg-slate-50/30">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">General Information</h3>
            </div>
            <form className="p-8 space-y-6" onSubmit={handleSubmit}>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Identity</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input
                      readOnly
                      value={user?.email || ''}
                      className="input-premium pl-10 bg-slate-50 text-slate-400 cursor-not-allowed border-slate-100"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Display Name</label>
                  <div className="relative group">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="input-premium pl-10"
                      placeholder="Your full name"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Authentication Update</label>
                <div className="relative group">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter new passphrase (optional)"
                    className="input-premium pl-10"
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-medium italic">Leave blank if you do not wish to rotate your credentials.</p>
              </div>

              {message && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-xs font-bold text-emerald-600 border border-emerald-100 transition-all duration-300">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  {message}
                </div>
              )}
              {error && (
                <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-4 text-xs font-bold text-rose-600 border border-rose-100 transition-all duration-300">
                  <div className="h-1.5 w-1.5 rounded-full bg-rose-600" />
                  {error}
                </div>
              )}

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary px-8"
                >
                  {loading ? 'Synchronizing...' : 'Save Configuration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
