import { useEffect, useRef, useState } from 'react'

import {
  IUpdateTimeSettings,
  TTimerInitialTime,
  TTimeUnit,
  ITimerWithoutUpdate,
  IStopwatch,
  ITimer,
  IimerResultWithUpdate,
  IimerResultWithoutUpdate,
} from './types'
import useOnMount from './useOnMount'
import useOnUnmount from './useOnUnmount'
import { convertMsToSec, convertMsToTimeObj, convertTimeToMs } from './utils'

export default function useTimer<T extends ITimer | ITimerWithoutUpdate | IStopwatch>(
  initialTimeOrSettings: TTimerInitialTime | T,
  settingsOrInitialTime?: T,
): T['preventUpdate'] extends true ? IimerResultWithoutUpdate : IimerResultWithUpdate {
  let initialTime: TTimerInitialTime = initialTimeOrSettings as TTimerInitialTime
  let settings: T = settingsOrInitialTime as T

  if (!['number', 'string'].includes(typeof initialTimeOrSettings) && !(initialTimeOrSettings instanceof Date)) {
    // if first argument is settings object
    initialTime = 0
    settings = initialTimeOrSettings as T
  }

  const {
    autostart,
    preventUpdate,
    stopwatch,
    speedUpFirstSecond,
    onPause,
    onStart,
    onCancel,
    onReset,
    onUpdate,
    onTimeSet,
    onEnd,
    timeUnit = 'sec',
    stepInMs = 1000,
  } = settings || {}

  const timerRef = useRef<number | null>(null)
  const firstTickRef = useRef<number | null>(null)
  const justRenderedRef = useRef(true)
  const convertedInitialTime = convertTimeToMs(initialTime, timeUnit)
  const convertedInitialTimeInMsRef = useRef(convertedInitialTime)

  const [currentTime, setCurrentTime] = useState(convertedInitialTimeInMsRef.current)
  const [isRunning, setIsRunning] = useState(!!autostart)

  const cancel = () => {
    // only for preventUpdate
    if (!timerRef.current) return

    onCancel && onCancel()
    stopTimer()
  }

  const stopTimer = () => {
    if (preventUpdate) {
      if (!timerRef.current) return

      setIsRunning(false)
      clearInterval(timerRef.current)
      timerRef.current = null

      return
    }

    if (!firstTickRef.current) return

    setIsRunning(false)

    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    clearTimeout(firstTickRef.current)
    firstTickRef.current = null
  }

  useEffect(() => {
    if (justRenderedRef.current) {
      justRenderedRef.current = false
      return
    }

    if (!stopwatch && currentTime === 0) {
      onEnd && onEnd()
      stopTimer()
    }

    onUpdate && onUpdate(convertMsToSec(currentTime))
  }, [currentTime])

  const enableSetTimeout = (time: number) => {
    firstTickRef.current = setTimeout(
      () => {
        const newValue = stopwatch ? time + 1000 : Math.max(time - 1000, 0)
        setCurrentTime(newValue)

        if (newValue === 0) return

        timerRef.current = setInterval(() => {
          setCurrentTime(prev => (stopwatch ? prev + 1000 : Math.max(prev - 1000, 0)))
        }, stepInMs)
      },
      speedUpFirstSecond ? 300 : stepInMs,
    )
  }

  const startWithTime = (time: number) => {
    if (timerRef.current || firstTickRef.current || !time) return

    onStart && onStart(convertMsToSec(currentTime))

    setIsRunning(true)

    setCurrentTime(time)

    enableSetTimeout(time)
  }

  const start = () => {
    if (timerRef.current) return

    if (preventUpdate) {
      onStart && onStart()

      setIsRunning(true)

      timerRef.current = setTimeout(() => {
        onEnd && onEnd()
        stopTimer()
      }, convertedInitialTime)

      return
    }

    if (firstTickRef.current || (!stopwatch && currentTime === 0)) return

    onStart && onStart(convertMsToSec(currentTime))

    setIsRunning(true)

    enableSetTimeout(currentTime)
  }

  useOnMount(() => autostart && start())

  useOnUnmount(stopTimer)

  const updateTime = ({
    updatedTime,
    continueIfWasRunning,
    startIfWasStopped,
  }: { updatedTime: number } & IUpdateTimeSettings) => {
    if (continueIfWasRunning && isRunning) {
      setCurrentTime(updatedTime)
    } else if (startIfWasStopped && !isRunning) {
      startWithTime(updatedTime)
    } else {
      stopTimer()
      setCurrentTime(updatedTime)
    }
  }

  const setTime = (newTime: TTimerInitialTime, setTimeSettings?: IUpdateTimeSettings & { timeUnit?: TTimeUnit }) => {
    const { timeUnit = 'sec', continueIfWasRunning, startIfWasStopped } = setTimeSettings || {}

    const updatedTime = convertTimeToMs(newTime, timeUnit)

    onTimeSet && onTimeSet(convertMsToSec(updatedTime))

    convertedInitialTimeInMsRef.current = updatedTime

    updateTime({ updatedTime, continueIfWasRunning, startIfWasStopped })
  }

  const incTimeBy = (
    timeAmount: TTimerInitialTime,
    setTimeSettings?: IUpdateTimeSettings & { timeUnit?: TTimeUnit },
  ) => {
    const { timeUnit = 'sec', continueIfWasRunning, startIfWasStopped } = setTimeSettings || {}

    const updatedTime = currentTime + convertTimeToMs(timeAmount, timeUnit)

    convertedInitialTimeInMsRef.current = updatedTime

    updateTime({ updatedTime, continueIfWasRunning, startIfWasStopped })
  }

  const decTimeBy = (
    timeAmount: TTimerInitialTime,
    setTimeSettings?: IUpdateTimeSettings & { timeUnit?: TTimeUnit },
  ) => {
    const { timeUnit = 'sec', continueIfWasRunning, startIfWasStopped } = setTimeSettings || {}

    let updatedTime = currentTime - convertTimeToMs(timeAmount, timeUnit)

    if (updatedTime < 0) {
      updatedTime = 0
    }

    convertedInitialTimeInMsRef.current = updatedTime

    updateTime({ updatedTime, continueIfWasRunning, startIfWasStopped })
  }

  const reset = (resetSettings?: IUpdateTimeSettings) => {
    const { startIfWasStopped, continueIfWasRunning } = resetSettings || {}

    onReset && onReset(convertMsToSec(convertedInitialTimeInMsRef.current))

    updateTime({ updatedTime: convertedInitialTimeInMsRef.current, continueIfWasRunning, startIfWasStopped })
  }

  const pause = () => {
    if (!firstTickRef.current) return

    stopTimer()
    onPause && onPause(convertMsToSec(currentTime))
  }

  return preventUpdate
    ? ({
        start,
        cancel,
        isRunning,
      } as T['preventUpdate'] extends true ? IimerResultWithoutUpdate : never)
    : ({
        start,
        pause,
        reset,
        setTime,
        incTimeBy,
        decTimeBy,
        isRunning,
        currentTime: convertMsToSec(currentTime),
        formattedCurrentTime: convertMsToTimeObj(currentTime),
      } as T['preventUpdate'] extends true ? never : IimerResultWithUpdate)
}
