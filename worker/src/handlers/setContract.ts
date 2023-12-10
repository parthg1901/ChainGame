import { verifyMessage } from 'ethers/lib/utils'
import { IRequest } from 'itty-router'

import { Env } from '../env'
import { ZodContract } from '../models'
import { get } from './functions/get'
import { set } from './functions/set'

export async function setContract(
  request: IRequest,
  env: Env
): Promise<Response> {
  const body = await request.json()
  const safeParse = ZodContract.safeParse(body)

  if (!safeParse.success) {
    const response = { success: false, error: safeParse.error }
    return Response.json(response, { status: 400 })
  }

  const { owner, contract } = safeParse.data

  // Check if the Contract is already taken
  const existingContract = await get(contract, env)

  // If the Contract is owned by someone else, return an error
  if (existingContract && existingContract.owner !== owner) {
    const response = { success: false, error: 'Contract already taken' }
    return Response.json(response, { status: 409 })
  }

  // Save the Contract
  try {
    await set(safeParse.data, env)
    const response = { success: true }
    return Response.json(response, { status: 201 })
  } catch (err) {
    console.error(err)
    const response = { success: false, error: 'Error setting Contract' }
    return Response.json(response, { status: 500 })
  }
}
