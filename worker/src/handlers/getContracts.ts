import { createKysely } from '../db/kysely'
import { Env } from '../env'

export async function getContracts(env: Env) {
  const db = createKysely(env)
  const contracts = await db.selectFrom('contracts').selectAll().execute()

  return Response.json(contracts, {
    status: 200,
  })
}
