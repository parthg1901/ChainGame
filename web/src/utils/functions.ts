import { ethers } from 'ethers'

import durin_call from './ccipRead'

interface Token {
  destinationChainSelector: number
  receiver: string
  tokenType: number
  interval: number
  price: number
  links: string[]
  onLoop: number
  duration: number
}
export const registerContract = async () => {}

export const getPrice = async (Chaingame_abi: any, tokenType: number, duration: number, interval: number, nLinks: number, signer: ethers.providers.JsonRpcSigner) => {
  const contract = new ethers.Contract("0xb1Bce02506dA4010a77E788C21655A5B36AE8A41", Chaingame_abi, signer)
  const price = await contract.checkPrice(tokenType, duration, interval, nLinks)
  return ethers.utils.formatEther(price)
}

export const getTokenPrice = async (Chaingame_abi: any, receiver: string, t_index: number, signer: ethers.providers.JsonRpcSigner) => {
  const contract = new ethers.Contract("0xb1Bce02506dA4010a77E788C21655A5B36AE8A41", Chaingame_abi, signer)
  const price = await contract.tokenPrices(receiver, t_index)
  return ethers.utils.formatEther(price)
}

export const getBalance = async (Chaingame_abi: any, address: string, signer: ethers.providers.JsonRpcSigner) => {
  const contract = new ethers.Contract("0xb1Bce02506dA4010a77E788C21655A5B36AE8A41", Chaingame_abi, signer)
  const balance = await contract.getBalance(address)
  return ethers.utils.formatEther(balance)
} 

export const createToken = async (
  Chaingame_abi: any,
  signer: ethers.providers.JsonRpcSigner,
  token: Token,
) => {
  console.log("hrrr")
  const iface = new ethers.utils.Interface(Chaingame_abi)
  const price = await getPrice(Chaingame_abi, token.tokenType, token.duration, token.interval, token.links.length, signer)
  await durin_call(signer!, {
    to: '0xb1Bce02506dA4010a77E788C21655A5B36AE8A41',
    data: iface.encodeFunctionData('createToken', [
      token.destinationChainSelector,
      token.receiver,
      token.tokenType,
      token.interval,
      token.onLoop,
      token.links,
      token.price,
      token.duration,
    ]),
    value: ethers.utils.parseUnits(price.toString(), 18),
  })
}

export const buyToken = async (
  Chaingame_abi: any,
  signer: ethers.providers.JsonRpcSigner,
  data: {
    receiver: string
    t_index: number
  }
) => {
  const iface = new ethers.utils.Interface(Chaingame_abi)
  const price = await getTokenPrice(Chaingame_abi, data.receiver, data.t_index, signer)
  await durin_call(signer!, {
    to: '0xb1Bce02506dA4010a77E788C21655A5B36AE8A41',
    data: iface.encodeFunctionData('buy', [
      data.receiver,
      data.t_index
    ]),
    value: ethers.utils.parseUnits(price.toString(), 18),
  })
}
