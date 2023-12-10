export interface IAuth {
  authType: 'contract' | 'user' | undefined
}
export type AuthContextType = {
  auth: IAuth
  updateAuth: (auth: IAuth) => void
}
