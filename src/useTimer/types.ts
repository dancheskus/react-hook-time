export interface ITimeObject {
  years: number
  days: number
  hours: number
  minutes: number
  seconds: number
}

export type TTimeUnit = 'ms' | 'sec' | 'min' | 'hour' | 'day'

export type TTimerInitialTime = number | string | Date

export interface ITimerWithoutUpdate {
  preventRerender?: true

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

  preventRerender?: never
  onCancel?: never
  onEnd?: never

  autostart?: boolean
  speedUpFirstSecond?: boolean
  onPause?: (currentTime: number) => void
  onStart?: (currentTime: number) => void
  onReset?: (currentTime: number) => void
  onTimeSet?: (currentTime: number) => void
  onUpdate?: (currentTime: number) => void
  timeUnit?: TTimeUnit
  stepInMs?: number
}

export interface ITimer {
  preventRerender?: never
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
  timeUnit?: TTimeUnit
  stepInMs?: number
}

export interface IChainingFunctions {
  start: () => IChainingFunctions
  pause: () => IChainingFunctions
  reset: () => IChainingFunctions
  setTime: (newTime: TTimerInitialTime, setTimeSettings?: { timeUnit?: TTimeUnit }) => IChainingFunctions
  addTime: (timeAmount: TTimerInitialTime, setTimeSettings?: { timeUnit?: TTimeUnit }) => IChainingFunctions
  subtractTime: (timeAmount: TTimerInitialTime, setTimeSettings?: { timeUnit?: TTimeUnit }) => IChainingFunctions
}

export interface ITimerResultWithUpdate {
  start: () => ITimerResultWithUpdate
  pause: () => ITimerResultWithUpdate
  reset: () => ITimerResultWithUpdate
  setTime: (newTime: TTimerInitialTime, setTimeSettings?: { timeUnit?: TTimeUnit }) => ITimerResultWithUpdate
  addTime: (timeAmount: TTimerInitialTime, setTimeSettings?: { timeUnit?: TTimeUnit }) => ITimerResultWithUpdate
  subtractTime: (timeAmount: TTimerInitialTime, setTimeSettings?: { timeUnit?: TTimeUnit }) => ITimerResultWithUpdate
  isRunning: boolean
  currentTime: number
  formattedCurrentTime: ITimeObject
}

export interface ITimerResultWithoutUpdate {
  start: () => IChainingFunctions
  cancel: () => void
  isRunning: boolean
}
