import { makeApp } from '../ccip-read/server'
import { Env } from '../env'

export const getCcipRead = async (request: Request, env: Env) => {
  const ccipRouter = makeApp(env.PRIVATE_KEY, '/ccip/', env)
  return ccipRouter.handle(request)
}
