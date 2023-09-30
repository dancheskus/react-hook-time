import { css, styled } from 'styled-components'

export const commonBlockStyles = css`
  font-weight: 600;
  font-size: 1.2rem;
  padding: 0.8rem 0.2rem;
  color: black;
  border-radius: 0.3rem;
  display: grid;
  place-items: center;
  cursor: pointer;
`

export const StyledSectionTitle = styled.h2`
  font-weight: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;

  label {
    font-size: 1.3rem;
    input[type='checkbox'] {
      margin-right: 0.5rem;
    }
  }
`

export const StyledContentWrapper = styled.div``

export const StyledContentTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 300;
`

export const StyledContentBody = styled.div`
  background: rgba(255, 255, 255, 0.2);
  border-radius: 0.5rem;
  padding: 1rem;
  display: grid;
  gap: 0.5rem;
`

export const StyledHorizontalBlockWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
`

export const StyledButtonBlock = styled.div<{ $isGreen?: boolean; $isBlue?: boolean; $isRed?: boolean }>`
  ${({ $isBlue, $isRed, $isGreen }) => css`
    ${commonBlockStyles};

    background: ${$isGreen ? '#48ad74' : $isBlue ? '#37afd7' : $isRed ? '#ff8585' : '#dfbea4'};
    transition: filter 0.2s;

    &:hover {
      filter: brightness(1.2);
    }
  `}
`

export const StyledInput = styled.input`
  /* Chrome, Safari, Edge, Opera */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  /* Firefox */
  &[type='number'] {
    appearance: textfield;
  }

  ${commonBlockStyles};
  outline: none;
  border: none;
  padding: 0.5rem;
`

export const StyledRadioWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  border-radius: 0.3rem;
  overflow: hidden;

  > div {
    &:not(:last-child) {
      border-right: 1px solid rgba(0, 0, 0, 0.2);
    }
  }
`
export const StyledRadioButton = styled.div<{ $isSelected: boolean }>`
  ${({ $isSelected }) => css`
    ${commonBlockStyles};
    border-radius: 0;
    display: grid;
    place-items: center;
    background: ${$isSelected ? '#7c7a61' : '#dfbea4'};
    transition: background 0.2s;

    ${!$isSelected &&
    css`
      &:hover {
        background: #e9d2c0;
      }
    `}
  `}
`

export const StyledTimeSelectionWrapper = styled.div`
  display: grid;
  grid-template-columns: 8rem 1fr;
  gap: 0.5rem;
`

export const StyledCheckboxWrapper = styled.div`
  font-size: 1.3rem;

  input[type='checkbox'] {
    margin-right: 0.5rem;
  }
`

export const Separator = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.3);
  margin: 1rem 0;
`

export const StyledContentWrapperCombiner = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`

export const StyledTimerSection = styled.div<{ $stopwatch?: boolean; $preventUpdate?: boolean }>`
  ${({ $stopwatch, $preventUpdate }) => css`
    background: ${$stopwatch ? '#4b3f78' : $preventUpdate ? '#417b5a' : '#1f2041'};

    width: 100%;
    height: 100vh;
    color: white;
    font-size: 2rem;
    padding: 2rem;

    > * {
      max-width: 800px;
      margin: 0 auto;

      &:not(:last-child) {
        margin-bottom: 1.5rem;
      }
    }
  `}
`
