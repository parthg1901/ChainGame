import { createKysely } from '../../db/kysely'
import { Env } from '../../env'
import { Token } from '../../models'
import { parseTokenFromDB } from './utils'

export async function getToken(
  request: {
    owner: string
    receiver: string
    t_index: number
  },
  env: Env
): Promise<Token | null> {
  const db = createKysely(env)
  console.log("here")
  console.log(Number(request.t_index))
  const record = await db
    .selectFrom('tokens')
    .selectAll()
    .where('receiver', '=', request.receiver)
    .where('t_index', '=', Number(request.t_index))
    .executeTakeFirst()

  if (!record) {
    return null
  }
  const token = parseTokenFromDB(record)
  return token
}
