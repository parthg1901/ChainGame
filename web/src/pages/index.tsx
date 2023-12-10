import {
  Button,
  MagnifyingGlassSimpleSVG,
  ScrollBox,
  Toggle,
  Typography,
} from '@ensdomains/thorin'
import { ethers } from 'ethers'
import Head from 'next/head'
import { useState } from 'react'
import { useAccount } from 'wagmi'

import Header from '@/components/Header'
import { NFT } from '@/components/NFT'
import {
  Content,
  Contract,
  Input,
  NFTView,
  Page,
  Right,
  Sidebar,
} from '@/styles'
import { useEthersSigner } from '@/utils/ethers'
import { createToken } from '@/utils/functions'

import Chaingame_abi from '../abi/Chaingame.json'
import styles from './styles.module.css'

interface contract {
  owner: string
  contract: string
  description: string
  avatar: string
  destination_chain_selector: number
}
export const getServerSideProps: () => Promise<{
  props: { contracts: contract[] }
}> = async () => {
  const res = await fetch(process.env.NEXT_PUBLIC_GATEWAY + '/contracts')
  const contracts = await res.json()
  return { props: { contracts } }
}

export default function App(props: any) {
  const { address } = useAccount()

  const [selectContract, setSelectedContract] = useState<number | undefined>(
    undefined
  )
  const [tokens, setTokens] = useState<any>(undefined)

  const changeContract = async (c: contract, key: number) => {
    if (selectContract !== undefined && selectContract !== key) {
      if (
        document.getElementsByClassName(styles.selecter)[0] instanceof
        HTMLElement
      ) {
        ;(
          document.getElementsByClassName(styles.selected)[0] as HTMLElement
        ).style.background = 'none'
      }
    }
    if (selectContract !== key) {
      setSelectedContract(key)
      const res = await fetch(process.env.NEXT_PUBLIC_GATEWAY + 'get-tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ receiver: c.contract }),
      })
      setTokens(await res.json())
    }
  }

  const signer = useEthersSigner()
  const iface = new ethers.utils.Interface(Chaingame_abi.abi)
  const test = async () => {
    createToken(Chaingame_abi.abi, signer!, {
      destinationChainSelector: 3,
      receiver: '0x274752bc001e54ef6b8aeae09e7944f33cc1858e',
      tokenType: 0,
      interval: 0,
      price: 10000000000,
      links: [
        'https://ipfs.io/ipfs/QmYaTsyxTDnrG4toc8721w62rL4ZBKXQTGj9c9Rpdrntou/seed.json',
      ],
      onLoop: 0,
      duration: 0,
    })
  }

  return (
    <>
      <Head>
        <title>Chaingame</title>
        <meta property="og:title" content="Chaingame" />
        <meta name="description" content="Buy Dynamic NFTs on the go" />
        <meta property="og:description" content="Buy Dynamic NFTs on the go" />
      </Head>
      <Page>
        <Header type="user" />
        <Sidebar>
          <Input
            label=""
            icon={<MagnifyingGlassSimpleSVG />}
            placeholder="Search contract"
          />
          <ScrollBox style={{ height: '350px', width: '100%' }}>
            {props.contracts.map((c: contract, key: number) => {
              return (
                <Contract
                  onClick={() => changeContract(c, key)}
                  className={selectContract === key ? styles.selected : ''}
                  style={{
                    backgroundColor:
                      selectContract === key ? '#1A43BF' : 'none',
                  }}
                  key={key}
                >
                  <img
                    src={c.avatar}
                    width="50"
                    height="50"
                    alt="avatar"
                    style={{ borderRadius: '100%' }}
                  />
                  <div>
                    <Typography style={{ color: 'white' }}>
                      {c.contract.slice(0, 3) +
                        '...' +
                        c.contract.slice(
                          c.contract.length - 4,
                          c.contract.length - 1
                        )}
                    </Typography>
                    <Typography color="greyLight">
                      {c.description.length > 15
                        ? c.description.slice(0, 15) + '...'
                        : c.description}
                    </Typography>
                  </div>
                </Contract>
              )
            })}
          </ScrollBox>
        </Sidebar>
        <Content>
          <Input
            label=""
            icon={<MagnifyingGlassSimpleSVG />}
            placeholder="Search NFT"
          />
          <NFTView>{tokens !== undefined && <NFT {...tokens[0]} />}</NFTView>
        </Content>
        <Right>
          <Button onClick={test}>H</Button>
        </Right>
        {/* <Footer></Footer> */}
      </Page>
    </>
  )
}
