import { ChevronLeft, ChevronRight } from 'lucide-react'

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
        Level {currentPage} <span className="mx-1">/</span> {totalPages}
      </p>
      
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="h-9 w-9 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-primary-600 hover:border-primary-100 disabled:opacity-30 disabled:hover:text-slate-500 disabled:hover:border-slate-200 transition-all shadow-sm"
        >
          <ChevronLeft size={18} />
        </button>
        
        <div className="flex items-center gap-1">
          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1
            // Simple logic: show first, last, and pages around current
            if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`h-9 w-9 rounded-xl text-xs font-bold transition-all ${
                    currentPage === page 
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20' 
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {page}
                </button>
              )
            }
            if (page === currentPage - 2 || page === currentPage + 2) {
              return <span key={page} className="px-1 text-slate-300">...</span>
            }
            return null
          })}
        </div>

        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="h-9 w-9 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:text-primary-600 hover:border-primary-100 disabled:opacity-30 disabled:hover:text-slate-500 disabled:hover:border-slate-200 transition-all shadow-sm"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}

export default Pagination
