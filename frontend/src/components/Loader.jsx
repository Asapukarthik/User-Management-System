import { Loader2 } from 'lucide-react'

const Loader = ({ fullScreen = false, label = 'Synchronizing...' }) => {
  return (
    <div
      className={
        fullScreen
          ? 'fixed inset-0 z-[9999] flex items-center justify-center bg-white/60 backdrop-blur-md'
          : 'flex min-h-[300px] w-full items-center justify-center'
      }
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-full bg-primary-400/20" />
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-xl ring-1 ring-slate-100">
            <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
          </div>
        </div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
           {label}
        </p>
      </div>
    </div>
  )
}

export default Loader
