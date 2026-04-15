import { Plus } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosInstance from '../api/axios'
import ConfirmDeleteModal from '../components/ConfirmDeleteModal'
import EmptyState from '../components/EmptyState'
import Loader from '../components/Loader'
import Pagination from '../components/Pagination'
import SearchBar from '../components/SearchBar'
import UserTable from '../components/UserTable'

const PAGE_SIZE = 8

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [showDeleted, setShowDeleted] = useState(false)
  const [showPending, setShowPending] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [deleteUser, setDeleteUser] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = {
        page,
        limit: PAGE_SIZE,
        search: search.trim(),
        role: roleFilter === 'all' ? undefined : roleFilter,
        isDeleted: showDeleted ? 'true' : 'false',
        needsApproval: showPending ? 'true' : undefined,
      }
      
      const response = await axiosInstance.get('/api/users', { params })
      const data = response?.data
      setUsers(data?.data || [])
      setTotalPages(data?.pages || 1)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [page, roleFilter, showDeleted, showPending])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page !== 1) setPage(1)
      else fetchUsers()
    }, 500)
    return () => clearTimeout(timer)
  }, [search])

  const onConfirmDelete = async () => {
    if (!deleteUser) {
      return
    }
    setDeleteLoading(true)
    try {
      await axiosInstance.delete(`/api/users/${deleteUser._id}`)
      setDeleteUser(null)
      await fetchUsers()
    } finally {
      setDeleteLoading(false)
    }
  }

  const onRestoreUser = async (user) => {
    try {
      await axiosInstance.patch(`/api/users/${user._id}/restore`)
      await fetchUsers()
    } catch (error) {
      alert(error.response?.data?.message || 'Restore failed.')
    }
  }

  const onApproveUser = async (user) => {
    try {
      await axiosInstance.patch(`/api/users/${user._id}/approve`)
      await fetchUsers()
    } catch (error) {
      alert(error.response?.data?.message || 'Approval failed.')
    }
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Users</h2>
          <p className="text-sm text-slate-500">Manage users, roles, and account status.</p>
        </div>
        <Link
          to="/users/create"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Create User
        </Link>
      </div>

      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-4 lg:grid-cols-5">
        <div className="md:col-span-2">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by name or email..." />
        </div>
        <select
          value={roleFilter}
          onChange={(event) => {
            setRoleFilter(event.target.value)
            setPage(1)
          }}
          className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="user">User</option>
        </select>
        <div className="flex items-center gap-4 px-2 md:col-span-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showDeleted"
              checked={showDeleted}
              onChange={(e) => {
                setShowDeleted(e.target.checked)
                if (e.target.checked) setShowPending(false)
                setPage(1)
              }}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="showDeleted" className="text-sm font-medium text-slate-700">
              Deleted
            </label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showPending"
              checked={showPending}
              onChange={(e) => {
                setShowPending(e.target.checked)
                if (e.target.checked) setShowDeleted(false)
                setPage(1)
              }}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="showPending" className="text-sm font-medium text-slate-700 whitespace-nowrap">
              Pending Approval
            </label>
          </div>
        </div>
      </div>

      {loading ? (
        <Loader label="Loading users..." />
      ) : users.length ? (
        <>
          <UserTable 
            users={users} 
            onDelete={setDeleteUser} 
            onRestore={onRestoreUser} 
            onApprove={onApproveUser}
          />
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      ) : (
        <EmptyState
          title="No users found"
          description="Try changing search terms or role filter, or create a new user."
          action={
            <Link
              to="/users/create"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Add User
            </Link>
          }
        />
      )}

      <ConfirmDeleteModal
        open={Boolean(deleteUser)}
        title="Delete user?"
        description={`This action will permanently remove ${deleteUser?.name || 'this user'}.`}
        loading={deleteLoading}
        onCancel={() => setDeleteUser(null)}
        onConfirm={onConfirmDelete}
      />
    </section>
  )
}

export default Users
