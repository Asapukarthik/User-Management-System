import { Eye, EyeOff, Lock, Mail, Shield, User, Briefcase } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axiosInstance from '../api/axios'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    role: 'user',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.id]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim() || !formData.passwordConfirm.trim()) {
      setError('Please fill in all required fields.')
      return
    }

    if (formData.password !== formData.passwordConfirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    setError('')

    try {
      await axiosInstance.post('/api/auth/register', formData)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (requestError) {
      setError(requestError?.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fbfcfd] p-4">
        <div className="card-premium max-w-md p-10 text-center animate-in fade-in zoom-in duration-500">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner">
            <Shield size={32} />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-slate-900">Registration Request Sent!</h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            Your account has been created successfully. An administrator will review your application shortly.
          </p>
          <div className="mt-8 flex items-center justify-center gap-2 text-sm font-semibold text-slate-400">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
            Redirecting to login...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fbfcfd] p-4">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-1/2 w-1/2 rounded-full bg-primary-100/30 blur-[100px]" />
        <div className="absolute -bottom-1/4 -right-1/4 h-1/2 w-1/2 rounded-full bg-indigo-100/30 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-[480px]">
        <div className="card-premium p-10">
          <div className="mb-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-xl shadow-primary-500/20">
              <User size={28} strokeWidth={2.5} />
            </div>
            <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900">Get Started</h1>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Join our enterprise user management system
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-semibold text-slate-700">Full Name</label>
              <div className="relative group">
                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary-500" />
                <input id="name" type="text" value={formData.name} onChange={handleChange} className="input-premium pl-11" placeholder="John Doe" required />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-slate-700">Email Address</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary-500" />
                <input id="email" type="email" value={formData.email} onChange={handleChange} className="input-premium pl-11" placeholder="john@company.com" required />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-slate-700">Password</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary-500" />
                <input id="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} className="input-premium pl-11 pr-11" placeholder="••••••••" required minLength="6" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="passwordConfirm" className="text-sm font-semibold text-slate-700">Confirm Password</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary-500" />
                <input id="passwordConfirm" type={showPasswordConfirm ? 'text' : 'password'} value={formData.passwordConfirm} onChange={handleChange} className="input-premium pl-11 pr-11" placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPasswordConfirm(!showPasswordConfirm)} className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 transition-colors">
                  {showPasswordConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>



            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-4 text-xs font-bold text-rose-600 border border-rose-100">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-600 animate-pulse" />
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full h-12 text-base mt-2">
              {loading ? 'Processing...' : 'Create My Account'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm font-medium text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-primary-600 hover:text-primary-700 transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
