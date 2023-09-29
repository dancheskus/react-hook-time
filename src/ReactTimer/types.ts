export interface TTimeObject {
  years: number
  days: number
  hours: number
  minutes: number
  seconds: number
}

export type TTimeUnit = 'ms' | 'sec' | 'min' | 'hour' | 'day'

export type TTimerInitialTime = number | string | Date

export interface IUpdateTimeSettings {
  startIfWasStopped?: boolean
  continueIfWasRunning?: boolean
}
