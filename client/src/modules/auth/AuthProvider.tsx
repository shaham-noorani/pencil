import { createContext, useState, ReactNode } from "react"

interface AuthContextProps {
  children: ReactNode
}

const AuthContext = createContext({})

export const AuthProvider = ({ children }: AuthContextProps) => {
  const [auth, setAuth] = useState({})

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
