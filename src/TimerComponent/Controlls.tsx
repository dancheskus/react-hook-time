import { useRef, useState } from 'react'

import { TTimeUnit } from 'useTimer/types'

import {
  StyledContentTitle,
  StyledContentBody,
  StyledHorizontalBlockWrapper,
  StyledButtonBlock,
  StyledInput,
  StyledRadioWrapper,
  StyledRadioButton,
  StyledTimeSelectionWrapper,
  Separator,
} from './style'
import { timeUnitOptions } from './timeUnitOptions'

export default function Controlls({ timer, withoutUpdate }: { timer: any; withoutUpdate?: boolean }) {
  const numberInputRef = useRef<HTMLInputElement>(null)
  const [timeUnit, setTimeUnit] = useState<TTimeUnit>(timeUnitOptions[0])

  return (
    <div>
      <StyledContentTitle>Controls</StyledContentTitle>

      <StyledContentBody>
        <StyledHorizontalBlockWrapper>
          <StyledButtonBlock $isGreen onClick={timer.start}>
            start
          </StyledButtonBlock>

          <StyledButtonBlock $isDisabled={withoutUpdate} $isBlue onClick={timer.pause}>
            pause
          </StyledButtonBlock>

          <StyledButtonBlock $isRed onClick={() => (withoutUpdate ? timer.cancel() : timer.reset())}>
            {withoutUpdate ? 'cancel' : 'reset'}
          </StyledButtonBlock>
        </StyledHorizontalBlockWrapper>

        {!withoutUpdate && (
          <>
            <Separator />

            <StyledTimeSelectionWrapper>
              <StyledInput ref={numberInputRef} type='number' step={1} defaultValue={10} />

              <StyledRadioWrapper>
                {timeUnitOptions.map(option => (
                  <StyledRadioButton key={option} $isSelected={option === timeUnit} onClick={() => setTimeUnit(option)}>
                    {option}
                  </StyledRadioButton>
                ))}
              </StyledRadioWrapper>
            </StyledTimeSelectionWrapper>

            <StyledHorizontalBlockWrapper style={{ marginTop: '2rem' }}>
              <StyledButtonBlock
                onClick={() => timer.addTime(numberInputRef.current?.valueAsNumber ?? 0, { timeUnit })}
              >
                add
              </StyledButtonBlock>

              <StyledButtonBlock
                onClick={() => timer.subtractTime(numberInputRef.current?.valueAsNumber ?? 0, { timeUnit })}
              >
                remove
              </StyledButtonBlock>

              <StyledButtonBlock
                onClick={() => timer.setTime(numberInputRef.current?.valueAsNumber ?? 0, { timeUnit })}
              >
                set
              </StyledButtonBlock>
            </StyledHorizontalBlockWrapper>
          </>
        )}
      </StyledContentBody>
    </div>
  )
}
