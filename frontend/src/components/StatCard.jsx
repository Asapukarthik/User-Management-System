const StatCard = ({ title, value, hint, icon: Icon, trend }) => {
  return (
    <div className="card-premium group p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 leading-none">
            {value}
          </h3>
          {hint && (
            <p className="mt-2 text-xs font-medium text-slate-400 flex items-center gap-1.5 leading-none">
              {hint}
            </p>
          )}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 transition-all duration-300 group-hover:bg-primary-50 group-hover:text-primary-600 group-hover:scale-110">
          <Icon size={24} strokeWidth={2} />
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center gap-2">
          <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
          <span className="text-xs text-slate-400 font-medium tracking-tight">vs last month</span>
        </div>
      )}
    </div>
  )
}

export default StatCard
