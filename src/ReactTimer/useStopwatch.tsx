import { useEffect, useRef, useState } from 'react'

import { IUpdateTimeSettings, TTimerInitialTime, TTimeUnit } from './types'
import useOnMount from './useOnMount'
import useOnUnmount from './useOnUnmount'
import { convertMsToSec, convertMsToTimeObj, convertTimeToMs } from './utils'

interface IStopwatch {
  initialTime?: number
  autostart?: boolean
  onPause?: (currentTime: number) => void
  onStart?: (currentTime: number) => void
  onReset?: (currentTime: number) => void
  onTimeSet?: (currentTime: number) => void
  onUpdate?: (currentTime: number) => void
  stepInMs?: number
}

export default function useStopwatch(settings?: IStopwatch) {
  const { initialTime = 0, autostart, onPause, onStart, onReset, onTimeSet, onUpdate, stepInMs = 1000 } = settings || {}

  const timerRef = useRef<number | null>(null)

  const convertedInitialTime = convertTimeToMs(initialTime, 'sec')

  const [currentTime, setCurrentTime] = useState(convertedInitialTime)
  const [isRunning, setIsRunning] = useState(!!autostart)
  const [justRendered, setJustRendered] = useState(true)

  const stopTimer = () => {
    if (!timerRef.current) return

    setIsRunning(false)

    clearInterval(timerRef.current)
    timerRef.current = null
  }

  useEffect(() => {
    if (justRendered) return setJustRendered(false)

    onUpdate && onUpdate(convertMsToSec(currentTime))
  }, [currentTime])

  const start = () => {
    if (timerRef.current) return

    onStart && onStart(convertMsToSec(currentTime))

    setIsRunning(true)

    timerRef.current = setInterval(() => {
      setCurrentTime(prev => prev + 1000)
    }, stepInMs)
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
      setTimeout(() => setCurrentTime(updatedTime), 0)
      start()
    } else {
      stopTimer()
      setCurrentTime(updatedTime)
    }
  }

  const setTime = (newTime: TTimerInitialTime, setTimeSettings?: IUpdateTimeSettings & { timeUnit?: TTimeUnit }) => {
    const { timeUnit = 'sec', continueIfWasRunning, startIfWasStopped } = setTimeSettings || {}

    const updatedTime = convertTimeToMs(newTime, timeUnit)

    onTimeSet && onTimeSet(convertMsToSec(updatedTime))

    updateTime({ updatedTime, continueIfWasRunning, startIfWasStopped })
  }

  const incTimeBy = (
    timeAmount: TTimerInitialTime,
    setTimeSettings?: IUpdateTimeSettings & { timeUnit?: TTimeUnit },
  ) => {
    const { timeUnit = 'sec', continueIfWasRunning, startIfWasStopped } = setTimeSettings || {}

    const updatedTime = currentTime + convertTimeToMs(timeAmount, timeUnit)

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

    updateTime({ updatedTime, continueIfWasRunning, startIfWasStopped })
  }

  const reset = (resetSettings?: IUpdateTimeSettings) => {
    const { startIfWasStopped, continueIfWasRunning } = resetSettings || {}

    onReset && onReset(convertMsToSec(convertedInitialTime))

    updateTime({ updatedTime: convertedInitialTime, continueIfWasRunning, startIfWasStopped })
  }

  const pause = () => {
    if (!timerRef.current) return

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
