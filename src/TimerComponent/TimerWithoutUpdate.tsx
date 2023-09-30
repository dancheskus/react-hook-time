import { useState } from 'react'

import useTimer from '../useTimer/useTimer'
import { StyledContentWrapperCombiner } from '../style'
import CallbackBlocks from './CallbackBlocks'
import StateBlocks from './StateBlocks'
import Controlls from './Controlls'

export default function TimerWithoutUpdate() {
  const onCancelCallbackTriggeredState = useState(false)
  const onStartCallbackTriggeredState = useState(false)
  const onEndCallbackTriggeredState = useState(false)

  const initialTime = 3

  const timer = useTimer(initialTime, {
    preventUpdate: true,
    onStart: () => onStartCallbackTriggeredState[1](true),
    onCancel: () => onCancelCallbackTriggeredState[1](true),
    onEnd: () => onEndCallbackTriggeredState[1](true),
  })

  return (
    <>
      <StyledContentWrapperCombiner>
        <StateBlocks timer={timer} withoutUpdate initialTime={initialTime} />

        <CallbackBlocks
          onEndCallbackTriggeredState={onEndCallbackTriggeredState}
          onStartCallbackTriggeredState={onStartCallbackTriggeredState}
          onResetCallbackTriggeredState={onCancelCallbackTriggeredState}
          withoutUpdate
        />
      </StyledContentWrapperCombiner>

      <Controlls timer={timer} withoutUpdate />
    </>
  )
}
