export type TTimeObject = {
  years: number
  days: number
  hours: number
  minutes: number
  seconds: number
}

export type TTimeUnit = 'ms' | 'sec' | 'min' | 'hour' | 'day'

export type TTimerInitialTime = number | string | Date

type TTimerCommon = {
  autostart?: boolean
  timeUnit?: TTimeUnit
}

type TTimerCommonWithUpdate = TTimerCommon & {
  stopUpdate?: never
  onCancel?: never

  speedUpFirstSecond?: boolean
  onPause?: (currentTime: number) => void
  onStart?: (currentTime: number) => void
  onReset?: (currentTime: number) => void
  onTimeSet?: (currentTime: number) => void
  onTimeInc?: (currentTime: number) => void
  onTimeDec?: (currentTime: number) => void
  onStepSet?: (step: number) => void
  onUpdate?: (currentTime: number) => void
  step?: number
}

export type TTimerWithoutUpdate = TTimerCommon & {
  stopUpdate: true

  stopwatch?: never
  onStart?: () => void
  onCancel?: () => void
  onEnd?: () => void

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

export type TStopwatch = TTimerCommonWithUpdate & {
  stopwatch?: true
  onEnd?: never
}

export type TTimer = TTimerCommonWithUpdate & {
  stopwatch?: never
  onEnd?: () => void
}

export type TTimerResultWithUpdate = {
  start: () => TTimerResultWithUpdate
  pause: () => TTimerResultWithUpdate
  reset: () => TTimerResultWithUpdate
  setStep: (newStep: number) => TTimerResultWithUpdate
  setTime: (newTime: TTimerInitialTime, setTimeSettings?: { timeUnit?: TTimeUnit }) => TTimerResultWithUpdate
  incTime: (timeAmount: TTimerInitialTime, setTimeSettings?: { timeUnit?: TTimeUnit }) => TTimerResultWithUpdate
  decTime: (timeAmount: TTimerInitialTime, setTimeSettings?: { timeUnit?: TTimeUnit }) => TTimerResultWithUpdate
  isRunning: boolean
  currentTime: number
  formattedCurrentTime: TTimeObject
}

export type TTimerResultWithoutUpdate = {
  start: () => TTimerResultWithoutUpdate
  cancel: () => TTimerResultWithoutUpdate
  reset: () => TTimerResultWithoutUpdate
  setTime: (newTime: TTimerInitialTime, setTimeSettings?: { timeUnit?: TTimeUnit }) => TTimerResultWithoutUpdate
  isRunning: boolean
  incTime: (timeAmount: TTimerInitialTime, setTimeSettings?: { timeUnit?: TTimeUnit }) => TTimerResultWithoutUpdate
  decTime: (timeAmount: TTimerInitialTime, setTimeSettings?: { timeUnit?: TTimeUnit }) => TTimerResultWithoutUpdate
}
