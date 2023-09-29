import styled, { css } from 'styled-components'

const StyledStateWrapper = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 1.3rem;
`

const StyledStateTitle = styled.div<{ $isDisabled?: boolean }>`
  ${({ $isDisabled: isDisabled }) => css`
    font-weight: 600;

    ${isDisabled &&
    css`
      color: #6b6b6b;
    `}
  `}
`

const StyledStateValue = styled.div``

export default function ComponentState({
  title,
  value,
  isDisabled,
}: {
  title: string
  value?: string | number | boolean
  isDisabled?: boolean
}) {
  return (
    <StyledStateWrapper>
      <StyledStateTitle $isDisabled={isDisabled}>{title}:</StyledStateTitle>
      {value !== undefined && <StyledStateValue>{String(value)}</StyledStateValue>}
    </StyledStateWrapper>
  )
}
