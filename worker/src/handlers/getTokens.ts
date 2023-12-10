import { IRequest } from 'itty-router'
import zod from 'zod'

import { createKysely } from '../db/kysely'
import { Env } from '../env'

export async function getTokens(request: IRequest, env: Env) {
  const schema = zod.object({
    receiver: zod.string(),
  })
  const body = await request.json()
  const safeParse = schema.safeParse(body)

  if (!safeParse.success) {
    const response = { success: false, error: safeParse.error }
    return Response.json(response, { status: 400 })
  }

  const { receiver } = safeParse.data
  console.log(receiver)
  const db = createKysely(env)
  const tokens = await db
    .selectFrom('tokens')
    .selectAll()
    .where('receiver', '=', receiver)
    .execute()

  return Response.json(tokens, {
    status: 200,
  })
}
