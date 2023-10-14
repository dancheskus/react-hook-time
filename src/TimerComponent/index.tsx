import { useState } from 'react'

import { StyledSectionTitle, StyledTimerSection } from './style'
import StandartTimer from './StandartTimer'
import TimerWithoutUpdate from './TimerWithoutUpdate'
import Stopwatch from './Stopwatch'

export default function TimerComponent() {
  const [preventRerender, setPreventRerender] = useState(false)
  const [stopwatch, setStopwatch] = useState(false)

  return (
    <StyledTimerSection $stopwatch={stopwatch} $preventRerender={preventRerender}>
      <StyledSectionTitle>
        <div>Timer</div>

        <div style={{ display: 'grid' }}>
          <label>
            <input
              type='checkbox'
              name='update'
              id='update'
              checked={preventRerender}
              onChange={() => {
                setPreventRerender(prev => {
                  const newValue = !prev
                  newValue && setStopwatch(false)
                  return newValue
                })
              }}
            />
            Prevent rerender
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
                  newValue && setPreventRerender(false)
                  return newValue
                })
              }}
            />
            Stopwatch
          </label>
        </div>
      </StyledSectionTitle>

      {stopwatch ? <Stopwatch /> : preventRerender ? <TimerWithoutUpdate /> : <StandartTimer />}
    </StyledTimerSection>
  )
}
