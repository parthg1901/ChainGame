import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  z-index: 9999999;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: saturate(180%) blur(10px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0px;
  left: 0px;
`

const Modal = (props: any, { children }: any) => {
  return (
    <Container
      id="container"
      onClick={(e) => {
        if (e.target instanceof Element) {
          if (e.target.id === 'container') props.click()
        }
      }}
    >
      {children}
    </Container>
  )
}

export default Modal
