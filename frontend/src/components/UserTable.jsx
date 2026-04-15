import { Link } from 'react-router-dom'

const roleBadgeClass = {
  admin: 'bg-purple-100 text-purple-700',
  manager: 'bg-blue-100 text-blue-700',
  user: 'bg-slate-100 text-slate-700',
}

const statusBadgeClass = {
  active: 'bg-emerald-100 text-emerald-700',
  inactive: 'bg-amber-100 text-amber-700',
  deleted: 'bg-rose-100 text-rose-700',
  pending: 'bg-purple-100 text-purple-700',
}

const UserTable = ({ users, onDelete, onRestore, onApprove }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              {['Name', 'Email', 'Role', 'Status', 'Actions'].map((head) => (
                <th key={head} className="px-4 py-3 text-left font-semibold text-slate-600">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr key={user._id} className={`${user.isDeleted ? 'bg-slate-50/50 opacity-80' : ''} hover:bg-slate-50`}>
                <td className="px-4 py-3 font-medium text-slate-900">
                  {user.isDeleted ? user.name : user.name}
                  {user.isDeleted && <span className="ml-2 text-[10px] font-bold uppercase text-rose-500">(Deleted)</span>}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {user.isDeleted ? user.email.replace(/^__deleted__\d+_/, '') : user.email}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                      roleBadgeClass[user.role] || roleBadgeClass.user
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                      user.isDeleted
                        ? statusBadgeClass.deleted
                        : user.needsApproval
                        ? statusBadgeClass.pending
                        : user.isActive
                        ? statusBadgeClass.active
                        : statusBadgeClass.inactive
                    }`}
                  >
                    {user.isDeleted ? 'Deleted' : user.needsApproval ? 'Pending' : user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {user.isDeleted ? (
                      <button
                        type="button"
                        onClick={() => onRestore(user)}
                        className="text-xs font-bold text-rose-600 hover:text-rose-700"
                      >
                        Restore
                      </button>
                    ) : user.needsApproval ? (
                      <>
                        <button
                          type="button"
                          onClick={() => onApprove(user)}
                          className="text-xs font-bold text-purple-600 hover:text-purple-700"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(user)}
                          className="text-xs font-semibold text-red-600 hover:text-red-700"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <>
                        <Link to={`/users/${user._id}`} className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                          View
                        </Link>
                        <Link to={`/users/${user._id}/edit`} className="text-xs font-semibold text-amber-600 hover:text-amber-700">
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => onDelete(user)}
                          className="text-xs font-semibold text-red-600 hover:text-red-700"
                        >
                          Delete
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
