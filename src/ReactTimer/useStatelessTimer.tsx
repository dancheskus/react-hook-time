import { useRef, useState } from 'react'

import { TTimeUnit } from './types'
import useOnMount from './useOnMount'
import useOnUnmount from './useOnUnmount'
import { convertTimeToMs } from './utils'

interface IUseStatelessTimer {
  autostart?: boolean
  onStart?: () => void
  onCancel?: () => void
  onEnd?: () => void
  timeUnit?: TTimeUnit
}

export default function useStatelessTimer(initialTime: number, settings?: IUseStatelessTimer) {
  const { autostart, onStart, onCancel, onEnd, timeUnit = 'sec' } = settings || {}

  const timerRef = useRef<number | null>(null)
  const [isRunning, setIsRunning] = useState(!!autostart)

  const convertedInitialTime = convertTimeToMs(initialTime, timeUnit)

  const stopTimer = () => {
    if (!timerRef.current) return

    setIsRunning(false)
    clearInterval(timerRef.current)
    timerRef.current = null
  }

  const start = () => {
    if (timerRef.current) return

    onStart && onStart()

    setIsRunning(true)

    timerRef.current = setTimeout(() => {
      onEnd && onEnd()
      stopTimer()
    }, convertedInitialTime)
  }

  useOnMount(() => autostart && start())

  useOnUnmount(stopTimer)

  const cancel = () => {
    if (!timerRef.current) return

    onCancel && onCancel()
    stopTimer()
  }

  return { start, cancel, isRunning }
}
