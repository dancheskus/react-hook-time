import { useState } from 'react'

import useTimer from '../useTimer/useTimer'
import { StyledContentWrapperCombiner } from '../style'
import CallbackBlocks from './CallbackBlocks'
import StateBlocks from './StateBlocks'
import Controlls from './Controlls'

export default function Stopwatch() {
  const onStartCallbackTriggeredState = useState(false)
  const onPauseCallbackTriggeredState = useState(false)
  const onResetCallbackTriggeredState = useState(false)
  const onTimeSetCallbackTriggeredState = useState(false)
  const onUpdateCallbackTriggeredState = useState(false)

  const stopwatch = useTimer({
    stopwatch: true,
    onPause: time => onPauseCallbackTriggeredState[1](true),
    onStart: time => onStartCallbackTriggeredState[1](true),
    onReset: time => onResetCallbackTriggeredState[1](true),
    onTimeSet: time => onTimeSetCallbackTriggeredState[1](true),
    onUpdate: time => onUpdateCallbackTriggeredState[1](true),
  })

  return (
    <>
      <StyledContentWrapperCombiner>
        <StateBlocks timer={stopwatch} initialTime={0} />

        <CallbackBlocks
          onStartCallbackTriggeredState={onStartCallbackTriggeredState}
          onPauseCallbackTriggeredState={onPauseCallbackTriggeredState}
          onResetCallbackTriggeredState={onResetCallbackTriggeredState}
          onTimeSetCallbackTriggeredState={onTimeSetCallbackTriggeredState}
          onUpdateCallbackTriggeredState={onUpdateCallbackTriggeredState}
        />
      </StyledContentWrapperCombiner>

      <Controlls timer={stopwatch} />
    </>
  )
}
