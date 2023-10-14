import { useEffect, useRef, useState } from 'react'

import {
  TTimerInitialTime,
  TTimeUnit,
  ITimerWithoutUpdate,
  IStopwatch,
  ITimer,
  ITimerResultWithUpdate,
  ITimerResultWithoutUpdate,
  IChainingFunctions,
} from './types'
import useOnMount from './useOnMount'
import useOnUnmount from './useOnUnmount'
import { convertMsToSec, convertMsToTimeObj, convertTimeToMs } from './utils'

export default function useTimer<T extends ITimer | ITimerWithoutUpdate | IStopwatch>(
  initialTimeOrSettings: TTimerInitialTime | T,
  settingsOrInitialTime?: T,
): T['preventRerender'] extends true ? ITimerResultWithoutUpdate : ITimerResultWithUpdate {
  let initialTime: TTimerInitialTime = initialTimeOrSettings as TTimerInitialTime
  let settings: T = settingsOrInitialTime as T

  if (!['number', 'string'].includes(typeof initialTimeOrSettings) && !(initialTimeOrSettings instanceof Date)) {
    // if first argument is settings object
    initialTime = 0
    settings = initialTimeOrSettings as T
  }

  let chainingFunctions: IChainingFunctions = {
    start: () => chainingFunctions,
    pause: () => chainingFunctions,
    reset: () => chainingFunctions,
    setTime: () => chainingFunctions,
    addTime: () => chainingFunctions,
    subtractTime: () => chainingFunctions,
  }

  const {
    autostart,
    preventRerender,
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
  const currentTimeRef = useRef(currentTime)
  const [isRunning, setIsRunning] = useState(!!autostart)

  const cancel = () => {
    // only for preventRerender
    if (!timerRef.current) return

    onCancel && onCancel()
    stopTimer()
  }

  const stopTimer = () => {
    if (preventRerender) {
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

  const enableSetTimeout = () => {
    firstTickRef.current = setTimeout(
      () => {
        const newValue = stopwatch ? currentTimeRef.current + 1000 : Math.max(currentTimeRef.current - 1000, 0)
        setCurrentTime(newValue)
        currentTimeRef.current = newValue

        if (newValue === 0) return

        timerRef.current = setInterval(() => {
          setCurrentTime(prev => {
            const newValue = stopwatch ? prev + 1000 : Math.max(prev - 1000, 0)
            currentTimeRef.current = newValue

            return newValue
          })
        }, stepInMs)
      },
      speedUpFirstSecond ? 300 : stepInMs,
    )
  }

  const start = () => {
    const customChainigFunctions = preventRerender ? undefined : chainingFunctions

    if (timerRef.current) return customChainigFunctions

    if (preventRerender) {
      onStart && onStart()

      setIsRunning(true)

      timerRef.current = setTimeout(() => {
        onEnd && onEnd()
        stopTimer()
      }, convertedInitialTime)

      return
    }

    if (firstTickRef.current || (!stopwatch && currentTimeRef.current === 0)) return customChainigFunctions

    onStart && onStart(convertMsToSec(currentTimeRef.current))

    setIsRunning(true)

    enableSetTimeout()

    return customChainigFunctions
  }

  useOnMount(() => autostart && start())

  useOnUnmount(stopTimer)

  const updateTime = (updatedTime: number) => {
    setCurrentTime(updatedTime)
    currentTimeRef.current = updatedTime
  }

  const setTime = (newTime: TTimerInitialTime, setTimeSettings?: { timeUnit?: TTimeUnit }) => {
    const { timeUnit = 'sec' } = setTimeSettings || {}

    const updatedTime = convertTimeToMs(newTime, timeUnit)

    onTimeSet && onTimeSet(convertMsToSec(updatedTime))

    convertedInitialTimeInMsRef.current = updatedTime

    updateTime(updatedTime)

    return chainingFunctions
  }

  const addTime = (timeAmount: TTimerInitialTime, setTimeSettings?: { timeUnit?: TTimeUnit }) => {
    const { timeUnit = 'sec' } = setTimeSettings || {}

    const updatedTime = currentTimeRef.current + convertTimeToMs(timeAmount, timeUnit)

    convertedInitialTimeInMsRef.current = updatedTime

    updateTime(updatedTime)

    return chainingFunctions
  }

  const subtractTime = (timeAmount: TTimerInitialTime, setTimeSettings?: { timeUnit?: TTimeUnit }) => {
    const { timeUnit = 'sec' } = setTimeSettings || {}

    let updatedTime = currentTimeRef.current - convertTimeToMs(timeAmount, timeUnit)

    if (updatedTime < 0) {
      updatedTime = 0
    }

    convertedInitialTimeInMsRef.current = updatedTime

    updateTime(updatedTime)

    return chainingFunctions
  }

  const reset = () => {
    onReset && onReset(convertMsToSec(convertedInitialTimeInMsRef.current))

    updateTime(convertedInitialTimeInMsRef.current)

    return chainingFunctions
  }

  const pause = () => {
    if (!firstTickRef.current) return chainingFunctions

    stopTimer()
    onPause && onPause(convertMsToSec(currentTimeRef.current))

    return chainingFunctions
  }

  // @ts-ignore
  chainingFunctions = { start, pause, reset, setTime, addTime, subtractTime }

  return preventRerender
    ? ({
        start,
        cancel,
        isRunning,
      } as T['preventRerender'] extends true ? ITimerResultWithoutUpdate : never)
    : ({
        start,
        pause,
        reset,
        setTime,
        addTime,
        subtractTime,
        isRunning,
        currentTime: convertMsToSec(currentTime),
        formattedCurrentTime: convertMsToTimeObj(currentTime),
      } as T['preventRerender'] extends true ? never : ITimerResultWithUpdate)
}
