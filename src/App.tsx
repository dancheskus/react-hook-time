import styled, { createGlobalStyle } from 'styled-components'

import StopwatchComponent from './StopwatchComponent'
import TimerComponent from './TimerComponent'

const GlobalStyle = createGlobalStyle`
  *{
    box-sizing: border-box;
    margin: 0;
    font-family: 'Exo 2', sans-serif;
  }
`

const StyledAppWrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
`

export default function App() {
  return (
    <>
      <GlobalStyle />

      <StyledAppWrapper>
        <TimerComponent />
        <StopwatchComponent />
      </StyledAppWrapper>
    </>
  )
}
