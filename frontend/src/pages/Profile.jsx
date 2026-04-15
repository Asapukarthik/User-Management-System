import { useState } from 'react'
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
      setUser(updatedUser || { name })
      setPassword('')
      setMessage('Profile updated successfully.')
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Could not update profile.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">My Profile</h2>
      <p className="mt-1 text-sm text-slate-500">Update your basic account information.</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
          <input
            readOnly
            value={user?.email || ''}
            className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5 text-sm text-slate-600"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Name</label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">New Password</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Leave blank to keep current password"
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          />
        </div>

        {message ? <p className="text-sm font-medium text-emerald-600">{message}</p> : null}
        {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </section>
  )
}

export default Profile
