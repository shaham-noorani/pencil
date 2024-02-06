import { createContext, useState, ReactNode } from "react"

interface UserContextProps {
  children: ReactNode
}

const UserContext = createContext({})

export const UserProvider = ({ children }: UserContextProps) => {
  const [user, setUser] = useState({})

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserContext
