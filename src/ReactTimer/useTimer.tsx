import { useEffect, useRef, useState } from 'react'

import { IUpdateTimeSettings, TTimerInitialTime, TTimeUnit } from './types'
import { convertMsToSec, convertMsToTimeObj, convertTimeToMs } from './utils'

export default function useTimer(
  initialTime: TTimerInitialTime,
  {
    autostart,
    speedUpFirstSecond,
    onPause,
    onStart,
    onReset,
    onUpdate,
    onTimeSet,
    onEnd,
    timeUnit = 'sec',
  }: {
    autostart?: boolean
    speedUpFirstSecond?: boolean
    onPause?: (currentTime: number) => void
    onStart?: (currentTime: number) => void
    onReset?: (currentTime: number) => void
    onTimeSet?: (currentTime: number) => void
    onUpdate?: (currentTime: number) => void
    onEnd?: () => void
    timeUnit?: Exclude<TTimeUnit, 'ms'>
  },
) {
  const timerRef = useRef<number | null>(null)
  const firstTickRef = useRef<number | null>(null)

  const [convertedInitialTimeInMs, setConvertedInitialTimeInMs] = useState(convertTimeToMs(initialTime, timeUnit))

  const [currentTime, setCurrentTime] = useState(convertedInitialTimeInMs)
  const [isRunning, setIsRunning] = useState(!!autostart)
  const [justRendered, setJustRendered] = useState(true)

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
    autostart && start()
  }, [])

  useEffect(() => {
    if (justRendered) return setJustRendered(false)

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
        }, 1000)
      },
      speedUpFirstSecond ? 300 : 1000,
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

    setConvertedInitialTimeInMs(updatedTime)

    updateTime({ updatedTime, continueIfWasRunning, startIfWasStopped })
  }

  const incTimeBy = (
    timeAmount: TTimerInitialTime,
    setTimeSettings?: IUpdateTimeSettings & { timeUnit?: TTimeUnit },
  ) => {
    const { timeUnit = 'sec', continueIfWasRunning, startIfWasStopped } = setTimeSettings || {}

    const updatedTime = currentTime + convertTimeToMs(timeAmount, timeUnit)

    setConvertedInitialTimeInMs(updatedTime)

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

    setConvertedInitialTimeInMs(updatedTime)

    updateTime({ updatedTime, continueIfWasRunning, startIfWasStopped })
  }

  const reset = (resetSettings?: IUpdateTimeSettings) => {
    const { startIfWasStopped, continueIfWasRunning } = resetSettings || {}

    onReset && onReset(convertMsToSec(convertedInitialTimeInMs))

    updateTime({ updatedTime: convertedInitialTimeInMs, continueIfWasRunning, startIfWasStopped })
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
