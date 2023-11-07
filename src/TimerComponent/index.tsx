import { useState } from 'react'

import { StyledSectionTitle, StyledTimerSection, StyledFooter, StlyedFooterItem } from './style'
import StandartTimer from './StandartTimer'
import TimerWithoutUpdate from './TimerWithoutUpdate'
import Stopwatch from './Stopwatch'

const npmLink = 'https://www.npmjs.com/package/react-hook-time'
const githubLink = 'https://github.com/dancheskus/react-hook-time'

export default function TimerComponent() {
  const [stopUpdate, setstopUpdate] = useState(false)
  const [stopwatch, setStopwatch] = useState(false)

  return (
    <StyledTimerSection $stopwatch={stopwatch} $stopUpdate={stopUpdate}>
      <StyledSectionTitle>
        <a href={npmLink} target='_blank' rel='noreferrer'>
          react-hook-time
        </a>

        <div style={{ display: 'grid' }}>
          <label>
            <input
              type='checkbox'
              name='update'
              id='update'
              checked={stopUpdate}
              onChange={() => {
                setstopUpdate(prev => {
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
                  newValue && setstopUpdate(false)
                  return newValue
                })
              }}
            />
            Stopwatch
          </label>
        </div>
      </StyledSectionTitle>

      {stopwatch ? <Stopwatch /> : stopUpdate ? <TimerWithoutUpdate /> : <StandartTimer />}

      <StyledFooter>
        <StlyedFooterItem href={githubLink} target='_blank'>
          github
        </StlyedFooterItem>

        <span />

        <StlyedFooterItem href={npmLink} target='_blank'>
          npm
        </StlyedFooterItem>
      </StyledFooter>
    </StyledTimerSection>
  )
}
