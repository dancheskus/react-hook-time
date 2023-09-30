import { createGlobalStyle } from 'styled-components'

import TimerComponent from './TimerComponent'

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    font-family: 'Exo 2', sans-serif;
  }
`

export default function App() {
  return (
    <>
      <GlobalStyle />

      <TimerComponent />
    </>
  )
}
