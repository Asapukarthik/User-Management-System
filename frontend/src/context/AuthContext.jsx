import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance, { setUnauthorizedHandler, TOKEN_KEY } from '../api/axios'
import AuthContext from './auth-context'

const USER_KEY = 'ums_user'
const REFRESH_TOKEN_KEY = 'ums_refresh_token'

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate()
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(() => getStoredUser())
  const [loading, setLoading] = useState(true)

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
  }, [])

  const logout = useCallback(() => {
    clearSession()
    navigate('/login', { replace: true })
  }, [clearSession, navigate])

  const hydrateProfile = useCallback(async () => {
    if (!localStorage.getItem(TOKEN_KEY)) {
      setLoading(false)
      return
    }

    try {
      const response = await axiosInstance.get('/api/profile')
      const profile =
        response?.data?.data?.user ??
        response?.data?.data ??
        response?.data?.user ??
        response?.data

      if (profile) {
        localStorage.setItem(USER_KEY, JSON.stringify(profile))
        setUser(profile)
      }
    } catch {
      // If profile fails, check if we have a refresh token before clearing
      if (!localStorage.getItem(REFRESH_TOKEN_KEY)) {
        clearSession()
      }
    } finally {
      setLoading(false)
    }
  }, [clearSession])

  const login = useCallback(async (credentials) => {
    const response = await axiosInstance.post('/api/auth/login', credentials)
    const payload = response?.data?.data ?? response?.data ?? {}
    const jwt = payload.accessToken || payload.token
    const refreshJwt = payload.refreshToken
    const profile = payload.user ?? response?.data?.user ?? null

    if (!jwt) {
      throw new Error('Token missing from login response')
    }

    localStorage.setItem(TOKEN_KEY, jwt)
    if (refreshJwt) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshJwt)
    }
    setToken(jwt)

    if (profile) {
      localStorage.setItem(USER_KEY, JSON.stringify(profile))
      setUser(profile)
    } else {
      await hydrateProfile()
    }

    return profile
  }, [hydrateProfile])

  const updateLocalUser = useCallback((patch) => {
    setUser((prev) => {
      const nextUser = { ...prev, ...patch }
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
      return nextUser
    })
  }, [])

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearSession()
      navigate('/login', { replace: true })
    })
    hydrateProfile()
  }, [clearSession, hydrateProfile, navigate])

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token && user),
      role: user?.role?.toLowerCase?.() ?? null,
      login,
      logout,
      setUser: updateLocalUser,
      refreshProfile: hydrateProfile,
    }),
    [user, token, loading, login, logout, updateLocalUser, hydrateProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
