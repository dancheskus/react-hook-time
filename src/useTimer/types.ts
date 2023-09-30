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

export interface ITimerWithoutUpdate {
  preventUpdate?: true

  stopwatch?: never
  autostart?: boolean
  onStart?: () => void
  onCancel?: () => void
  onEnd?: () => void
  timeUnit?: TTimeUnit

  speedUpFirstSecond?: never
  onPause?: never
  onReset?: never
  onTimeSet?: never
  onUpdate?: never
  stepInMs?: never
}

export interface IStopwatch {
  stopwatch?: true

  preventUpdate?: never
  onCancel?: never
  onEnd?: never

  autostart?: boolean
  speedUpFirstSecond?: boolean
  onPause?: (currentTime: number) => void
  onStart?: (currentTime: number) => void
  onReset?: (currentTime: number) => void
  onTimeSet?: (currentTime: number) => void
  onUpdate?: (currentTime: number) => void
  timeUnit?: Exclude<TTimeUnit, 'ms'>
  stepInMs?: number
}

export interface ITimer {
  preventUpdate?: never
  stopwatch?: never
  onCancel?: never

  autostart?: boolean
  speedUpFirstSecond?: boolean
  onPause?: (currentTime: number) => void
  onStart?: (currentTime: number) => void
  onReset?: (currentTime: number) => void
  onTimeSet?: (currentTime: number) => void
  onUpdate?: (currentTime: number) => void
  onEnd?: () => void
  timeUnit?: Exclude<TTimeUnit, 'ms'>
  stepInMs?: number
}

export interface IimerResultWithUpdate {
  start: () => void
  pause: () => void
  reset: (resetSettings?: IUpdateTimeSettings) => void
  setTime: (newTime: TTimerInitialTime, setTimeSettings?: IUpdateTimeSettings & { timeUnit?: TTimeUnit }) => void
  incTimeBy: (timeAmount: TTimerInitialTime, setTimeSettings?: IUpdateTimeSettings & { timeUnit?: TTimeUnit }) => void
  decTimeBy: (timeAmount: TTimerInitialTime, setTimeSettings?: IUpdateTimeSettings & { timeUnit?: TTimeUnit }) => void
  isRunning: boolean
  currentTime: number
  formattedCurrentTime: TTimeObject
}

export interface IimerResultWithoutUpdate {
  start: () => void
  cancel: () => void
  isRunning: boolean
}