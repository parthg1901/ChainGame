import { Insertable, Selectable } from 'kysely'

import { Token, TokenInKysely } from '../../models'

type SelectableKysely = Selectable<TokenInKysely>
type InsertableKysely = Insertable<TokenInKysely>

export function parseTokenFromDB(token: SelectableKysely): Token
export function parseTokenFromDB(token: SelectableKysely[]): Token[]
export function parseTokenFromDB(
  token: SelectableKysely | SelectableKysely[]
): Token | Token[] {
  if (Array.isArray(token)) {
    return token.map(parseToken)
  }

  return parseToken(token)

  function parseToken(token: SelectableKysely) {
    return {
      ...token,
      links: JSON.parse(token.links),
    }
  }
}

export function stringifyTokenForDb(token: Token): InsertableKysely
export function stringifyTokenForDb(token: Token[]): InsertableKysely[]
export function stringifyTokenForDb(
  token: Token | Token[]
): InsertableKysely | InsertableKysely[] {
  if (Array.isArray(token)) {
    return token.map(stringifyToken)
  }

  return stringifyToken(token)

  function stringifyToken(token: Token) {
    return {
      ...token,
      links: JSON.stringify(token.links),
    }
  }
}
