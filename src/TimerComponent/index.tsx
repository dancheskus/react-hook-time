import { useState } from 'react'

import { StyledSectionTitle, StyledTimerSection } from './style'
import StandartTimer from './StandartTimer'
import TimerWithoutUpdate from './TimerWithoutUpdate'
import Stopwatch from './Stopwatch'

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
