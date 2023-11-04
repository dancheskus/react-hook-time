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
    setStep: () => chainingFunctions,
    setTime: () => chainingFunctions,
    incTime: () => chainingFunctions,
    decTime: () => chainingFunctions,
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
    step = 1000,
  } = settings || {}

  const timerRef = useRef<number | null>(null)
  const firstTickRef = useRef<number | null>(null)
  const justRenderedRef = useRef(true)
  const localStepRef = useRef(step)
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
        }, localStepRef.current)
      },
      speedUpFirstSecond ? 300 : localStepRef.current,
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
    const updatedTime = convertTimeToMs(newTime, setTimeSettings?.timeUnit || timeUnit)

    onTimeSet && onTimeSet(convertMsToSec(updatedTime))

    convertedInitialTimeInMsRef.current = updatedTime

    updateTime(updatedTime)

    return chainingFunctions
  }

  const incTime = (timeAmount: TTimerInitialTime, setTimeSettings?: { timeUnit?: TTimeUnit }) => {
    const updatedTime = currentTimeRef.current + convertTimeToMs(timeAmount, setTimeSettings?.timeUnit || timeUnit)

    convertedInitialTimeInMsRef.current = updatedTime

    updateTime(updatedTime)

    return chainingFunctions
  }

  const decTime = (timeAmount: TTimerInitialTime, setTimeSettings?: { timeUnit?: TTimeUnit }) => {
    let updatedTime = currentTimeRef.current - convertTimeToMs(timeAmount, setTimeSettings?.timeUnit || timeUnit)

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

  const setStep = (newStep: number) => {
    if (preventRerender || localStepRef.current === newStep) return

    localStepRef.current = newStep

    if (timerRef.current) {
      pause()
      start()
    }

    return chainingFunctions
  }

  // @ts-ignore
  chainingFunctions = { start, pause, reset, setTime, incTime, decTime, setStep }

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
        incTime,
        decTime,
        setStep,
        isRunning,
        currentTime: convertMsToSec(currentTime),
        formattedCurrentTime: convertMsToTimeObj(currentTime),
      } as T['preventRerender'] extends true ? never : ITimerResultWithUpdate)
}
