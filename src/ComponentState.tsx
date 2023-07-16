import styled from 'styled-components'

const StyledStateWrapper = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 1.3rem;
`

const StyledStateTitle = styled.div`
  font-weight: 600;
`

const StyledStateValue = styled.div``

export default function ComponentState({ title, value }: { title: string; value: string | number | boolean }) {
  return (
    <StyledStateWrapper>
      <StyledStateTitle>{title}:</StyledStateTitle>
      <StyledStateValue>{String(value)}</StyledStateValue>
    </StyledStateWrapper>
  )
}
