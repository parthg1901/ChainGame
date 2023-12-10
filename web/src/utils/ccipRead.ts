import { ethers } from 'ethers'

import Chaingame_abi from '../abi/Chaingame.json'

async function httpcall(urls: string[], to: string, callData: string) {
  console.log(to)
  const args = { sender: to.toLowerCase(), data: callData.toLowerCase() }
  for (const url of urls) {
    const queryUrl = url.replace(
      /\{([^}]*)\}/g,
      (match, p1: 'sender' | 'data') => args[p1]
    )
    const response = await fetch(queryUrl)
    const result = await response.text()
    if (response.status >= 400 && response.status <= 499) {
      throw new Error(result)
    }
    if (response.status >= 200 && response.status <= 299) {
      return result
    }
  }
}
async function durin_call(
  signer: ethers.providers.JsonRpcSigner,
  dataObject: ethers.utils.Deferrable<ethers.providers.TransactionRequest>
) {
  const iface = new ethers.utils.Interface(Chaingame_abi.abi)
  const { sender, urls, callData, callbackFunction, extraData } =
    iface.parseError(await signer.call(dataObject)).args
  const to = await dataObject.to
  if (sender.toLowerCase() !== to?.toLowerCase()) {
    throw new Error('Cannot handle OffchainLookup raised inside nested call')
  }
  console.log(urls)
  const result = await httpcall(urls, to!, callData)
  const res = JSON.parse(result!).data
  const txn = await signer.sendTransaction({
    to: to,
    data: iface.encodeFunctionData(callbackFunction, [res, extraData]),
    value: await dataObject.value,
  })
}
export default durin_call
