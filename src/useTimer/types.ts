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
  stopUpdate?: true

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
  onTimeInc?: never
  onTimeDec?: never
  onStepSet?: never
  onUpdate?: never
  step?: never
}

export interface IStopwatch {
  stopwatch?: true

  stopUpdate?: never
  onCancel?: never
  onEnd?: never

  autostart?: boolean
  speedUpFirstSecond?: boolean
  onPause?: (currentTime: number) => void
  onStart?: (currentTime: number) => void
  onReset?: (currentTime: number) => void
  onTimeSet?: (currentTime: number) => void
  onTimeInc?: (currentTime: number) => void
  onTimeDec?: (currentTime: number) => void
  onStepSet?: (step: number) => void
  onUpdate?: (currentTime: number) => void
  timeUnit?: TTimeUnit
  step?: number
}

export interface ITimer {
  stopUpdate?: never
  stopwatch?: never
  onCancel?: never

  autostart?: boolean
  speedUpFirstSecond?: boolean
  onPause?: (currentTime: number) => void
  onStart?: (currentTime: number) => void
  onReset?: (currentTime: number) => void
  onTimeSet?: (currentTime: number) => void
  onTimeInc?: (currentTime: number) => void
  onTimeDec?: (currentTime: number) => void
  onStepSet?: (step: number) => void
  onUpdate?: (currentTime: number) => void
  onEnd?: () => void
  timeUnit?: TTimeUnit
  step?: number
}

export interface IChainingFunctionsWithUpdate {
  start: () => IChainingFunctionsWithUpdate
  reset: () => IChainingFunctionsWithUpdate
  setTime: (newTime: TTimerInitialTime, setTimeSettings?: { timeUnit?: TTimeUnit }) => IChainingFunctionsWithUpdate
  incTime: (timeAmount: TTimerInitialTime, setTimeSettings?: { timeUnit?: TTimeUnit }) => IChainingFunctionsWithUpdate
  decTime: (timeAmount: TTimerInitialTime, setTimeSettings?: { timeUnit?: TTimeUnit }) => IChainingFunctionsWithUpdate
  setStep: (newStep: number) => IChainingFunctionsWithUpdate
  pause: () => IChainingFunctionsWithUpdate
}

export interface IChainingFunctionsWithoutUpdate {
  start: () => IChainingFunctionsWithoutUpdate
  reset: () => IChainingFunctionsWithoutUpdate
  setTime: (newTime: TTimerInitialTime, setTimeSettings?: { timeUnit?: TTimeUnit }) => IChainingFunctionsWithoutUpdate
  incTime: (
    timeAmount: TTimerInitialTime,
    setTimeSettings?: { timeUnit?: TTimeUnit },
  ) => IChainingFunctionsWithoutUpdate
  decTime: (
    timeAmount: TTimerInitialTime,
    setTimeSettings?: { timeUnit?: TTimeUnit },
  ) => IChainingFunctionsWithoutUpdate
  cancel: () => IChainingFunctionsWithoutUpdate
}

export interface ITimerResultWithUpdate {
  start: () => ITimerResultWithUpdate
  pause: () => ITimerResultWithUpdate
  reset: () => ITimerResultWithUpdate
  setStep: (newStep: number) => IChainingFunctionsWithUpdate
  setTime: (newTime: TTimerInitialTime, setTimeSettings?: { timeUnit?: TTimeUnit }) => ITimerResultWithUpdate
  incTime: (timeAmount: TTimerInitialTime, setTimeSettings?: { timeUnit?: TTimeUnit }) => ITimerResultWithUpdate
  decTime: (timeAmount: TTimerInitialTime, setTimeSettings?: { timeUnit?: TTimeUnit }) => ITimerResultWithUpdate
  isRunning: boolean
  currentTime: number
  formattedCurrentTime: ITimeObject
}

export interface ITimerResultWithoutUpdate {
  start: () => ITimerResultWithoutUpdate
  cancel: () => ITimerResultWithoutUpdate
  reset: () => ITimerResultWithoutUpdate
  setTime: (newTime: TTimerInitialTime, setTimeSettings?: { timeUnit?: TTimeUnit }) => ITimerResultWithoutUpdate
  isRunning: boolean
  incTime: (timeAmount: TTimerInitialTime, setTimeSettings?: { timeUnit?: TTimeUnit }) => ITimerResultWithoutUpdate
  decTime: (timeAmount: TTimerInitialTime, setTimeSettings?: { timeUnit?: TTimeUnit }) => ITimerResultWithoutUpdate
}
