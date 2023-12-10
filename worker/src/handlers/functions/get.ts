import { createKysely } from '../../db/kysely'
import { Env } from '../../env'
import { Contract } from '../../models'

export async function get(
  contract: string,
  env: Env
): Promise<Contract | null> {
  const db = createKysely(env)
  const record = await db
    .selectFrom('contracts')
    .selectAll()
    .where('contract', '=', contract)
    .executeTakeFirst()

  if (!record) {
    return null
  }

  return record
}
