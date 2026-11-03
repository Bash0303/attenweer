import { createContext, useContext, useEffect, useState } from 'react'
import { api, getToken, setToken } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    if (!getToken()) {
      setReady(true)
      return
    }
    api('/auth/me')
      .then((res) => {
        if (!cancelled) setUser(res.user)
      })
      .catch(() => {
        setToken(null)
        if (!cancelled) setUser(null)
      })
      .finally(() => {
        if (!cancelled) setReady(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const login = async (identifier, password) => {
    try {
      const res = await api('/auth/login', { method: 'POST', body: { identifier, password } })
      setToken(res.token)
      setUser(res.user)
      return { ok: true, user: res.user }
    } catch (err) {
      return { ok: false, error: err.message || 'Login failed.' }
    }
  }

  const logout = async () => {
    try {
      if (getToken()) await api('/auth/logout', { method: 'POST' })
    } catch {
      // token may already be invalid — clear anyway
    }
    setToken(null)
    setUser(null)
  }

  const refresh = async () => {
    const res = await api('/auth/me')
    setUser(res.user)
    return res.user
  }

  return (
    <AuthContext.Provider value={{ user, ready, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
