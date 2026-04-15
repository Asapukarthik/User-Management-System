import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axiosInstance from '../api/axios'
import Loader from '../components/Loader'

const row = (label, value) => (
  <div className="grid grid-cols-3 gap-3 border-b border-slate-100 py-2 text-sm" key={label}>
    <span className="font-medium text-slate-600">{label}</span>
    <span className="col-span-2 text-slate-900">{value || '-'}</span>
  </div>
)

const formatDate = (value) => (value ? format(new Date(value), 'dd MMM yyyy, hh:mm a') : '-')

const UserDetails = () => {
  const { id } = useParams()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(`/api/users/${id}`)
        setUser(response?.data?.data || null)
      } catch (error) {
        console.error('Error fetching user:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [id])

  if (loading) {
    return <Loader label="Loading user details..." />
  }

  if (!user) {
    return <p className="text-sm text-slate-500">User not found.</p>
  }

  return (
    <section className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">User Details</h2>
        <Link to={`/users/${id}/edit`} className="rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white">
          Edit User
        </Link>
      </div>
      {[
        row('Name', user.name),
        row('Email', user.email),
        row('Role', user.role),
        row('Status', user.status),
        row('Created At', formatDate(user.createdAt)),
        row('Updated At', formatDate(user.updatedAt)),
        row('Created By', user.createdBy?.name || user.createdBy),
        row('Updated By', user.updatedBy?.name || user.updatedBy),
      ]}
    </section>
  )
}

export default UserDetails
