import { Plus, Search, Filter, Download, UserPlus } from 'lucide-react'
import { useEffect, useState } from 'react'
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
    if (!deleteUser) return
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">User Directory</h1>
          <p className="text-sm font-medium text-slate-500">Manage digital identities and security credentials.</p>
        </div>
        <div className="flex items-center gap-3">

          <Link to="/users/create" className="btn-primary h-11 px-6">
            <UserPlus size={18} />
            Create Instance
          </Link>
        </div>
      </header>

      <div className="card-premium overflow-hidden">
        <div className="grid gap-4 p-6 sm:grid-cols-4 lg:grid-cols-5 border-b border-slate-100 bg-slate-50/30">
          <div className="sm:col-span-2">
            <SearchBar value={search} onChange={setSearch} placeholder="Search by name or email..." />
          </div>
          <select
            value={roleFilter}
            onChange={(event) => {
              setRoleFilter(event.target.value)
              setPage(1)
            }}
            className="input-premium py-2 cursor-pointer"
          >
            <option value="all">Global Search</option>
            <option value="admin">Administrators</option>
            <option value="manager">Managers</option>
            <option value="user">Standard Users</option>
          </select>
          <div className="flex items-center gap-4 px-2 sm:col-span-2 lg:col-span-2">
            <button
              onClick={() => setShowDeleted(!showDeleted)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all ${showDeleted ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-200' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}
            >
              <Filter size={14} />
              {showDeleted ? 'Showing Deleted' : 'Active Only'}
            </button>
            <button
              onClick={() => setShowPending(!showPending)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all ${showPending ? 'bg-indigo-50 text-indigo-600 ring-1 ring-indigo-200' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}
            >
              <Filter size={14} />
              {showPending ? 'Pending Approval' : 'All Requests'}
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-primary-600" />
            <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Synchronizing directory...</p>
          </div>
        ) : users.length ? (
          <div className="animate-in fade-in duration-500">
            <UserTable
              users={users}
              onDelete={setDeleteUser}
              onRestore={onRestoreUser}
              onApprove={onApproveUser}
            />
            <div className="p-6 border-t border-slate-100 bg-slate-50/10">
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          </div>
        ) : (
          <div className="py-20">
            <EmptyState
              title="No identities found"
              description="Refine your search parameters or check the filters to find what you're looking for."
              action={
                <Link to="/users/create" className="btn-primary">
                  <Plus size={18} />
                  Add New User
                </Link>
              }
            />
          </div>
        )}
      </div>

      <ConfirmDeleteModal
        open={Boolean(deleteUser)}
        title="Archive User Identity?"
        description={`Are you sure you want to deauthorize and archive ${deleteUser?.name || 'this user'}? This action can be reversed by an admin.`}
        loading={deleteLoading}
        onCancel={() => setDeleteUser(null)}
        onConfirm={onConfirmDelete}
      />
    </div>
  )
}

export default Users
