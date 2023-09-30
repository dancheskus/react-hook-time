import { css, styled } from 'styled-components'

import { commonBlockStyles } from './style'

const StyledCallbackBlock = styled.div<{ $isActive?: boolean; $isDisabled?: boolean }>`
  ${({ $isActive, $isDisabled }) => css`
    ${commonBlockStyles};
    cursor: auto;
    background: ${$isDisabled ? '#bababa' : $isActive ? '#7c7a61' : '#e9d2c0'};
    transition: background 0.4s;

    ${$isDisabled &&
    css`
      color: #d9d9d9;
    `}
  `}
`

interface ICallbackBlock {
  state?: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  title: string
  isDisabled?: boolean
}

export default function CallbackBlock({ state, title, isDisabled }: ICallbackBlock) {
  return (
    <StyledCallbackBlock
      {...(state && { onTransitionEnd: () => state[0] && state[1](false), $isActive: state[0] })}
      $isDisabled={isDisabled}
    >
      {title}
    </StyledCallbackBlock>
  )
}
