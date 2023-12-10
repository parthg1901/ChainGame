import {
  Button as ThorinButton,
  Card as ThorinCard,
  Helper as ThorinHelper,
  Input as ThorinInput,
  ScrollBox as ThorinScroll,
  mq,
} from '@ensdomains/thorin'
import styled, { css } from 'styled-components'

export const Page = styled.div`
  display: grid;
  height: 100vh;
  width: 100vw;
  padding: 30px;
  grid-gap: 1rem;
  grid-template-columns: 0.5fr 1fr 0.75fr;
  grid-template-rows: 70px auto;
  grid-template-areas:
    'header header header'
    'sidebar content right';
`

export const ContractPage = styled.div`
  display: grid;
  height: 100vh;
  width: 100vw;
  padding: 30px;
  grid-gap: 1rem;
  grid-template-columns: 1.5fr 0.75fr;
  grid-template-rows: 70px auto;
  grid-template-areas:
    'header header'
    'content right';
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1rem;
`

export const Input = styled(ThorinInput)`
  background: none;
`
export const CardTemp = styled(ThorinCard)`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  gap: 1.5rem;
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: saturate(180%) blur(10px);
  border: 0px;
  justify-content: center;
`
export const Header = styled(CardTemp)`
  display: flex;
  flex-direction: row;
  grid-area: header;
  justify-content: space-between;
`
export const HeaderLogo = styled.div``
export const HeaderNav = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: 40px;
  width: 100%;
  font-weight: bold;
`

export const Sidebar = styled(CardTemp)`
  grid-area: sidebar;
`
export const Content = styled(CardTemp)`
  grid-area: content;
`

export const Right = styled(CardTemp)`
  grid-area: right;
`

export const Link = styled.a.attrs({
  target: '_blank',
  rel: 'noopener noreferrer',
})(
  ({ theme }) => css`
    color: ${theme.colors.accent};
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  `
)

export const Button = styled(ThorinButton)`
  background-color: #1a43bf;
`

export const Helper = styled(ThorinHelper)`
  svg {
    display: none;
  }
`

export const Spacer = styled.div`
  display: block;
  width: 100%;
  height: 1rem;

  ${mq.sm.max(css`
    height: 0;
  `)}
`

export const Contract = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: flex-start;
  gap: 10px;
  align-items: center;
  padding: 5px;
  border-radius: 30px;
`
export const NFTView = styled(ThorinScroll)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  height: 350px;
`
