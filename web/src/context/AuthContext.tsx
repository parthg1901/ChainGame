import * as React from 'react'

import { AuthContextType, IAuth } from '../@types/auth'

export const AuthContext = React.createContext<AuthContextType | null>(null)

const AuthProvider = ({ children }: { children: any }) => {
  const [auth, setAuth] = React.useState<IAuth>({
    authType: undefined,
  })
  const updateAuth = (auth: IAuth) => {
    setAuth({ authType: auth.authType })
  }
  return (
    <AuthContext.Provider value={{ auth, updateAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
