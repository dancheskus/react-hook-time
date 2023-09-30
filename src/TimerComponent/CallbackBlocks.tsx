import CallbackBlock from './CallbackBlock'
import { StyledContentTitle, StyledContentBody, StyledHorizontalBlockWrapper } from './style'

type TCallbackBlocksFn = [boolean, React.Dispatch<React.SetStateAction<boolean>>]

interface ICallbackBlocks {
  withoutUpdate?: boolean
  onEndCallbackTriggeredState?: TCallbackBlocksFn
  onStartCallbackTriggeredState?: TCallbackBlocksFn
  onPauseCallbackTriggeredState?: TCallbackBlocksFn
  onResetCallbackTriggeredState?: TCallbackBlocksFn
  onTimeSetCallbackTriggeredState?: TCallbackBlocksFn
  onUpdateCallbackTriggeredState?: TCallbackBlocksFn
}

export default function CallbackBlocks({
  withoutUpdate,
  onEndCallbackTriggeredState,
  onStartCallbackTriggeredState,
  onPauseCallbackTriggeredState,
  onResetCallbackTriggeredState,
  onTimeSetCallbackTriggeredState,
  onUpdateCallbackTriggeredState,
}: ICallbackBlocks) {
  const getOptions = (cb?: TCallbackBlocksFn) => (cb ? { state: cb } : { isDisabled: true })

  return (
    <div style={{ display: 'grid', gridTemplateRows: 'min-content 1fr' }}>
      <StyledContentTitle>Callbacks</StyledContentTitle>

      <StyledContentBody>
        <StyledHorizontalBlockWrapper>
          <CallbackBlock {...getOptions(onEndCallbackTriggeredState)} title='onEnd' />
          <CallbackBlock {...getOptions(onStartCallbackTriggeredState)} title='onStart' />
          <CallbackBlock {...getOptions(onPauseCallbackTriggeredState)} title={'onPause'} />
          <CallbackBlock
            {...getOptions(onResetCallbackTriggeredState)}
            title={withoutUpdate ? 'onCancel' : 'onReset'}
          />
          <CallbackBlock {...getOptions(onTimeSetCallbackTriggeredState)} title='onTimeSet' />
          <CallbackBlock {...getOptions(onUpdateCallbackTriggeredState)} title='onUpdate' />
        </StyledHorizontalBlockWrapper>
      </StyledContentBody>
    </div>
  )
}
