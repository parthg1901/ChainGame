import { Env } from '../../env'
import { getToken } from './getToken'
import { setTokenInfo } from './setTokenInfo'

export async function buyToken(
  request: {
    owner: string
    receiver: string
    t_index: number
  },
  env: Env
) {
  const token = await getToken(request, env)
  const body = {
    owner: request.owner,
    receiver: request.receiver,
    t_index: Number(request.t_index),
    last_updated: parseInt((Date.now() / 1000).toFixed(0)),
    curr_link: 0,
    active_till: parseInt((Date.now() / 1000 + token!.duration).toFixed(0)),
  }
  console.log(body)
  const id = await setTokenInfo(body, env)
  return { token, id }
}
