import { AlertCircle, X } from 'lucide-react'

const ConfirmDeleteModal = ({ open, title, description, onCancel, onConfirm, loading, user }) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onCancel}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md card-premium p-0 overflow-hidden shadow-2xl animate-in zoom-in-95 fade-in duration-300">
        <div className="p-8">
          <button 
            onClick={onCancel}
            className="absolute right-4 top-4 h-8 w-8 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>

          <div className="flex flex-col items-center text-center">
            <div className="h-20 w-20 flex items-center justify-center rounded-3xl bg-rose-50 text-rose-600 border border-rose-100 shadow-sm mb-6">
              <AlertCircle size={40} strokeWidth={1.5} />
            </div>
            
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{title}</h3>
            <p className="mt-3 text-sm font-medium text-slate-500 leading-relaxed">
              {description}
            </p>

            {user && (
              <div className="mt-6 w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                 <div className="h-10 w-10 shrink-0 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-400">
                   {user.name?.charAt(0)}
                 </div>
                 <div className="text-left">
                   <p className="text-xs font-bold text-slate-900">{user.name}</p>
                   <p className="text-[10px] font-medium text-slate-400">{user.email}</p>
                 </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 p-6 bg-slate-50/50 border-t border-slate-100/50">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary flex-1"
          >
            Keep Identity
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="flex-[1.5] flex h-11 items-center justify-center gap-2 rounded-2xl bg-rose-600 text-sm font-bold text-white hover:bg-rose-700 transition-all shadow-lg shadow-rose-500/20 disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Processing...
              </div>
            ) : (
              'Confirm Deauthorization'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDeleteModal
