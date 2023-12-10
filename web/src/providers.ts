import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import { configureChains, createConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

export const chains = [sepolia]

const { publicClient, webSocketPublicClient } = configureChains(chains, [
  publicProvider(),
])

const { connectors } = getDefaultWallets({
  appName: 'Chaingame',
  projectId: '27dda9964e6171220a391b5d9061d1c3',
  chains,
})

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
})
