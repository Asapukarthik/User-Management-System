import { Inbox } from 'lucide-react'

const EmptyState = ({ title, description, action }) => {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <div className="mb-4 rounded-full bg-slate-100 p-3 text-slate-500">
        <Inbox className="h-5 w-5" />
      </div>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-slate-500">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}

export default EmptyState
