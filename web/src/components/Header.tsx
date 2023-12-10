import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import React from 'react'

import { Header as Hd, HeaderLogo, HeaderNav } from '@/styles'

const Header = (props: { type: 'user' | 'contract' }) => {
  return (
    <Hd>
      <HeaderLogo>ChainGame</HeaderLogo>
      <HeaderNav>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {props.type === 'user' ? (
            <Link href="/contract">Dev Mode</Link>
          ) : (
            <Link href="/">User Mode</Link>
          )}
        </div>
        <ConnectButton showBalance={false} />
      </HeaderNav>
    </Hd>
  )
}

export default Header
