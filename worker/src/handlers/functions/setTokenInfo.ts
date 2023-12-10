import { createKysely } from '../../db/kysely'
import { Env } from '../../env'
import { TokenInfo } from '../../models'

export async function setTokenInfo(tokenData: TokenInfo, env: Env) {
  const db = createKysely(env)
  const token_index = (await db.selectFrom('tokenInfo').selectAll().execute()).length
  await db.insertInto('tokenInfo').values(tokenData).executeTakeFirst()
  console.log(token_index)
  return token_index
}
