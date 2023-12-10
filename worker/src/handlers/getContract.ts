import type { IRequest } from 'itty-router'
import zod from 'zod'

import { Env } from '../env'
import { createKysely } from '../db/kysely'

export async function getContract(request: IRequest, env: Env) {
  const schema = zod.object({
    owner: zod.string(),
  })
  const safeParse = schema.safeParse(request.params)

  if (!safeParse.success) {
    const response = { error: safeParse.error }
    return Response.json(response, { status: 400 })
  }

  const { owner } = safeParse.data

  const db = createKysely(env)
  const record = await db
    .selectFrom('contracts')
    .selectAll()
    .where('owner', '=', owner)
    .executeTakeFirst()

  if (record === undefined) {
    return new Response('contract not found', { status: 404 })
  }

  return Response.json(record, {
    status: 200,
  })
}
