import { createContext, useContext, useState } from 'react'
import { demoUsers } from '../data/mock'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const login = (email, password) => {
    const entry = Object.values(demoUsers).find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
    )
    if (entry) {
      setUser(entry)
      return { ok: true, user: entry }
    }
    return { ok: false, error: 'Invalid email or password. Try a demo account below.' }
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
