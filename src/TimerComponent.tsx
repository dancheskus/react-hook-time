import { useRef, useState } from 'react'

import { TTimeUnit } from 'useTimer/types'

import ComponentState from './ComponentState'
import CallbackBlock from './CallbackBlock'
import useTimer from './useTimer'
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

function Stopwatch() {
  const onStartCallbackTriggeredState = useState(false)
  const onPauseCallbackTriggeredState = useState(false)
  const onResetCallbackTriggeredState = useState(false)
  const onTimeSetCallbackTriggeredState = useState(false)
  const onUpdateCallbackTriggeredState = useState(false)
  const numberInputRef = useRef<HTMLInputElement>(null)
  const startIfWasStoppedRef = useRef<HTMLInputElement>(null)
  const continueIfWasRunningRef = useRef<HTMLInputElement>(null)
  const [timeUnit, setTimeUnit] = useState<TTimeUnit>(timeUnitOptions[0])

  const stopwatch = useTimer({
    stopwatch: true,
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
    <>
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
              <CallbackBlock isDisabled title='onEnd' />
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
    </>
  )
}
function StandartTimer() {
  const onStartCallbackTriggeredState = useState(false)
  const onPauseCallbackTriggeredState = useState(false)
  const onResetCallbackTriggeredState = useState(false)
  const onTimeSetCallbackTriggeredState = useState(false)
  const onUpdateCallbackTriggeredState = useState(false)
  const onEndCallbackTriggeredState = useState(false)
  const numberInputRef = useRef<HTMLInputElement>(null)
  const startIfWasStoppedRef = useRef<HTMLInputElement>(null)
  const continueIfWasRunningRef = useRef<HTMLInputElement>(null)
  const [timeUnit, setTimeUnit] = useState<TTimeUnit>(timeUnitOptions[0])

  const timer = useTimer(10, {
    // autostart: true,
    // speedUpFirstSecond: true,
    // timeUnit: 'min',
    // stepInMs: 2000,

    onPause: time => onPauseCallbackTriggeredState[1](true),
    onStart: time => onStartCallbackTriggeredState[1](true),
    onReset: time => onResetCallbackTriggeredState[1](true),
    onTimeSet: time => onTimeSetCallbackTriggeredState[1](true),
    onUpdate: time => onUpdateCallbackTriggeredState[1](true),
    onEnd: () => onEndCallbackTriggeredState[1](true),
  })

  const getTimeUpdateSettings = () => ({
    timeUnit,
    startIfWasStopped: startIfWasStoppedRef.current?.checked,
    continueIfWasRunning: continueIfWasRunningRef.current?.checked,
  })

  return (
    <>
      <StyledContentWrapperCombiner>
        <StyledContentWrapper>
          <StyledContentTitle>Current state</StyledContentTitle>

          <StyledContentBody>
            <ComponentState title='Is Timer running' value={timer.isRunning} />
            <ComponentState title='Current time' value={timer.currentTime} />
            <ComponentState title='Years' value={timer.formattedCurrentTime.years} />
            <ComponentState title='Days' value={timer.formattedCurrentTime.days} />
            <ComponentState title='Hours' value={timer.formattedCurrentTime.hours} />
            <ComponentState title='Minutes' value={timer.formattedCurrentTime.minutes} />
            <ComponentState title='Seconds' value={timer.formattedCurrentTime.seconds} />
          </StyledContentBody>
        </StyledContentWrapper>

        <StyledContentWrapper style={{ display: 'grid', gridTemplateRows: 'min-content 1fr' }}>
          <StyledContentTitle>Callbacks</StyledContentTitle>

          <StyledContentBody>
            <StyledHorizontalBlockWrapper>
              <CallbackBlock state={onEndCallbackTriggeredState} title='onEnd' />
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
            <StyledButtonBlock $isGreen onClick={timer.start}>
              start
            </StyledButtonBlock>

            <StyledButtonBlock $isBlue onClick={timer.pause}>
              pause
            </StyledButtonBlock>

            <StyledButtonBlock
              $isRed
              onClick={() => {
                timer.reset({
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
        </StyledContentBody>
      </StyledContentWrapper>
    </>
  )
}

function TimerWithoutUpdate() {
  const onCancelCallbackTriggeredState = useState(false)
  const onStartCallbackTriggeredState = useState(false)
  const onEndCallbackTriggeredState = useState(false)

  const timer = useTimer(3, {
    preventUpdate: true,
    onStart: () => onStartCallbackTriggeredState[1](true),
    onCancel: () => onCancelCallbackTriggeredState[1](true),
    onEnd: () => onEndCallbackTriggeredState[1](true),
  })

  return (
    <>
      <StyledContentWrapperCombiner>
        <StyledContentWrapper>
          <StyledContentTitle>Current state</StyledContentTitle>

          <StyledContentBody>
            <ComponentState title='Is Timer running' value={timer.isRunning} />
            <ComponentState title='Current time' isDisabled />
            <ComponentState title='Years' isDisabled />
            <ComponentState title='Days' isDisabled />
            <ComponentState title='Hours' isDisabled />
            <ComponentState title='Minutes' isDisabled />
            <ComponentState title='Seconds' isDisabled />
          </StyledContentBody>
        </StyledContentWrapper>

        <StyledContentWrapper style={{ display: 'grid', gridTemplateRows: 'min-content 1fr' }}>
          <StyledContentTitle>Callbacks</StyledContentTitle>

          <StyledContentBody>
            <StyledHorizontalBlockWrapper>
              <CallbackBlock state={onEndCallbackTriggeredState} title='onEnd' />
              <CallbackBlock state={onStartCallbackTriggeredState} title='onStart' />
              <CallbackBlock state={onCancelCallbackTriggeredState} title='onCancel' />
              <CallbackBlock isDisabled title='onReset' />
              <CallbackBlock isDisabled title='onTimeSet' />
              <CallbackBlock isDisabled title='onUpdate' />
            </StyledHorizontalBlockWrapper>
          </StyledContentBody>
        </StyledContentWrapper>
      </StyledContentWrapperCombiner>

      <StyledContentWrapper>
        <StyledContentTitle>Controls</StyledContentTitle>

        <StyledContentBody>
          <StyledHorizontalBlockWrapper>
            <StyledButtonBlock $isGreen onClick={timer.start}>
              start
            </StyledButtonBlock>

            <StyledButtonBlock $isRed onClick={timer.cancel}>
              cancel
            </StyledButtonBlock>
          </StyledHorizontalBlockWrapper>
        </StyledContentBody>
      </StyledContentWrapper>
    </>
  )
}

export default function TimerComponent() {
  const [preventUpdate, setPreventUpdate] = useState(false)
  const [stopwatch, setStopwatch] = useState(false)

  return (
    <StyledTimerSection $stopwatch={stopwatch} $preventUpdate={preventUpdate}>
      <StyledSectionTitle>
        <div>Timer</div>

        <div style={{ display: 'grid' }}>
          <label>
            <input
              type='checkbox'
              name='update'
              id='update'
              checked={preventUpdate}
              onChange={() => {
                setPreventUpdate(prev => {
                  const newValue = !prev
                  newValue && setStopwatch(false)
                  return newValue
                })
              }}
            />
            Prevent update
          </label>

          <label>
            <input
              type='checkbox'
              name='stopwatch'
              id='stopwatch'
              checked={stopwatch}
              onChange={() => {
                setStopwatch(prev => {
                  const newValue = !prev
                  newValue && setPreventUpdate(false)
                  return newValue
                })
              }}
            />
            Stopwatch
          </label>
        </div>
      </StyledSectionTitle>

      {stopwatch ? <Stopwatch /> : preventUpdate ? <TimerWithoutUpdate /> : <StandartTimer />}
    </StyledTimerSection>
  )
}
