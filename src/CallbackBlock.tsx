import { css, styled } from 'styled-components'

import { commonBlockStyles } from './style'

const StyledCallbackBlock = styled.div<{ $isActive: boolean }>`
  ${({ $isActive }) => css`
    ${commonBlockStyles};
    cursor: auto;
    background: ${$isActive ? '#7c7a61' : '#e9d2c0'};
    transition: background 0.4s;
  `}
`

interface ICallbackBlock {
  state: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  title: string
}

export default function CallbackBlock({ state, title }: ICallbackBlock) {
  return (
    <StyledCallbackBlock onTransitionEnd={() => state[0] && state[1](false)} $isActive={state[0]}>
      {title}
    </StyledCallbackBlock>
  )
}
