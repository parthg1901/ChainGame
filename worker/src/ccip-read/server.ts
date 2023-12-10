import { Server } from '@ensdomains/ccip-read-cf-worker'
import { ethers } from 'ethers'
import { Result } from 'ethers/lib/utils'

import { abi as Gateway_abi } from '../abi/Gateway.json'
import { Env } from '../env'
import { buyToken } from '../handlers/functions/buyToken'
import { setToken } from '../handlers/functions/setToken'
import { ZodToken } from '../models'
import { updateTokenInfo } from '../handlers/functions/updateTokenInfo'

export function makeServer(privateKey: string, env: Env) {
  let signer = new ethers.Wallet(privateKey)
  const server = new Server()
  server.add(Gateway_abi, [
    {
      type: 'createToken',
      func: async (args: Result) => {
        const [
          destinationChainSelector,
          receiver,
          tokenType,
          interval,
          onLoop,
          links,
          price,
          duration,
        ] = args
        console.log(args)

        const safeParse = ZodToken.parse({
          receiver: receiver,
          token_type: tokenType,
          interval: Number(interval),
          links: links,
          on_loop: Number(onLoop),
          destination_chain_selector: Number(destinationChainSelector),
          price: Number(price),
          duration: Number(duration),
        })

        const id = await setToken(safeParse, env)
        // Hash and sign the response
        let messageHash = ethers.utils.solidityKeccak256(
          ['address', 'uint256'],
          [receiver, id]
        )
        let messageHashBinary = ethers.utils.arrayify(messageHash)
        const sig = await signer.signMessage(messageHashBinary)
        console.log(sig)

        console.log(JSON.stringify(safeParse))
        return [id, sig]
      },
    },
    {
      type: 'buyToken',
      func: async (args: Result) => {
        const [owner, receiver, index] = args
        const { token, id } = await buyToken(
          { owner, receiver, t_index: index },
          env
        )
        console.log(id)
        // Hash and sign the response
        let messageHash = ethers.utils.solidityKeccak256(
          ['address', 'uint256'],
          [receiver, id]
        )
        let messageHashBinary = ethers.utils.arrayify(messageHash)
        const sig = await signer.signMessage(messageHashBinary)
        console.log(sig)
        console.log(token?.onLoop)
        //uint256 destinationChainSelector, string[] memory links, bool onLoop, uint256 activeTill, uint256 index, bytes memory sig, TokenType tokenType, uint256 interval
        return [
          token?.destinationChainSelector,
          token?.links,
          token?.onLoop,
          token?.duration,
          id,
          sig,
          token?.tokenType,
          token?.interval,
        ]
      },
    },
    {
      type: 'updateToken',
      func: async (args: Result) => {
        const [sender, currContract, currTokenIndex] = args
        const result = await updateTokenInfo(
          { currContract, currTokenIndex },
          env
        )
        return result
      },
    },
  ])
  return server
}

export function makeApp(privateKey: string, path: string, env: Env) {
  return makeServer(privateKey, env).makeApp(path)
}
