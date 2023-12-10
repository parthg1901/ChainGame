import { createKysely } from '../../db/kysely'
import { Env } from '../../env'
import { parseTokenFromDB } from './utils'

export async function updateTokenInfo(
  request: {
    currContract: string
    currTokenIndex: number
  },
  env: Env
) {
  const db = createKysely(env)

  await db
    .updateTable('tokenInfo')
    .set((eb) => ({
      curr_link: eb('curr_link', '+', 1),
      last_updated: Date.now() / 1000,
    }))
    .where('token_index', '=', request.currTokenIndex)
    .executeTakeFirst()
  const tokenInfo = await db
    .selectFrom('tokenInfo')
    .selectAll()
    .where('token_index', '=', request.currTokenIndex)
    .where('receiver', '=', request.currContract)
    .executeTakeFirst()
  const token = await db
    .selectFrom('tokens')
    .selectAll()
    .where('t_index', '=', tokenInfo?.t_index)
    .where('receiver', '=', request.currContract)
    .executeTakeFirst()
  const parsedToken = parseTokenFromDB(token!)

  const result = [
    tokenInfo?.owner!,
    tokenInfo?.receiver!,
    request?.currTokenIndex,
    parsedToken?.links[0],
    token?.destination_chain_selector!,
  ]
  return result
}
