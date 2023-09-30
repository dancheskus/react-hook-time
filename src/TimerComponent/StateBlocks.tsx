import ComponentState from '../ComponentState'
import { StyledContentWrapper, StyledContentTitle, StyledContentBody } from '../style'

interface IStateBlocks {
  initialTime: number
  timer: any
  withoutUpdate?: boolean
}

export default function StateBlocks({ initialTime, timer, withoutUpdate }: IStateBlocks) {
  const getOptions = (value: number) => (withoutUpdate ? { isDisabled: true } : { value })

  return (
    <StyledContentWrapper>
      <StyledContentTitle>Current state</StyledContentTitle>

      <StyledContentBody>
        <ComponentState title='Initial Time' value={initialTime} />
        <ComponentState title='Is Timer running' value={timer.isRunning} />
        <ComponentState title='Current time' {...getOptions(timer.currentTime)} />
        <ComponentState title='Years' {...getOptions(timer.formattedCurrentTime?.years)} />
        <ComponentState title='Days' {...getOptions(timer.formattedCurrentTime?.days)} />
        <ComponentState title='Hours' {...getOptions(timer.formattedCurrentTime?.hours)} />
        <ComponentState title='Minutes' {...getOptions(timer.formattedCurrentTime?.minutes)} />
        <ComponentState title='Seconds' {...getOptions(timer.formattedCurrentTime?.seconds)} />
      </StyledContentBody>
    </StyledContentWrapper>
  )
}
