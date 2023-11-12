import { useEffect, useRef, useState } from 'react'

import {
  TTimerInitialTime,
  TTimeUnit,
  TTimerWithoutUpdate,
  TStopwatch,
  TTimer,
  TTimerResultWithUpdate,
  TTimerResultWithoutUpdate,
} from './types'
import useOnMount from './useOnMount'
import useOnUnmount from './useOnUnmount'
import { convertMsToSec, convertMsToTimeObj, convertTimeToMs } from './utils'

export default function useTimer<T extends TTimer | TTimerWithoutUpdate | TStopwatch>(
  initialTimeOrSettings?: TTimerInitialTime | T,
  settingsOrInitialTime?: T,
): T['stopUpdate'] extends true ? TTimerResultWithoutUpdate : TTimerResultWithUpdate {
  let initialTime: TTimerInitialTime = initialTimeOrSettings as TTimerInitialTime
  let settings: T = settingsOrInitialTime as T

  if (!['number', 'string'].includes(typeof initialTimeOrSettings) && !(initialTimeOrSettings instanceof Date)) {
    // if no first argument or it is settings object
    initialTime = 0
    settings = initialTimeOrSettings as T
  }

  const {
    autostart,
    stopUpdate,
    stopwatch,
    speedUpFirstSecond,
    onPause,
    onStart,
    onCancel,
    onReset,
    onUpdate,
    onTimeSet,
    onTimeInc,
    onTimeDec,
    onStepSet,
    onEnd,
    timeUnit = 'sec',
    step = 1000,
  } = settings || {}

  let chainingFunctions = {}

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const firstTickRef = useRef<NodeJS.Timeout | null>(null)
  const justRenderedRef = useRef(true)
  const localStepRef = useRef(step)
  const convertedInitialTime = convertTimeToMs(initialTime, timeUnit)
  const convertedInitialTimeInMsRef = useRef(convertedInitialTime)
  const statelessTimerStartedAtRef = useRef<number>(0)

  const [currentTime, setCurrentTime] = useState(convertedInitialTimeInMsRef.current)
  const currentTimeRef = useRef(currentTime)
  const [isRunning, setIsRunning] = useState(!!autostart)

  const cancel = () => {
    // only for stopUpdate
    if (!timerRef.current) return chainingFunctions

    onCancel && onCancel()
    stopTimer()

    return chainingFunctions
  }

  const stopTimer = () => {
    if (stopUpdate) {
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

  const startStatelessTimer = (time: number) => {
    statelessTimerStartedAtRef.current = Date.now()

    if (timerRef.current) clearTimeout(timerRef.current)

    timerRef.current = setTimeout(
      () => {
        statelessTimerStartedAtRef.current = 0
        onEnd && onEnd()
        stopTimer()
      },
      time < 0 ? 0 : time,
    )
  }

  const start = () => {
    if (timerRef.current) return chainingFunctions

    if (stopUpdate) {
      onStart && onStart()
      setIsRunning(true)
      startStatelessTimer(convertedInitialTime)

      return chainingFunctions
    }

    if (firstTickRef.current || (!stopwatch && currentTimeRef.current === 0)) return chainingFunctions

    onStart && onStart(convertMsToSec(currentTimeRef.current))
    setIsRunning(true)
    enableSetTimeout()

    return chainingFunctions
  }

  useOnMount(() => autostart && start())

  useOnUnmount(stopTimer)

  const updateTime = (updatedTime: number) => {
    setCurrentTime(updatedTime)
    currentTimeRef.current = updatedTime
  }

  const setTime = (newTime: TTimerInitialTime, setTimeSettings?: { timeUnit?: TTimeUnit }) => {
    if (stopUpdate) {
      if (!timerRef.current) return chainingFunctions

      const updatedTimeout = convertTimeToMs(newTime, setTimeSettings?.timeUnit || timeUnit)
      startStatelessTimer(updatedTimeout)
      convertedInitialTimeInMsRef.current = updatedTimeout

      return chainingFunctions
    }

    const updatedTime = convertTimeToMs(newTime, setTimeSettings?.timeUnit || timeUnit)
    onTimeSet && onTimeSet(convertMsToSec(updatedTime))
    convertedInitialTimeInMsRef.current = updatedTime
    updateTime(updatedTime)

    return chainingFunctions
  }

  const incTime = (timeAmount: TTimerInitialTime, setTimeSettings?: { timeUnit?: TTimeUnit }) => {
    if (stopUpdate) {
      if (!timerRef.current) return chainingFunctions

      const prevTime = Date.now() - statelessTimerStartedAtRef.current
      const updatedTimeout =
        convertedInitialTime - prevTime + convertTimeToMs(timeAmount, setTimeSettings?.timeUnit || timeUnit)
      startStatelessTimer(updatedTimeout)
      convertedInitialTimeInMsRef.current = updatedTimeout

      return chainingFunctions
    }

    const updatedTime = currentTimeRef.current + convertTimeToMs(timeAmount, setTimeSettings?.timeUnit || timeUnit)
    onTimeInc && onTimeInc(convertMsToSec(updatedTime))
    convertedInitialTimeInMsRef.current = updatedTime
    updateTime(updatedTime)

    return chainingFunctions
  }

  const decTime = (timeAmount: TTimerInitialTime, setTimeSettings?: { timeUnit?: TTimeUnit }) => {
    if (stopUpdate) {
      if (!timerRef.current) return chainingFunctions

      const prevTime = Date.now() - statelessTimerStartedAtRef.current
      const updatedTimeout =
        convertedInitialTime - prevTime - convertTimeToMs(timeAmount, setTimeSettings?.timeUnit || timeUnit)
      startStatelessTimer(updatedTimeout)
      convertedInitialTimeInMsRef.current = updatedTimeout

      return chainingFunctions
    }

    let updatedTime = currentTimeRef.current - convertTimeToMs(timeAmount, setTimeSettings?.timeUnit || timeUnit)

    if (updatedTime < 0) {
      updatedTime = 0
    }

    convertedInitialTimeInMsRef.current = updatedTime
    onTimeDec && onTimeDec(convertMsToSec(updatedTime))
    updateTime(updatedTime)

    return chainingFunctions
  }

  const reset = () => {
    if (stopUpdate) {
      if (!timerRef.current) return chainingFunctions

      startStatelessTimer(convertedInitialTimeInMsRef.current)

      return chainingFunctions
    }

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
    if (stopUpdate) return
    if (localStepRef.current === newStep) return chainingFunctions

    localStepRef.current = newStep
    onStepSet && onStepSet(newStep)

    if (timerRef.current) {
      pause()
      start()
    }

    return chainingFunctions
  }

  const getCurrentTime = () => {
    if (!stopUpdate) return

    return convertedInitialTimeInMsRef.current - (Date.now() - statelessTimerStartedAtRef.current)
  }

  const getFormattedCurrentTime = () => {
    if (!stopUpdate) return

    return convertMsToTimeObj(convertedInitialTimeInMsRef.current - (Date.now() - statelessTimerStartedAtRef.current))
  }

  const commonChain = { start, reset, setTime, incTime, decTime }

  chainingFunctions = stopUpdate ? { ...commonChain, cancel } : { ...commonChain, pause, setStep }

  type TTimerResult = T['stopUpdate'] extends true ? TTimerResultWithoutUpdate : TTimerResultWithUpdate

  return stopUpdate
    ? ({ ...chainingFunctions, isRunning, getCurrentTime, getFormattedCurrentTime } as TTimerResult)
    : ({
        ...chainingFunctions,
        isRunning,
        currentTime: convertMsToSec(currentTime),
        formattedCurrentTime: convertMsToTimeObj(currentTime),
      } as TTimerResult)
}
