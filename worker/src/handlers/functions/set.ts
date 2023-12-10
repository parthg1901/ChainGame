import { createKysely } from '../../db/kysely'
import { Env } from '../../env'
import { Contract } from '../../models'

export async function set(contractData: Contract, env: Env) {
  const db = createKysely(env)

  await db
    .insertInto('contracts')
    .values(contractData)
    .onConflict((oc) => oc.column('contract').doUpdateSet(contractData))
    .execute()
}
