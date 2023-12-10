import z from 'zod'

export const ZodContract = z.object({
  owner: z.string(),
  contract: z.string(),
  description: z.string(),
  avatar: z.string(),
  destination_chain_selector: z.number(),
})

export const ZodContractWithSignature = ZodContract.extend({
  signature: z.object({
    hash: z.string(),
    message: z.string(),
  }),
})

export const ZodToken = z.object({
  receiver: z.string(),
  token_type: z.number(),
  interval: z.number(),
  links: z.array(z.string()),
  on_loop: z.number(),
  destination_chain_selector: z.number(),
  price: z.number(),
  duration: z.number(),
})

export const ZodTokenWithSignature = ZodToken.extend({
  signature: z.object({
    hash: z.string(),
    message: z.string(),
  }),
})

export const ZodTokenInfo = z.object({
  t_index: z.number(),
  owner: z.string(),
  receiver: z.string(),
  last_updated: z.number(),
  curr_link: z.number(),
  active_till: z.number(),
})

export const ZodTokenInfoWithSignature = ZodToken.extend({
  signature: z.object({
    hash: z.string(),
    message: z.string(),
  }),
})

export type Contract = z.infer<typeof ZodContract>
export type ContractWithSignature = z.infer<typeof ZodContractWithSignature>
export type Token = z.infer<typeof ZodToken>
export type TokenWithSignature = z.infer<typeof ZodTokenWithSignature>
export type TokenInfo = z.infer<typeof ZodTokenInfo>
export type TokenInfoWithSignature = z.infer<typeof ZodTokenInfoWithSignature>

export interface ContractInKysely {
  owner: string
  contract: string
  description: string
  avatar: string
  destination_chain_selector: number
}

export interface TokenInKysely {
  t_index: number | undefined
  receiver: string
  token_type: number
  interval: number
  links: string
  on_loop: number
  destination_chain_selector: number
  price: number
  duration: number
}

export interface TokenInfoInKysely {
  t_index: number
  token_index: number | undefined
  owner: string
  receiver: string
  last_updated: number
  curr_link: number
  active_till: number
}
