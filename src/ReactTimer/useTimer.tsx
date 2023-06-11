import { useEffect, useRef, useState } from 'react'

import { IUpdateTimeSettings, TTimerInitialTime, TTimeUnit } from './types'
import useOnMount from './useOnMount'
import useOnUnmount from './useOnUnmount'
import { convertMsToSec, convertMsToTimeObj, convertTimeToMs } from './utils'

interface ITimer {
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

export default function useTimer(initialTime: TTimerInitialTime, settings?: ITimer) {
  const {
    autostart,
    speedUpFirstSecond,
    onPause,
    onStart,
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
  const convertedInitialTimeInMsRef = useRef(convertTimeToMs(initialTime, timeUnit))

  const [currentTime, setCurrentTime] = useState(convertedInitialTimeInMsRef.current)
  const [isRunning, setIsRunning] = useState(!!autostart)

  const stopTimer = () => {
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

    if (currentTime === 0) {
      onEnd && onEnd()
      stopTimer()
    }

    onUpdate && onUpdate(convertMsToSec(currentTime))
  }, [currentTime])

  const enableSetTimeout = (time: number) => {
    firstTickRef.current = setTimeout(
      () => {
        const newValue = time - 1000
        setCurrentTime(newValue)

        if (newValue === 0) return

        timerRef.current = setInterval(() => {
          setCurrentTime(prev => prev - 1000)
        }, stepInMs)
      },
      speedUpFirstSecond ? 300 : stepInMs,
    )
  }

  const startWithTime = (time: number) => {
    if (timerRef.current || firstTickRef.current) return

    onStart && onStart(convertMsToSec(currentTime))

    setIsRunning(true)

    setCurrentTime(time)

    enableSetTimeout(time)
  }

  const start = () => {
    if (timerRef.current || firstTickRef.current || currentTime === 0) return

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

  return {
    start,
    pause,
    reset,
    setTime,
    incTimeBy,
    decTimeBy,
    isRunning,
    currentTime: convertMsToSec(currentTime),
    formattedCurrentTime: convertMsToTimeObj(currentTime),
  }
}
