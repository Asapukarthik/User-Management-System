const StatCard = ({ title, value, hint, icon: Icon }) => {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        {Icon ? (
          <div className="rounded-lg bg-blue-50 p-2 text-blue-700">
            <Icon className="h-4 w-4" />
          </div>
        ) : null}
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{hint}</p>
    </article>
  )
}

export default StatCard
