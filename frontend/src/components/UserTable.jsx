import { Link } from 'react-router-dom'
import { Eye, Edit2, Trash2, RotateCcw, CheckCircle } from 'lucide-react'

const roleBadgeClass = {
  admin: 'bg-purple-50 text-purple-700 ring-purple-100',
  manager: 'bg-blue-50 text-blue-700 ring-blue-100',
  user: 'bg-slate-50 text-slate-700 ring-slate-100',
}

const statusBadgeClass = {
  active: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  inactive: 'bg-amber-50 text-amber-700 ring-amber-100',
  deleted: 'bg-rose-50 text-rose-700 ring-rose-100',
  pending: 'bg-indigo-50 text-indigo-700 ring-indigo-100',
}

const UserTable = ({ users, onDelete, onRestore, onApprove }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-sm shadow-slate-100/50">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              {['User Instance', 'Email Address', 'Access Level', 'Status', 'Actions'].map((head, i) => (
                <th key={head} className={`px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 ${i === 4 ? 'text-right' : ''}`}>
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user._id} className="group transition-colors hover:bg-slate-50/80">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-700 font-bold shadow-inner">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className={`text-sm font-semibold leading-none ${user.isDeleted ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                        {user.name}
                      </p>
                      {user.isDeleted && <span className="mt-1 block text-[10px] font-bold uppercase tracking-tighter text-rose-500">Deactivated</span>}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-slate-600">
                    {user.isDeleted ? user.email.replace(/^__deleted__\d+_/, '') : user.email}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-lg px-2 py-1 text-[11px] font-bold uppercase tracking-wide ring-1 ring-inset ${
                      roleBadgeClass[user.role] || roleBadgeClass.user
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-bold uppercase tracking-wide ring-1 ring-inset ${
                      user.isDeleted
                        ? statusBadgeClass.deleted
                        : user.needsApproval
                        ? statusBadgeClass.pending
                        : user.isActive
                        ? statusBadgeClass.active
                        : statusBadgeClass.inactive
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
                    {user.isDeleted ? 'Deleted' : user.needsApproval ? 'Pending' : user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    {user.isDeleted ? (
                      <button
                        type="button"
                        onClick={() => onRestore(user)}
                        title="Restore User"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-rose-600 transition-all hover:bg-rose-50 hover:border-rose-200"
                      >
                        <RotateCcw size={16} />
                      </button>
                    ) : user.needsApproval ? (
                      <>
                        <button
                          type="button"
                          onClick={() => onApprove(user)}
                          title="Approve User"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-primary-600 transition-all hover:bg-primary-50 hover:border-primary-200"
                        >
                          <CheckCircle size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(user)}
                          title="Reject User"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-rose-600 transition-all hover:bg-rose-50 hover:border-rose-200"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to={`/users/${user._id}`}
                          title="View Details"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-all hover:bg-slate-50 hover:text-primary-600"
                        >
                          <Eye size={16} />
                        </Link>
                        <Link
                          to={`/users/${user._id}/edit`}
                          title="Edit User"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-all hover:bg-slate-50 hover:text-amber-600"
                        >
                          <Edit2 size={16} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => onDelete(user)}
                          title="Delete User"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-all hover:bg-slate-50 hover:text-rose-600 hover:border-rose-200"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UserTable
