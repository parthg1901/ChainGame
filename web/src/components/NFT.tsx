'use client'

import { Heading, Card as ThorinCard } from '@ensdomains/thorin'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { Button, Link } from '@/styles'

const Card: any = styled(ThorinCard)`
  border: 0px;
`

interface Props {
  tIndex: number
  receiver: string
  tokenType: number
  interval: number
  links: string
  onLoop: number
  destinationChainSelector: number
  price: number
  duration: number
}

export function NFT(props: Props) {
  const [data, setData] = useState<any>({
    name: '',
    description: '',
    image: '',
    attributes: '',
  })
  useEffect(() => {
    console.log(props)
    ;(async () => {
      if (props.links) {
        if (props.links.length >= 1) {
          console.log(JSON.parse(props.links))
          const res = await fetch(JSON.parse(props.links)[0])
          const resData = await res.json()
          setData(resData)
        }
      }
    })()
  }, [props.links])
  return (
    <Card>
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        <img
          src="https://rose-melodic-felidae-510.mypinata.cloud/ipfs/Qma4Av2JrmWc7bRymRJZy5fk6fDfFTaQ54efMmJvSZoDbu?_gl=1*1e4q9pg*_ga*MjAwNzgzMjYyOC4xNjk1MDM5Njgx*_ga_5RMPXG14TE*MTcwMTMxNzU5Ny45LjEuMTcwMTMxNzgwMi41MC4wLjA."
          alt="cover"
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: '100%', height: 'auto' }} // optional
        />
      </div>
      <Heading as="h5" style={{ fontSize: '20px', color: 'white' }}>
        {data.name}
      </Heading>
      <Button>Buy</Button>
    </Card>
  )
}
