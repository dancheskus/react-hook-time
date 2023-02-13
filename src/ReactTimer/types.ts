export type TTimeUnit = 'ms' | 'sec' | 'min' | 'hour' | 'day'

export type TTimerInitialTime = number | string | Date

export interface IUpdateTimeSettings {
  startIfWasStopped?: boolean
  continueIfWasRunning?: boolean
}
