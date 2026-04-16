import { SearchX } from 'lucide-react'

const EmptyState = ({ title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in duration-700">
      <div className="relative mb-6">
        <div className="absolute inset-0 animate-pulse rounded-full bg-slate-100/50" />
        <div className="relative h-20 w-20 flex items-center justify-center rounded-3xl bg-slate-50 text-slate-300 border border-slate-100 shadow-sm">
          <SearchX size={40} strokeWidth={1.5} />
        </div>
      </div>
      
      <div className="max-w-sm space-y-2">
        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">{title}</h3>
        <p className="text-sm font-medium text-slate-500 leading-relaxed">
          {description}
        </p>
      </div>

      {action && (
        <div className="mt-8 animate-in slide-in-from-bottom-2 duration-500 delay-200">
          {action}
        </div>
      )}
    </div>
  )
}

export default EmptyState
