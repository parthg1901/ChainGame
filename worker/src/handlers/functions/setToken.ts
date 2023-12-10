import { createKysely } from '../../db/kysely'
import { Env } from '../../env'
import { Token } from '../../models'
import { stringifyTokenForDb } from './utils'

export async function setToken(tokenData: Token, env: Env) {
  const db = createKysely(env)
  const body = stringifyTokenForDb(tokenData)
  console.log(JSON.stringify(body))
  const t_index = (await db.selectFrom('tokens').selectAll().where('receiver', '=', body.receiver).execute()).length
  await db.insertInto('tokens').values({...body, t_index}).executeTakeFirst()
  return t_index
}
