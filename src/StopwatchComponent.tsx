import { useRef, useState } from 'react'

import { TTimeUnit } from 'ReactTimer/types'

import ComponentState from './ComponentState'
import CallbackBlock from './CallbackBlock'
import { useStopwatch } from './ReactTimer'
import {
  StyledSectionTitle,
  StyledContentWrapper,
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
  StyledContentWrapperCombiner,
  StyledTimerSection,
} from './style'

const timeUnitOptions: TTimeUnit[] = ['sec', 'min', 'hour', 'day', 'ms']

export default function StopwatchComponent() {
  const onStartCallbackTriggeredState = useState(false)
  const onPauseCallbackTriggeredState = useState(false)
  const onResetCallbackTriggeredState = useState(false)
  const onTimeSetCallbackTriggeredState = useState(false)
  const onUpdateCallbackTriggeredState = useState(false)
  const numberInputRef = useRef<HTMLInputElement>(null)
  const startIfWasStoppedRef = useRef<HTMLInputElement>(null)
  const continueIfWasRunningRef = useRef<HTMLInputElement>(null)
  const [timeUnit, setTimeUnit] = useState<TTimeUnit>(timeUnitOptions[0])

  const stopwatch = useStopwatch({
    // autostart: true,
    // initialTime: 5,
    // stepInMs: 500,
    onPause: time => onPauseCallbackTriggeredState[1](true),
    onStart: time => onStartCallbackTriggeredState[1](true),
    onReset: time => onResetCallbackTriggeredState[1](true),
    onTimeSet: time => onTimeSetCallbackTriggeredState[1](true),
    onUpdate: time => onUpdateCallbackTriggeredState[1](true),
  })

  const getTimeUpdateSettings = () => ({
    timeUnit,
    startIfWasStopped: startIfWasStoppedRef.current?.checked,
    continueIfWasRunning: continueIfWasRunningRef.current?.checked,
  })

  return (
    <StyledTimerSection>
      <StyledSectionTitle>Stopwatch</StyledSectionTitle>

      <StyledContentWrapperCombiner>
        <StyledContentWrapper>
          <StyledContentTitle>Current state</StyledContentTitle>

          <StyledContentBody>
            <ComponentState title='Is Timer running' value={stopwatch.isRunning} />
            <ComponentState title='Current time' value={stopwatch.currentTime} />
            <ComponentState title='Years' value={stopwatch.formattedCurrentTime.years} />
            <ComponentState title='Days' value={stopwatch.formattedCurrentTime.days} />
            <ComponentState title='Hours' value={stopwatch.formattedCurrentTime.hours} />
            <ComponentState title='Minutes' value={stopwatch.formattedCurrentTime.minutes} />
            <ComponentState title='Seconds' value={stopwatch.formattedCurrentTime.seconds} />
          </StyledContentBody>
        </StyledContentWrapper>

        <StyledContentWrapper style={{ display: 'grid', gridTemplateRows: 'min-content 1fr' }}>
          <StyledContentTitle>Callbacks</StyledContentTitle>

          <StyledContentBody>
            <StyledHorizontalBlockWrapper>
              <CallbackBlock state={onStartCallbackTriggeredState} title='onStart' />
              <CallbackBlock state={onPauseCallbackTriggeredState} title='onPause' />
              <CallbackBlock state={onResetCallbackTriggeredState} title='onReset' />
              <CallbackBlock state={onTimeSetCallbackTriggeredState} title='onTimeSet' />
              <CallbackBlock state={onUpdateCallbackTriggeredState} title='onUpdate' />
            </StyledHorizontalBlockWrapper>
          </StyledContentBody>
        </StyledContentWrapper>
      </StyledContentWrapperCombiner>

      <StyledContentWrapper>
        <StyledContentTitle>Controls</StyledContentTitle>

        <StyledContentBody>
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

          <StyledHorizontalBlockWrapper>
            <StyledButtonBlock $isGreen onClick={stopwatch.start}>
              start
            </StyledButtonBlock>

            <StyledButtonBlock $isBlue onClick={stopwatch.pause}>
              pause
            </StyledButtonBlock>

            <StyledButtonBlock
              $isRed
              onClick={() => {
                stopwatch.reset({
                  startIfWasStopped: startIfWasStoppedRef.current?.checked,
                  continueIfWasRunning: continueIfWasRunningRef.current?.checked,
                })
              }}
            >
              reset
            </StyledButtonBlock>
          </StyledHorizontalBlockWrapper>

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
                stopwatch.incTimeBy(numberInputRef.current?.valueAsNumber ?? 0, getTimeUpdateSettings())
              }}
            >
              add
            </StyledButtonBlock>

            <StyledButtonBlock
              onClick={() => stopwatch.decTimeBy(numberInputRef.current?.valueAsNumber ?? 0, getTimeUpdateSettings())}
            >
              remove
            </StyledButtonBlock>

            <StyledButtonBlock
              onClick={() => stopwatch.setTime(numberInputRef.current?.valueAsNumber ?? 0, getTimeUpdateSettings())}
            >
              update
            </StyledButtonBlock>
          </StyledHorizontalBlockWrapper>
        </StyledContentBody>
      </StyledContentWrapper>
    </StyledTimerSection>
  )
}
