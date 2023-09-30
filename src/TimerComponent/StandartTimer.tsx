import { useState } from 'react'

import useTimer from '../useTimer/useTimer'
import { StyledContentWrapperCombiner } from '../style'
import CallbackBlocks from './CallbackBlocks'
import StateBlocks from './StateBlocks'
import Controlls from './Controlls'

export default function StandartTimer() {
  const onStartCallbackTriggeredState = useState(false)
  const onPauseCallbackTriggeredState = useState(false)
  const onResetCallbackTriggeredState = useState(false)
  const onTimeSetCallbackTriggeredState = useState(false)
  const onUpdateCallbackTriggeredState = useState(false)
  const onEndCallbackTriggeredState = useState(false)

  const initialTime = 10

  const timer = useTimer(initialTime, {
    onPause: time => onPauseCallbackTriggeredState[1](true),
    onStart: time => onStartCallbackTriggeredState[1](true),
    onReset: time => onResetCallbackTriggeredState[1](true),
    onTimeSet: time => onTimeSetCallbackTriggeredState[1](true),
    onUpdate: time => onUpdateCallbackTriggeredState[1](true),
    onEnd: () => onEndCallbackTriggeredState[1](true),
  })

  return (
    <>
      <StyledContentWrapperCombiner>
        <StateBlocks timer={timer} initialTime={initialTime} />

        <CallbackBlocks
          onEndCallbackTriggeredState={onEndCallbackTriggeredState}
          onStartCallbackTriggeredState={onStartCallbackTriggeredState}
          onPauseCallbackTriggeredState={onPauseCallbackTriggeredState}
          onResetCallbackTriggeredState={onResetCallbackTriggeredState}
          onTimeSetCallbackTriggeredState={onTimeSetCallbackTriggeredState}
          onUpdateCallbackTriggeredState={onUpdateCallbackTriggeredState}
        />
      </StyledContentWrapperCombiner>

      <Controlls timer={timer} />
    </>
  )
}
