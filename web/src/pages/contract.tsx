'use client'

import Chaingame_abi from "../abi/Chaingame.json"
import Header from '@/components/Header'
import Modal from '@/components/Modal'
import { Button, Content, ContractPage, Link, Right } from '@/styles'
import { useEthersSigner } from "@/utils/ethers"
import { buyToken, createToken, getBalance } from "@/utils/functions"
import {
  Card,
  FieldSet,
  Heading,
  Helper,
  Input,
  ScrollBox,
  Select,
  Typography,
} from '@ensdomains/thorin'
import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { useAccount, useContractRead } from 'wagmi'

const contract = () => {
  const [contract, setContract] = useState<
    | {
        owner: string
        contract: string
        description: string
        avatar: string
        destination_chain_selector: number
      }
    | undefined
  >(undefined)
  const [modal, setModal] = useState<boolean>(false)
  const [contractForm, setContractForm] = useState({
    contract: '',
    description: '',
    avatar: '',
    destination_chain_selector: -1,
  })
  const [tokens, setTokens] = useState<any>([])
  const [balance, setBalance] = useState<any>(0)
  const [modalChildren, setModalChildren] = useState<
    'contract' | 'nft' | undefined
  >(undefined)

  const { address } = useAccount()
  const signer = useEthersSigner()
  useEffect(() => {
    ;(async () => {
      if (address) {
        const res = await fetch(
          process.env.NEXT_PUBLIC_GATEWAY + 'get/' + address
        )
        if (res.status !== 404) {
          const response = await res.json()
          console.log(response)
          setContract(response)
          console.log(contract)

          const res_2 = await fetch(
            process.env.NEXT_PUBLIC_GATEWAY + 'get-tokens',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                receiver: response.contract,
              }),
            }
          )
          const tokensFetched = await res_2.json()
          setTokens(tokensFetched)
          console.log(tokensFetched)
        }
      }
    })()
  }, [address])

  const addContract = async () => {
    const res = await fetch(process.env.NEXT_PUBLIC_GATEWAY + 'set', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...contractForm,
        owner: address,
      }),
    })
    if (res.status === 201) {
      setContract({
        ...contractForm,
        owner: address!,
      })
    }
    setModal(false)
  }

  return (
    <>
      <Head>
        <title>Chaingame | Dev Mode</title>
        <meta property="og:title" content="Chaingame" />
        <meta name="description" content="Generate Dynamic NFTs on the go" />
        <meta
          property="og:description"
          content="Generate Dynamic NFTs on the go"
        />
      </Head>
      <ContractPage>
        <Header type="contract" />
        <Content>
          {contract === undefined ? (
            <>
              <Button
                style={{
                  textAlign: 'center',
                }}
                width="64"
                onClick={() => {
                  if (address === undefined) {
                    alert('Please connect wallet')
                  } else {
                    setModal(true)
                    setModalChildren('contract')
                  }
                }}
              >
                Add Contract
              </Button>
              <div>No contract found on your address</div>
            </>
          ) : (
            <>
            <div style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: "100%"
            }}>

              <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: "100%",
                gap: "20px"
              }}>

              <img
                src={contract.avatar}
                width="60"
                height="60"
                alt="avatar"
                style={{ borderRadius: '100%' }}
              />
              <Heading color="greyLight" as='h3' style={{ fontSize: "1.5em" }}>
                {contract.description.length > 100
                  ? contract.description.slice(0, 100) + '...'
                  : contract.description}
              </Heading>
              </div>
              <Button width='60' onClick={() => {
                console.log("here")
                console.log(contract)
              //   createToken(Chaingame_abi.abi, signer!, {
              //   destinationChainSelector: contract.destinationChainSelector,
              //   receiver: contract.contract,
              //   tokenType: 0,
              //   interval: 0,
              //   price: 100000000000000,
              //   links: ["https://ipfs.io/ipfs/QmYuKY45Aq87LeL1R5dhb1hqHLp6ZFbJaCP8jxqKM1MX6y/babe_ruth_1.json"],
              //   onLoop: 0,
              //   duration: 0,
              // })
              buyToken(Chaingame_abi.abi, signer!, {
                receiver: contract.contract,
                t_index: 0
              })
              }}>Create NFT</Button>
            </div>

              <ScrollBox
                style={{
                  height: '350px',
                  width: '100%',
                }}
              >
                <Typography color='greyLight'>No token generated yet.</Typography>
              </ScrollBox>
            </>
          )}
        </Content>
        <Right />
        {modal && (
          <Modal click={() => setModal(false)}>
            {modalChildren === 'contract' ? (
              <Card style={{ width: '500px', border: 'none' }}>
                <FieldSet legend="">
                  <Heading color="greyLight">Contract</Heading>
                  <Input
                    value={contractForm.contract}
                    onChange={(e) => {
                      setContractForm({
                        ...contractForm,
                        contract: e.target.value,
                      })
                    }}
                    label="Contract Address"
                    placeholder="Enter the address of your contract"
                  />
                  <Input
                    value={contractForm.description}
                    onChange={(e) => {
                      setContractForm({
                        ...contractForm,
                        description: e.target.value,
                      })
                    }}
                    label="Description"
                    placeholder="Enter the description of your game"
                  />

                  <Input
                    value={contractForm.avatar}
                    onChange={(e) => {
                      setContractForm({
                        ...contractForm,
                        avatar: e.target.value,
                      })
                    }}
                    label="Avatar"
                    placeholder="Paste the link for your contract avatar"
                  />
                  <Select
                    label="Your network"
                    autocomplete
                    value={contractForm.destination_chain_selector.toString()}
                    onChange={(e) => {
                      setContractForm({
                        ...contractForm,
                        destination_chain_selector: parseInt(e.target.value),
                      })
                      console.log(e.target.value)
                    }}
                    options={[
                      { value: '0', label: 'Sepolia Testnet' },
                      { value: '1', label: 'Optimism Goerli Testnet' },
                      { value: '2', label: 'Mumbai Testnet' },
                      { value: '3', label: 'Fuji Testnet' },
                      { value: '4', label: 'BNB Chain Testnet' },
                      { value: '5', label: 'Base Goerli Testnet' },
                    ]}
                    placeholder="Up/Down and Enter to select"
                    tabIndex={2}
                  />
                  <Helper type="warning" alignment="horizontal">
                    Contract must be
                    <Link href="https://gist.github.com/pat176/2cbee534da957d9ed16a537637e247af">
                      Chaingame-compatible.
                    </Link>
                  </Helper>
                  <Button onClick={addContract}>Add Contract</Button>
                </FieldSet>
              </Card>
            ) : (
              ''
            )}
          </Modal>
        )}
      </ContractPage>
    </>
  )
}

export default contract
