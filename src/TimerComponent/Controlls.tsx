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
  StyledCheckboxWrapper,
  Separator,
} from './style'
import { timeUnitOptions } from './timeUnitOptions'

export default function Controlls({ timer, withoutUpdate }: { timer: any; withoutUpdate?: boolean }) {
  const numberInputRef = useRef<HTMLInputElement>(null)
  const startIfWasStoppedRef = useRef<HTMLInputElement>(null)
  const continueIfWasRunningRef = useRef<HTMLInputElement>(null)
  const [timeUnit, setTimeUnit] = useState<TTimeUnit>(timeUnitOptions[0])
  const getTimeUpdateSettings = () => ({
    timeUnit,
    startIfWasStopped: startIfWasStoppedRef.current?.checked,
    continueIfWasRunning: continueIfWasRunningRef.current?.checked,
  })

  return (
    <div>
      <StyledContentTitle>Controls</StyledContentTitle>

      <StyledContentBody>
        {!withoutUpdate && (
          <>
            <StyledCheckboxWrapper>
              <label>
                <input type='checkbox' ref={startIfWasStoppedRef} />
                Start timer if was stopped
              </label>

              <br />

              <label>
                <input type='checkbox' ref={continueIfWasRunningRef} />
                Continue if was running
              </label>
            </StyledCheckboxWrapper>

            <Separator />
          </>
        )}

        <StyledHorizontalBlockWrapper>
          <StyledButtonBlock $isGreen onClick={timer.start}>
            start
          </StyledButtonBlock>

          <StyledButtonBlock $isDisabled={withoutUpdate} $isBlue onClick={timer.pause}>
            pause
          </StyledButtonBlock>

          <StyledButtonBlock
            $isRed
            onClick={() => {
              if (withoutUpdate) return timer.cancel()

              timer.reset({
                startIfWasStopped: startIfWasStoppedRef.current?.checked,
                continueIfWasRunning: continueIfWasRunningRef.current?.checked,
              })
            }}
          >
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
                onClick={() => {
                  timer.incTimeBy(numberInputRef.current?.valueAsNumber ?? 0, getTimeUpdateSettings())
                }}
              >
                add
              </StyledButtonBlock>

              <StyledButtonBlock
                onClick={() => timer.decTimeBy(numberInputRef.current?.valueAsNumber ?? 0, getTimeUpdateSettings())}
              >
                remove
              </StyledButtonBlock>

              <StyledButtonBlock
                onClick={() => timer.setTime(numberInputRef.current?.valueAsNumber ?? 0, getTimeUpdateSettings())}
              >
                update
              </StyledButtonBlock>
            </StyledHorizontalBlockWrapper>
          </>
        )}
      </StyledContentBody>
    </div>
  )
}
