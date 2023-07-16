import { useState } from 'react'

import ComponentState from './ComponentState'
import CallbackBlock from './CallbackBlock'
import { useStatelessTimer } from '..'
import {
  StyledButtonBlock,
  StyledContentBody,
  StyledContentTitle,
  StyledContentWrapper,
  StyledHorizontalBlockWrapper,
  StyledSectionTitle,
  StyledTimerSection,
} from './style'

export default function StatelessTimerComponent() {
  const onEndCallbackTriggeredState = useState(false)
  const onStartCallbackTriggeredState = useState(false)
  const onCancelCallbackTriggeredState = useState(false)

  const statelessTimer = useStatelessTimer(3, {
    // autostart: true,
    // timeUnit: 'min',
    onStart: () => onStartCallbackTriggeredState[1](true),
    onCancel: () => onCancelCallbackTriggeredState[1](true),
    onEnd: () => onEndCallbackTriggeredState[1](true),
  })

  return (
    <StyledTimerSection>
      <StyledSectionTitle>Stateless Timer</StyledSectionTitle>

      <StyledContentWrapper>
        <StyledContentTitle>Current state</StyledContentTitle>

        <StyledContentBody>
          <ComponentState title='Is Timer running' value={statelessTimer.isRunning} />
        </StyledContentBody>
      </StyledContentWrapper>

      <StyledContentWrapper style={{ display: 'grid', gridTemplateRows: 'min-content 1fr' }}>
        <StyledContentTitle>Callbacks</StyledContentTitle>

        <StyledContentBody>
          <StyledHorizontalBlockWrapper>
            <CallbackBlock state={onEndCallbackTriggeredState} title='onEnd' />
            <CallbackBlock state={onStartCallbackTriggeredState} title='onStart' />
            <CallbackBlock state={onCancelCallbackTriggeredState} title='onCancel' />
          </StyledHorizontalBlockWrapper>
        </StyledContentBody>
      </StyledContentWrapper>

      <StyledContentWrapper>
        <StyledContentTitle>Controls</StyledContentTitle>

        <StyledContentBody>
          <StyledHorizontalBlockWrapper>
            <StyledButtonBlock $isGreen onClick={statelessTimer.start}>
              start
            </StyledButtonBlock>

            <StyledButtonBlock $isRed onClick={statelessTimer.cancel}>
              cancel
            </StyledButtonBlock>
          </StyledHorizontalBlockWrapper>
        </StyledContentBody>
      </StyledContentWrapper>
    </StyledTimerSection>
  )
}
