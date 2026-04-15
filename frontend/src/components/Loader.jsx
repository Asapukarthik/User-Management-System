import { LoaderCircle } from 'lucide-react'

const Loader = ({ fullScreen = false, label = 'Loading...' }) => {
  return (
    <div
      className={
        fullScreen
          ? 'flex min-h-screen items-center justify-center bg-slate-50'
          : 'flex min-h-40 items-center justify-center'
      }
    >
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-600 shadow-sm">
        <LoaderCircle className="h-5 w-5 animate-spin text-blue-600" />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </div>
  )
}

export default Loader
