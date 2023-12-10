import { CamelCasePlugin, Kysely } from 'kysely'
import { D1Dialect } from 'kysely-d1'

import { Env } from '../env'
import { ContractInKysely, TokenInKysely, TokenInfoInKysely } from '../models'

export interface Database {
  contracts: ContractInKysely
  tokens: TokenInKysely
  tokenInfo: TokenInfoInKysely
}

export function createKysely(env: Env): Kysely<Database> {
  return new Kysely<Database>({
    dialect: new D1Dialect({ database: env.DB }),
    plugins: [new CamelCasePlugin()],
  })
}
